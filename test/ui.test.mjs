import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import test from 'node:test'

const clientUrl = new URL('../lib/client.js', import.meta.url)

const entry = (id, label, order, registrant = 'fixture') => ({
  registrant,
  options: { id, label, order },
})

function createReact() {
  const scopes = new Map()
  let activeScope = 'default'
  let cursor = 0
  return {
    beginRender(scope = 'default') {
      activeScope = scope
      cursor = 0
      if (!scopes.has(scope)) scopes.set(scope, [])
    },
    createElement(type, props, ...children) {
      return { type, props: props || {}, children: children.flat(Infinity) }
    },
    useCallback(fn) { return fn },
    useMemo(fn) { return fn() },
    useState(initial) {
      const states = scopes.get(activeScope) || []
      scopes.set(activeScope, states)
      const index = cursor++
      if (!(index in states)) states[index] = typeof initial === 'function' ? initial() : initial
      return [states[index], update => { states[index] = typeof update === 'function' ? update(states[index]) : update }]
    },
    useSyncExternalStore(subscribe, snapshot) {
      subscribe(() => {})
      return snapshot()
    },
  }
}

function walk(node, visit) {
  if (node == null || typeof node === 'boolean') return
  if (Array.isArray(node)) {
    for (const child of node) walk(child, visit)
    return
  }
  if (typeof node !== 'object') return
  visit(node)
  walk(node.children, visit)
}

function textOf(node) {
  if (node == null || typeof node === 'boolean') return ''
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (typeof node !== 'object') return String(node)
  return textOf(node.children)
}

function findNode(tree, predicate) {
  let result
  walk(tree, node => {
    if (!result && predicate(node)) result = node
  })
  return result
}

function nodesOf(tree, predicate) {
  const result = []
  walk(tree, node => { if (predicate(node)) result.push(node) })
  return result
}

const emptyStored = () => JSON.stringify({
  favorites: [],
  icons: {},
  tabs: [],
  assignments: {},
  hiddenFromHome: [],
  pluginTab: [],
  floating: [],
  order: [],
})

async function loadFixture({ stored = emptyStored(), denyWrites = false, noDialog = false } = {}) {
  const source = await readFile(clientUrl, 'utf8')
  let definition
  const clicks = []
  const subscriptions = []
  const sectionEntries = [
    entry('general', '通用设置', 0, '@deepseek-ai/general'),
    entry('models', '模型', 10, '@deepseek-ai/models'),
    entry('plugins', '插件', 20, '@deepseek-ai/plugins'),
    entry('dsh-settings-hub', '设置中心', 145, 'dsh-settings-hub'),
  ]
  const tabEntries = [
    entry('inventory', '插件清单', 10, '@deepseek-ai/inventory'),
    entry('dsh-settings-hub-shortcuts', '设置快捷方式', 145, 'dsh-settings-hub'),
  ]
  const navButtons = sectionEntries.map(item => ({
    textContent: typeof item.options.label === 'function' ? item.options.label() : item.options.label,
    click() { clicks.push(`section:${item.options.id}`) },
  }))
  const tabButtons = tabEntries.map(item => ({
    textContent: item.options.label,
    click() { clicks.push(`plugin-tab:${item.options.id}`) },
  }))
  const settingsTrigger = { textContent: '设置', click() { clicks.push('settings:open') } }
  const dialog = {
    querySelectorAll(selector) {
      return selector === 'nav button' ? navButtons : navButtons.concat(tabButtons)
    },
  }
  const documentFixture = {
    querySelector(selector) {
      if (selector === '[role="dialog"][aria-modal="true"]') return noDialog ? null : dialog
      return null
    },
    querySelectorAll(selector) { return selector === 'button' ? [settingsTrigger] : [] },
  }
  const storage = {
    value: stored,
    key: null,
    getItem() { return this.value },
    setItem(key, value) {
      if (denyWrites) throw new Error('storage denied')
      this.key = key
      this.value = value
    },
  }
  const sandbox = {
    console,
    document: documentFixture,
    localStorage: storage,
    setTimeout(fn) { fn(); return 1 },
    window: { __ModuleLoader__: { load(value) { definition = value } } },
  }
  vm.runInNewContext(source, sandbox, { filename: 'lib/client.js' })
  assert.equal(definition.id, 'dsh-settings-hub')
  const React = createReact()
  const plugin = definition.factory(name => {
    assert.equal(name, 'react')
    return React
  })
  const registrations = new Map()
  const ctx = {
    slots: {
      inject(key, callback) {
        assert.ok(['settings.section', 'settings.plugins.tab', 'shell.overlay'].includes(key))
        return callback()
      },
      register(options, component) {
        registrations.set(options.name, { options, component })
        return () => registrations.delete(options.name)
      },
      entriesOfSlot(key) {
        if (key === 'settings.section') return sectionEntries
        if (key === 'settings.plugins.tab') return tabEntries
        return []
      },
      entries(key) { return this.entriesOfSlot(key) },
      getVersion() { return 1 },
      subscribe(key) {
        subscriptions.push(key)
        return () => {}
      },
    },
  }
  plugin.apply(ctx)
  function render(slot = 'settings.section') {
    React.beginRender(slot)
    return registrations.get(slot).component({ close() {} })
  }
  return {
    clicks,
    plugin,
    registrations,
    render,
    renderDock: () => render('shell.overlay'),
    renderShortcut: () => render('settings.plugins.tab'),
    storage,
    subscriptions,
    tree: render(),
  }
}

test('Client registers additive section, plugin tab and shell overlay on public rc.2 slots', async () => {
  const fixture = await loadFixture()
  assert.deepEqual(Array.from(fixture.plugin.inject), ['slots'])
  assert.equal(fixture.registrations.get('settings.section').options.id, 'dsh-settings-hub')
  assert.equal(fixture.registrations.get('settings.plugins.tab').options.id, 'dsh-settings-hub-shortcuts')
  assert.equal(fixture.registrations.get('shell.overlay').options.id, 'dsh-settings-hub-dock')
  assert.equal(fixture.registrations.get('settings.section').options.label(), '设置中心')
  assert.equal(textOf(fixture.tree).split('设置快捷方式').length - 1, 0)
  for (const label of ['设置导航中心', '通用设置', '模型', '插件', '插件清单']) assert.match(textOf(fixture.tree), new RegExp(label))
  const tabs = nodesOf(fixture.tree, node => node.props?.role === 'tab').map(textOf)
  assert.deepEqual(tabs, ['首页', '收藏'])
})

test('theme-aware typography keeps current DSH tokens in both color schemes', async () => {
  const fixture = await loadFixture()
  const root = findNode(fixture.tree, node => node.type === 'section' && node.props['aria-labelledby'] === 'dsh-settings-hub-title')
  const heading = findNode(fixture.tree, node => node.type === 'h2')
  const intro = findNode(fixture.tree, node => node.type === 'p' && textOf(node).startsWith('配置图标'))
  const search = findNode(fixture.tree, node => node.type === 'input' && node.props.type === 'search')
  const card = findNode(fixture.tree, node => node.type === 'div' && node.props.role === 'listitem')
  const cardName = findNode(fixture.tree, node => node.type === 'span' && textOf(node) === '通用设置')
  assert.equal(root.props.style.color, 'var(--dsw-alias-label-primary, CanvasText)')
  assert.equal(root.props.style.colorScheme, 'light dark')
  assert.equal(root.props.style.fontFamily, 'inherit')
  assert.equal(heading.props.style.color, 'var(--dsw-alias-label-primary, CanvasText)')
  assert.equal(intro.props.style.color, 'var(--dsw-alias-label-secondary, CanvasText)')
  assert.equal(search.props.style.background, 'var(--dsw-alias-bg-layer-1, Canvas)')
  assert.equal(card.props.style.background, 'var(--dsw-alias-bg-layer-2, Canvas)')
  assert.equal(cardName.props.style.color, 'var(--dsw-alias-label-primary, CanvasText)')
})

test('quick open activates existing official controls and can request the settings dialog', async () => {
  const fixture = await loadFixture()
  const buttons = nodesOf(fixture.tree, node => node.type === 'button' && node.props['aria-label']?.startsWith('打开 '))
  buttons.find(node => node.props['aria-label'] === '打开 通用设置').props.onClick()
  buttons.find(node => node.props['aria-label'] === '打开 插件清单').props.onClick()
  assert.deepEqual(fixture.clicks, ['section:general', 'section:plugins', 'plugin-tab:inventory'])

  const closed = await loadFixture({ noDialog: true })
  findNode(closed.tree, node => node.props?.['aria-label'] === '打开 通用设置').props.onClick()
  assert.deepEqual(closed.clicks, ['settings:open'])
})

test('icon selection previews immediately and persists with the bounded v2 preference shape', async () => {
  const fixture = await loadFixture()
  findNode(fixture.tree, node => node.type === 'button' && textOf(node) === '编辑布局').props.onClick()
  let tree = fixture.render()
  findNode(tree, node => node.type === 'select' && node.props['aria-label'] === '设置 模型 图标').props.onChange({ target: { value: 'shield' } })
  assert.equal(fixture.storage.key, null)
  tree = fixture.render()
  const modelCard = findNode(tree, node => node.props?.role === 'listitem' && textOf(node).includes('模型设置页面 · models'))
  assert.ok(nodesOf(modelCard, node => node.type === 'svg').some(node => node.props['data-icon'] === 'shield'))
  assert.match(textOf(tree), /图标已在草稿中预览/)
  findNode(tree, node => node.type === 'button' && textOf(node) === '保存').props.onClick()
  assert.equal(fixture.storage.key, 'dsh-settings-hub:preferences:v1')
  assert.deepEqual(JSON.parse(fixture.storage.value), {
    favorites: [],
    icons: { 'section:models': 'shield' },
    tabs: [],
    assignments: {},
    hiddenFromHome: [],
    pluginTab: [],
    floating: [],
    order: ['section:general', 'section:models', 'section:plugins', 'plugin-tab:inventory'],
  })
})

test('legacy tab assignments migrate to multiple internal-page assignments and invalid icons fail closed', async () => {
  const fixture = await loadFixture({
    stored: JSON.stringify({
      favorites: ['section:general'],
      icons: { 'section:models': 'shield', 'section:general': 'remote-image', 'invalid key': 'bell' },
      tabs: [{ id: 'tab-1', label: '常用' }],
      assignments: { 'section:models': 'tab-1' },
    }),
  })
  assert.ok(nodesOf(fixture.tree, node => node.type === 'svg').some(node => node.props['data-icon'] === 'shield'))
  findNode(fixture.tree, node => node.type === 'button' && textOf(node) === '编辑布局').props.onClick()
  const tree = fixture.render()
  const tabCheckbox = findNode(tree, node => node.type === 'input' && node.props['aria-label'] === '内页：常用显示 模型')
  assert.equal(tabCheckbox.props.checked, true)
})

test('items can combine home, multiple internal pages, plugin tab and floating placement with one saved order', async () => {
  const fixture = await loadFixture()
  findNode(fixture.tree, node => node.type === 'button' && textOf(node) === '编辑布局').props.onClick()
  let tree = fixture.render()
  const newPageInput = findNode(tree, node => node.props?.['aria-label'] === '新内页名称')
  newPageInput.props.onChange({ target: { value: '常用插件' } })
  tree = fixture.render()
  findNode(tree, node => node.type === 'button' && textOf(node) === '添加内页').props.onClick()
  tree = fixture.render()

  findNode(tree, node => node.props?.['aria-label'] === '内页：常用插件显示 模型').props.onChange({ target: { checked: true } })
  tree = fixture.render()
  findNode(tree, node => node.props?.['aria-label'] === 'DSH 插件页 Tab显示 模型').props.onChange({ target: { checked: true } })
  tree = fixture.render()
  findNode(tree, node => node.props?.['aria-label'] === '右下角显示 模型').props.onChange({ target: { checked: true } })
  tree = fixture.render()
  findNode(tree, node => node.props?.['aria-label'] === '设置 模型 图标').props.onChange({ target: { value: 'bot' } })
  tree = fixture.render()
  findNode(tree, node => node.props?.['aria-label'] === '上移 模型').props.onClick()
  tree = fixture.render()
  findNode(tree, node => node.type === 'button' && textOf(node) === '保存').props.onClick()

  const saved = JSON.parse(fixture.storage.value)
  assert.deepEqual(saved.assignments, { 'section:models': ['tab-1'] })
  assert.deepEqual(saved.pluginTab, ['section:models'])
  assert.deepEqual(saved.floating, ['section:models'])
  assert.deepEqual(saved.order.slice(0, 2), ['section:models', 'section:general'])

  tree = fixture.render()
  const pageTab = findNode(tree, node => node.props?.role === 'tab' && textOf(node) === '常用插件')
  pageTab.props.onClick()
  tree = fixture.render()
  assert.match(textOf(tree), /模型/)
  assert.doesNotMatch(textOf(tree), /通用设置/)

  const shortcut = fixture.renderShortcut()
  assert.match(textOf(shortcut), /模型/)
  assert.ok(nodesOf(shortcut, node => node.type === 'svg').some(node => node.props['data-icon'] === 'bot'))

  let dock = fixture.renderDock()
  const launcher = findNode(dock, node => node.type === 'button' && node.props['aria-label'] === '展开设置快捷面板')
  assert.ok(launcher)
  launcher.props.onClick()
  dock = fixture.renderDock()
  assert.match(textOf(dock), /模型/)
  assert.ok(findNode(dock, node => node.props?.['aria-label'] === '打开设置中心'))
})

test('home placement can be removed without deleting the original official entry', async () => {
  const fixture = await loadFixture()
  findNode(fixture.tree, node => node.type === 'button' && textOf(node) === '编辑布局').props.onClick()
  let tree = fixture.render()
  findNode(tree, node => node.props?.['aria-label'] === '设置中心首页显示 通用设置').props.onChange({ target: { checked: false } })
  tree = fixture.render()
  findNode(tree, node => node.type === 'button' && textOf(node) === '保存').props.onClick()
  tree = fixture.render()
  assert.doesNotMatch(textOf(tree), /通用设置/)
  assert.deepEqual(JSON.parse(fixture.storage.value).hiddenFromHome, ['section:general'])
  assert.equal(fixture.clicks.length, 0)
})

test('internal pages can be reordered and removed without changing other locations', async () => {
  const fixture = await loadFixture()
  findNode(fixture.tree, node => node.type === 'button' && textOf(node) === '编辑布局').props.onClick()
  let tree = fixture.render()
  for (const label of ['甲', '乙']) {
    findNode(tree, node => node.props?.['aria-label'] === '新内页名称').props.onChange({ target: { value: label } })
    tree = fixture.render()
    findNode(tree, node => node.type === 'button' && textOf(node) === '添加内页').props.onClick()
    tree = fixture.render()
  }
  findNode(tree, node => node.props?.['aria-label'] === '前移内页 乙').props.onClick()
  tree = fixture.render()
  const names = nodesOf(tree, node => node.type === 'input' && node.props['aria-label']?.startsWith('重命名内页 ')).map(node => node.props.value)
  assert.deepEqual(names, ['乙', '甲'])
  findNode(tree, node => node.props?.['aria-label'] === '删除内页 甲').props.onClick()
  tree = fixture.render()
  assert.equal(findNode(tree, node => node.props?.['aria-label'] === '重命名内页 甲'), undefined)
})

test('storage denial keeps the editor open and reports that saving failed', async () => {
  const fixture = await loadFixture({ denyWrites: true })
  findNode(fixture.tree, node => node.type === 'button' && textOf(node) === '编辑布局').props.onClick()
  let tree = fixture.render()
  findNode(tree, node => node.type === 'button' && textOf(node) === '保存').props.onClick()
  tree = fixture.render()
  assert.match(textOf(tree), /保存失败：当前浏览器拒绝写入本地配置/)
  assert.ok(findNode(tree, node => node.type === 'button' && textOf(node) === '保存'))
  assert.ok(findNode(tree, node => node.type === 'button' && textOf(node) === '取消'))
  assert.equal(fixture.storage.key, null)
})

test('malformed or oversized preference state fails closed to empty bounded preferences', async () => {
  for (const stored of ['not-json', JSON.stringify(['section:general']), 'x'.repeat(32 * 1024 + 1)]) {
    const fixture = await loadFixture({ stored })
    assert.match(textOf(fixture.tree), /设置导航中心/)
    assert.equal(fixture.renderDock(), null)
  }
})
