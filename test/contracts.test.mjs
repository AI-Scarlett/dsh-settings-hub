import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const root = new URL('../', import.meta.url)

test('package is a canonical, self-contained DSH Bundle', async () => {
  const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
  assert.equal(manifest.name, 'dsh-settings-hub')
  assert.equal(manifest.version, '0.3.2')
  assert.equal(manifest.license, 'MIT')
  assert.equal(manifest.repository.url, 'git+https://github.com/AI-Scarlett/dsh-settings-hub.git')
  assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml')
  assert.deepEqual(manifest.dsh.client.inject, [
    '@deepseek-ai/dsh-client-runtime',
    '@deepseek-ai/dsh-client-ui-slots',
    '@deepseek-ai/dsh-client-ui-settings',
  ])
  assert.equal(manifest.dsh.client.platform, 'web')
  assert.deepEqual(Object.keys(manifest.scripts).sort(), ['check', 'test'])
  for (const lifecycle of ['preinstall', 'install', 'postinstall', 'prepare']) {
    assert.equal(manifest.scripts[lifecycle], undefined)
  }
  for (const required of ['index.mjs', 'lib/client.js', 'cordis.patch.yml', 'README.md', 'SECURITY.md', 'LICENSE']) {
    assert.ok(manifest.files.includes(required), `${required} must ship`)
  }
})

test('Bundle Patch adds one unique plugin-owned row', async () => {
  const patch = (await readFile(new URL('cordis.patch.yml', root), 'utf8')).replace(/\r\n/g, '\n')
  assert.match(patch, /^- insert:\n\s+- id: dsh-settings-hub\n\s+name: dsh-settings-hub\n\s*$/)
  assert.doesNotMatch(patch, /disabled:\s*true|ui-settings-plugin-inventory|@deepseek-ai\//)
})

test('Host remains a no-op and Browser stays on public Client seams', async () => {
  const [host, client] = await Promise.all([
    readFile(new URL('index.mjs', root), 'utf8'),
    readFile(new URL('lib/client.js', root), 'utf8'),
  ])
  assert.match(host, /export function apply\(\) \{\}/)
  assert.doesNotMatch(host, /node:|writeFile|readFile|child_process|fetch\(|ctx\./)
  assert.match(client, /window\.__ModuleLoader__\.load/)
  assert.match(client, /ctx\.slots\.inject\("settings\.section"/)
  assert.match(client, /ctx\.slots\.inject\("settings\.plugins\.tab"/)
  assert.match(client, /ctx\.slots\.inject\("shell\.overlay"/)
  assert.match(client, /ctx\.slots\.subscribe\(key, notify\)/)
  assert.match(client, /slots\.entriesOfSlot\(key\)/)
  assert.match(client, /dsh-settings-hub:preferences:v1/)
  assert.match(client, /MAX_FAVORITES = 64/)
  assert.match(client, /MAX_ICON_ASSIGNMENTS = 128/)
  assert.match(client, /MAX_CUSTOM_TABS = 12/)
  assert.match(client, /MAX_TAB_ASSIGNMENTS = 128/)
  assert.match(client, /MAX_LOCATION_ASSIGNMENTS = 128/)
  assert.match(client, /MAX_ORDERED_ITEMS = 256/)
  assert.match(client, /MAX_STORAGE_BYTES = 32 \* 1024/)
  assert.match(client, /stroke: "currentColor"/)
  assert.match(client, /fill: "none"/)
  for (const token of [
    '--dsw-alias-label-primary', '--dsw-alias-label-secondary', '--dsw-alias-bg-layer-1',
    '--dsw-alias-bg-layer-2', '--dsw-alias-border-l2', '--dsw-alias-border-l3',
    '--dsw-alias-state-business-primary', '--dsw-alias-state-business-tertiary',
  ]) assert.match(client, new RegExp(token))
  for (const obsoleteToken of [
    '--dsw-alias-label-secondary-foreground', '--dsw-alias-label-tertiary-foreground', '--dsw-alias-border-secondary',
    '--dsw-alias-surface-primary', '--dsw-alias-surface-secondary', '--dsw-alias-state-info-primary',
  ]) assert.doesNotMatch(client, new RegExp(obsoleteToken))
  assert.match(client, /"aria-label": "设置 " \+ item\.label \+ " 图标"/)
  assert.match(client, /document\.querySelector\('\[role="dialog"\]\[aria-modal="true"\]'\)/)
  for (const forbidden of [
    /MutationObserver/, /\.hidden\s*=/, /\.style\.order\s*=/, /innerHTML/, /insertAdjacentHTML/,
    /ctx\.loader/, /ctx\.reflect/, /\bFiber\b/, /fetch\(/, /XMLHttpRequest/, /WebSocket/,
    /node:fs/, /node:child_process/, /process\.env/, /Authorization/, /api[_-]?key/i,
  ]) assert.doesNotMatch(client, forbidden, `forbidden browser behavior: ${forbidden}`)
})

test('documentation keeps evidence and publication states separate', async () => {
  const [readme, security, readiness] = await Promise.all([
    readFile(new URL('README.md', root), 'utf8'),
    readFile(new URL('SECURITY.md', root), 'utf8'),
    readFile(new URL('docs/STORE_READINESS.md', root), 'utf8'),
  ])
  assert.match(readme, /不修改、隐藏、移动或克隆其他插件已有的官方设置入口/)
  assert.match(readme, /内置 14 个无网络依赖的线性 SVG 图标/)
  assert.match(readme, /真实 Profile：未安装/)
  assert.match(security, /No network access/)
  assert.match(readiness, /Registry PR：未提交/)
  assert.match(readiness, /Existing merged catalog identity remains a separate authority/)
  assert.match(readiness, /Public marketplace: existing listing remains a separate readback surface/)
})
