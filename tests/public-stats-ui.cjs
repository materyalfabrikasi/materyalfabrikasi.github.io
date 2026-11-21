const { readFileSync } = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]);
scripts.forEach(script => new vm.Script(script));
const main = scripts.find(script => script.includes('const materials ='));

async function scenario(snapshot, fail = false) {
  const nodes = new Map();
  const document = { getElementById(id) {
    if (!nodes.has(id)) nodes.set(id, { style: {}, value: '', innerHTML: '', textContent: '', addEventListener() {} });
    return nodes.get(id);
  }};
  let finish;
  const response = new Promise(resolve => {finish = resolve});
  const context = vm.createContext({ document, console, Intl, Date, AbortSignal,
    fetch: () => response, window: {} });
  vm.runInContext(main, context);
  assert.match(nodes.get('materialsGrid').innerHTML, /<strong>—<\/strong> önizleme/);
  // Preserve an active filter when the asynchronous snapshot arrives.
  vm.runInContext('filteredMaterials = materials.slice(0, 1); renderMaterials(filteredMaterials);', context);
  finish({ok: !fail, json: async () => snapshot});
  await new Promise(resolve => setImmediate(resolve));
  return {nodes, context};
}

(async () => {
  const pending = await scenario({version: 1, updatedAt: null, materials: {}});
  assert.match(pending.nodes.get('statsStatus').textContent, /Sayaçlar hazırlanıyor/);
  const snapshot = {version: 1, updatedAt: '2026-11-18T06:23:00Z', throughDate: '2026-11-17', materials: {'1': {previews: 1234, downloads: 0}}};
  const loaded = await scenario(snapshot);
  assert.match(loaded.nodes.get('materialsGrid').innerHTML, /1\.234<\/strong> önizleme/);
  assert.match(loaded.nodes.get('materialsGrid').innerHTML, /0<\/strong> indirme/);
  assert.equal((loaded.nodes.get('materialsGrid').innerHTML.match(/class="material-card"/g) || []).length, 1);
  assert.match(loaded.nodes.get('statsStatus').textContent, /17.11.2026/);
  for (const [data, fail] of [[null, true], [{...snapshot, materials: {'1': {previews: -1, downloads: 0}}}, false]]) {
    const bad = await scenario(data, fail);
    assert.match(bad.nodes.get('statsStatus').textContent, /görüntülenemiyor/);
    assert.match(bad.nodes.get('materialsGrid').innerHTML, /<strong>—<\/strong>/);
  }
  console.log('PASS: pending, real zero, Turkish number format, filters, failed and malformed snapshots');
})();
