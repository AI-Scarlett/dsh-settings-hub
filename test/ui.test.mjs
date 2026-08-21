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
  return {
    createElement(type, props, ...children) {
      return { type, props: props || {}, children: children.flat(Infinity) }
    },
    useCallback(fn) { return fn },
    useMemo(fn) { return fn() },
    useState(initial) {
      let value = typeof initial === 'function' ? initial() : initial
      return [value, update => { value = typeof update === 'function' ? update(value) : update }]
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

async function loadFixture({ stored = JSON.stringify({ favorites: [], icons: {} }) } = {}) {
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
    setItem(key, value) { this.key = key; this.value = value },
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
  const tree = registration.component({ close() {} })
  return { clicks, plugin, registration, storage, subscriptions, tree }
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
  walk(fixture.tree, node => {
    if (node.type === 'svg') icons.push(node)
    if (node.type === 'select' && node.props['aria-label']?.endsWith(' 图标')) iconSelectors.push(node)
  })
  assert.ok(icons.length >= 4)
  assert.ok(icons.every(node => node.props.fill === 'none' && node.props.stroke === 'currentColor'))
  assert.equal(iconSelectors.length, 4)
  assert.ok(iconSelectors.every(node => textOf(node).includes('自动') && textOf(node).includes('安全')))
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
  let modelsSelector
  walk(fixture.tree, node => {
    if (node.type === 'select' && node.props['aria-label'] === '设置 模型 图标') modelsSelector = node
  })
  assert.ok(modelsSelector)
  modelsSelector.props.onChange({ target: { value: 'shield' } })
  assert.equal(fixture.storage.key, 'dsh-settings-hub:preferences:v1')
  assert.deepEqual(JSON.parse(fixture.storage.value), {
    favorites: [],
    icons: { 'section:models': 'shield' },
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
  const headings = []
  walk(fixture.tree, node => {
    if (node.type === 'svg') dataIcons.push(node.props['data-icon'])
    if (node.type === 'h3') headings.push(textOf(node))
  })
  assert.ok(dataIcons.includes('shield'))
  assert.ok(dataIcons.includes('sliders'))
  assert.ok(headings.includes('收藏'))
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
