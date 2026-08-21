import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const root = new URL('../', import.meta.url)

test('package is a canonical, self-contained DSH Bundle', async () => {
  const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'))
  assert.equal(manifest.name, 'dsh-settings-hub')
  assert.equal(manifest.version, '0.1.0')
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
  const patch = await readFile(new URL('cordis.patch.yml', root), 'utf8')
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
  assert.match(client, /ctx\.slots\.subscribe\(key, notify\)/)
  assert.match(client, /slots\.entriesOfSlot\(key\)/)
  assert.match(client, /dsh-settings-hub:preferences:v1/)
  assert.match(client, /MAX_FAVORITES = 64/)
  assert.match(client, /MAX_ICON_ASSIGNMENTS = 128/)
  assert.match(client, /MAX_STORAGE_BYTES = 32 \* 1024/)
  assert.match(client, /stroke: "currentColor"/)
  assert.match(client, /fill: "none"/)
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
  assert.match(readme, /不修改、隐藏、移动或克隆官方设置导航/)
  assert.match(readme, /内置 14 个无网络依赖的线性 SVG 图标/)
  assert.match(readme, /真实 Profile：未安装/)
  assert.match(security, /No network access/)
  assert.match(readiness, /Registry PR：未提交/)
  assert.match(readiness, /公开商城：未上架/)
})
