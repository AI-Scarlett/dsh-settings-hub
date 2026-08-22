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
  const states = []
  let cursor = 0
  return {
    beginRender() { cursor = 0 },
    createElement(type, props, ...children) {
      return { type, props: props || {}, children: children.flat(Infinity) }
    },
    useCallback(fn) { return fn },
    useMemo(fn) { return fn() },
    useState(initial) {
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

async function loadFixture({ stored = JSON.stringify({ favorites: [], icons: {} }), denyWrites = false } = {}) {
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
  const tabEntries = [entry('inventory', '插件清单', 10, '@deepseek-ai/inventory')]
  const navButtons = sectionEntries.map(item => ({
    textContent: typeof item.options.label === 'function' ? item.options.label() : item.options.label,
    click() { clicks.push(`section:${item.options.id}`) },
  }))
  const tabButtons = tabEntries.map(item => ({
    textContent: item.options.label,
    click() { clicks.push(`plugin-tab:${item.options.id}`) },
  }))
  const dialog = {
    querySelectorAll(selector) {
      return selector === 'nav button' ? navButtons : navButtons.concat(tabButtons)
    },
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
    document: { querySelector() { return dialog } },
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
  let registration
  const ctx = {
    slots: {
      inject(key, callback) {
        assert.equal(key, 'settings.section')
        return callback()
      },
      register(options, component) {
        registration = { options, component }
        return () => {}
      },
      entriesOfSlot(key) { return key === 'settings.section' ? sectionEntries : tabEntries },
      entries(key) { return this.entriesOfSlot(key) },
      getVersion() { return 1 },
      subscribe(key) {
        subscriptions.push(key)
        return () => {}
      },
    },
  }
  plugin.apply(ctx)
  function render() {
    React.beginRender()
    return registration.component({ close() {} })
  }
  const tree = render()
  return { clicks, plugin, registration, render, storage, subscriptions, tree }
}

test('Client registers one additive settings section and reads both public ledgers', async () => {
  const fixture = await loadFixture()
  assert.deepEqual(Array.from(fixture.plugin.inject), ['slots'])
  assert.equal(fixture.registration.options.name, 'settings.section')
  assert.equal(fixture.registration.options.id, 'dsh-settings-hub')
  assert.equal(fixture.registration.options.order, 145)
  assert.equal(fixture.registration.options.label(), '设置中心')
  assert.deepEqual(fixture.subscriptions.sort(), ['settings.plugins.tab', 'settings.section'])
  const text = textOf(fixture.tree)
  for (const label of ['设置导航中心', '通用设置', '模型', '插件', '插件清单']) assert.match(text, new RegExp(label))
  const icons = []
  const iconSelectors = []
  const tabs = []
  const buttons = []
  walk(fixture.tree, node => {
    if (node.type === 'svg') icons.push(node)
    if (node.type === 'select' && node.props['aria-label']?.endsWith(' 图标')) iconSelectors.push(node)
    if (node.props?.role === 'tab') tabs.push(textOf(node))
    if (node.type === 'button') buttons.push(textOf(node))
  })
  assert.ok(icons.length >= 4)
  assert.ok(icons.every(node => node.props.fill === 'none' && node.props.stroke === 'currentColor'))
  assert.equal(iconSelectors.length, 0)
  assert.deepEqual(tabs, ['全部', '收藏'])
  assert.ok(buttons.includes('编辑布局'))
})

test('theme-aware typography uses current DSH tokens for light and dark modes', async () => {
  const fixture = await loadFixture()
  let root
  let heading
  let intro
  let search
  let card
  let cardName
  let cardMeta
  let openButton
  walk(fixture.tree, node => {
    if (node.type === 'section' && node.props['aria-labelledby'] === 'dsh-settings-hub-title') root = node
    if (node.type === 'h2') heading = node
    if (node.type === 'p' && textOf(node).startsWith('搜索并打开 DSH')) intro = node
    if (node.type === 'input' && node.props.type === 'search') search = node
    if (node.type === 'div' && node.props.role === 'listitem' && !card) card = node
    if (node.type === 'span' && textOf(node) === '通用设置') cardName = node
    if (node.type === 'span' && textOf(node) === '设置页面 · general') cardMeta = node
    if (node.type === 'button' && node.props['aria-label'] === '打开 通用设置') openButton = node
  })

  assert.equal(root.props.style.color, 'var(--dsw-alias-label-primary, CanvasText)')
  assert.equal(root.props.style.colorScheme, 'light dark')
  assert.equal(root.props.style.fontFamily, 'inherit')
  assert.equal(heading.props.style.color, 'var(--dsw-alias-label-primary, CanvasText)')
  assert.equal(heading.props.style.fontSize, '22px')
  assert.equal(intro.props.style.color, 'var(--dsw-alias-label-secondary, CanvasText)')
  assert.equal(intro.props.style.fontSize, '14px')
  assert.equal(search.props.style.background, 'var(--dsw-alias-bg-layer-1, Canvas)')
  assert.equal(search.props.style.color, 'var(--dsw-alias-label-primary, CanvasText)')
  assert.equal(card.props.style.background, 'var(--dsw-alias-bg-layer-2, Canvas)')
  assert.equal(cardName.props.style.color, 'var(--dsw-alias-label-primary, CanvasText)')
  assert.equal(cardMeta.props.style.color, 'var(--dsw-alias-label-secondary, CanvasText)')
  assert.equal(cardMeta.props.style.fontSize, '12px')
  assert.equal(openButton.props.style.color, 'var(--dsw-alias-label-primary, CanvasText)')

  let editButton
  walk(fixture.tree, node => {
    if (node.type === 'button' && textOf(node) === '编辑布局') editButton = node
  })
  editButton.props.onClick()
  const editTree = fixture.render()
  let select
  walk(editTree, node => {
    if (node.type === 'select' && node.props['aria-label'] === '设置 通用设置 图标') select = node
  })
  assert.equal(select.props.style.color, 'var(--dsw-alias-label-primary, CanvasText)')
})

test('quick open activates existing official controls without changing their DOM', async () => {
  const fixture = await loadFixture()
  const buttons = []
  walk(fixture.tree, node => {
    if (node.type === 'button' && node.props['aria-label']?.startsWith('打开 ')) buttons.push(node)
  })
  const general = buttons.find(node => node.props['aria-label'] === '打开 通用设置')
  const inventory = buttons.find(node => node.props['aria-label'] === '打开 插件清单')
  assert.ok(general)
  assert.ok(inventory)
  general.props.onClick()
  inventory.props.onClick()
  assert.deepEqual(fixture.clicks, ['section:general', 'section:plugins', 'plugin-tab:inventory'])
})

test('a built-in line icon can be assigned without mutating official controls', async () => {
  const fixture = await loadFixture()
  let editButton
  walk(fixture.tree, node => {
    if (node.type === 'button' && textOf(node) === '编辑布局') editButton = node
  })
  assert.ok(editButton)
  editButton.props.onClick()
  let tree = fixture.render()
  let modelsSelector
  walk(tree, node => {
    if (node.type === 'select' && node.props['aria-label'] === '设置 模型 图标') modelsSelector = node
  })
  assert.ok(modelsSelector)
  modelsSelector.props.onChange({ target: { value: 'shield' } })
  assert.equal(fixture.storage.key, null)
  tree = fixture.render()
  let saveButton
  walk(tree, node => {
    if (node.type === 'button' && textOf(node) === '保存') saveButton = node
  })
  assert.ok(saveButton)
  saveButton.props.onClick()
  assert.equal(fixture.storage.key, 'dsh-settings-hub:preferences:v1')
  assert.deepEqual(JSON.parse(fixture.storage.value), {
    favorites: [],
    icons: { 'section:models': 'shield' },
    tabs: [],
    assignments: {},
  })
  assert.deepEqual(fixture.clicks, [])
})

test('stored icon assignments are validated and rendered from the built-in palette', async () => {
  const fixture = await loadFixture({
    stored: JSON.stringify({
      favorites: ['section:general'],
      icons: {
        'section:models': 'shield',
        'section:general': 'remote-image',
        'invalid key': 'bell',
      },
    }),
  })
  const dataIcons = []
  const tabs = []
  walk(fixture.tree, node => {
    if (node.type === 'svg') dataIcons.push(node.props['data-icon'])
    if (node.props?.role === 'tab') tabs.push(textOf(node))
  })
  assert.ok(dataIcons.includes('shield'))
  assert.ok(dataIcons.includes('sliders'))
  assert.ok(tabs.includes('收藏'))
})

test('custom tabs are added, assigned, saved, filtered, and can return an item to default grouping', async () => {
  const fixture = await loadFixture()
  let tree = fixture.tree
  let editButton
  walk(tree, node => {
    if (node.type === 'button' && textOf(node) === '编辑布局') editButton = node
  })
  editButton.props.onClick()
  tree = fixture.render()

  let tabNameInput
  walk(tree, node => {
    if (node.type === 'input' && node.props['aria-label'] === '新 Tab 名称') tabNameInput = node
  })
  tabNameInput.props.onChange({ target: { value: '常用插件' } })
  tree = fixture.render()
  let addButton
  walk(tree, node => {
    if (node.type === 'button' && textOf(node) === '添加 Tab') addButton = node
  })
  addButton.props.onClick()
  tree = fixture.render()

  let assignmentSelect
  walk(tree, node => {
    if (node.type === 'select' && node.props['aria-label'] === '设置 插件清单 所属 Tab') assignmentSelect = node
  })
  assert.ok(assignmentSelect)
  assert.match(textOf(assignmentSelect), /Tab：常用插件/)
  assignmentSelect.props.onChange({ target: { value: 'tab-1' } })
  tree = fixture.render()
  let saveButton
  walk(tree, node => {
    if (node.type === 'button' && textOf(node) === '保存') saveButton = node
  })
  saveButton.props.onClick()
  assert.deepEqual(JSON.parse(fixture.storage.value), {
    favorites: [],
    icons: {},
    tabs: [{ id: 'tab-1', label: '常用插件' }],
    assignments: { 'plugin-tab:inventory': 'tab-1' },
  })

  tree = fixture.render()
  let customTab
  walk(tree, node => {
    if (node.props?.role === 'tab' && textOf(node) === '常用插件') customTab = node
  })
  assert.ok(customTab)
  customTab.props.onClick()
  tree = fixture.render()
  assert.match(textOf(tree), /插件清单/)
  assert.doesNotMatch(textOf(tree), /通用设置/)

  walk(tree, node => {
    if (node.type === 'button' && textOf(node) === '编辑布局') editButton = node
  })
  editButton.props.onClick()
  tree = fixture.render()
  walk(tree, node => {
    if (node.type === 'select' && node.props['aria-label'] === '设置 插件清单 所属 Tab') assignmentSelect = node
  })
  assignmentSelect.props.onChange({ target: { value: '' } })
  tree = fixture.render()
  walk(tree, node => {
    if (node.type === 'button' && textOf(node) === '保存') saveButton = node
  })
  saveButton.props.onClick()
  assert.deepEqual(JSON.parse(fixture.storage.value).assignments, {})
})

test('storage denial keeps the editor open and reports that saving failed', async () => {
  const fixture = await loadFixture({ denyWrites: true })
  let tree = fixture.tree
  let editButton
  walk(tree, node => {
    if (node.type === 'button' && textOf(node) === '编辑布局') editButton = node
  })
  editButton.props.onClick()
  tree = fixture.render()
  let saveButton
  walk(tree, node => {
    if (node.type === 'button' && textOf(node) === '保存') saveButton = node
  })
  saveButton.props.onClick()
  tree = fixture.render()
  assert.match(textOf(tree), /保存失败：当前浏览器拒绝写入本地配置/)
  const buttons = []
  walk(tree, node => {
    if (node.type === 'button') buttons.push(textOf(node))
  })
  assert.ok(buttons.includes('保存'))
  assert.ok(buttons.includes('取消'))
  assert.equal(fixture.storage.key, null)
})

test('malformed or oversized preference state fails closed to empty bounded preferences', async () => {
  for (const stored of ['not-json', JSON.stringify(['section:general']), 'x'.repeat(32 * 1024 + 1)]) {
    const fixture = await loadFixture({ stored })
    const headings = []
    walk(fixture.tree, node => {
      if (node.type === 'h3') headings.push(textOf(node))
    })
    assert.ok(!headings.includes('收藏'))
    assert.match(textOf(fixture.tree), /设置导航中心/)
  }
})
