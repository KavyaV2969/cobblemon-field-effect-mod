// Validate custom-field data packs in the real field engine and installed simulator.
//   node research/verify_custom_pack.cjs <pack-dir> [<pack-dir> ...]
// The packs are merged over the shipped catalog exactly as the mod's loader merges data packs (fields, items, abilities, trainers, mappings,
// structures), E.load applies the engine's closed validation, and every field a pack adds is attached, played for a turn and given its seed.
// The profile directory that holds the Showdown install comes from REJUVENATION_PROFILE (default: the parent of this repository).
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const profile = process.env.REJUVENATION_PROFILE || path.resolve(root, '..');
const requireSimulator = require('node:module').createRequire(path.join(profile, 'showdown/index.js'));
const { Battle } = requireSimulator('./sim/battle');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const listJson = dir => fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().map(f => path.join(dir, f)) : [];
const sandbox = { require: requireSimulator, REJUVENATION_SHOWDOWN_ROOT: './', console };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'core/src/main/resources/rejuvenation-engine.js'), 'utf8'), sandbox);
const E = sandbox.RejuvenationEngine;

function loadPack(dir, catalog) {
  const added = [];
  for (const namespace of fs.existsSync(path.join(dir, 'data')) ? fs.readdirSync(path.join(dir, 'data')) : []) {
    const base = path.join(dir, 'data', namespace, 'rejuvenation');
    for (const file of listJson(path.join(base, 'fields'))) {
      const field = readJson(file), id = namespace + ':' + path.basename(file, '.json');
      if (field.id !== id) throw new Error(`${file}: field id ${field.id} does not match its path (${id})`);
      if (catalog.fields[id]) throw new Error(`Duplicate field ${id}`);
      catalog.fields[id] = field; added.push(id);
    }
    for (const file of listJson(path.join(base, 'mappings'))) catalog.mappingDocs.push({ order: readJson(file).order || 0, path: `${namespace}:rejuvenation/mappings/${path.basename(file)}`, rules: readJson(file).rules });
    for (const file of listJson(path.join(base, 'structures'))) catalog.structureDocs.push({ order: readJson(file).order || 0, path: `${namespace}:rejuvenation/structures/${path.basename(file)}`, rules: readJson(file).rules });
    for (const file of listJson(path.join(base, 'items'))) Object.assign(catalog.items, readJson(file).items);
    for (const file of listJson(path.join(base, 'abilities'))) Object.assign(catalog.abilities, readJson(file).abilities);
  }
  return added;
}

const io = require('./catalog_io.cjs');
const loaded = io.load(root);
const catalog = { fields: loaded.fields, items: loaded.items, abilities: loaded.abilities, trainers: loaded.trainers, mappingDocs: [], structureDocs: [], default: loaded.default };
// The shipped rows are merged already; they act as one document of order 0 (resource path "rejuvenation:..."), so a pack's explicit order or
// path decides its place relative to them, exactly as the mod's (order, resource ID) merge does.
catalog.mappingDocs.push({ order: 0, path: 'rejuvenation:shipped', rules: loaded.mappings });
catalog.structureDocs.push({ order: 0, path: 'rejuvenation:shipped', rules: loaded.structures });
const shipped = Object.keys(catalog.fields).length;
const added = process.argv.slice(2).flatMap(dir => loadPack(path.resolve(dir), catalog));
// The mod orders documents by (order, resource path) before concatenating their rows.
const flatten = docs => docs.slice().sort((a, b) => a.order - b.order || (a.path < b.path ? -1 : a.path > b.path ? 1 : 0)).flatMap(d => d.rules);
const merged = { fields: catalog.fields, mappings: flatten(catalog.mappingDocs), structures: flatten(catalog.structureDocs), items: catalog.items, abilities: catalog.abilities, trainers: catalog.trainers, default: catalog.default };
try { E.load(JSON.stringify(merged)); } catch (error) { console.error('REJECTED by the field engine: ' + error.message); process.exit(1); }

let failures = 0;
for (const id of added) {
  try {
    const field = catalog.fields[id];
    const b = new Battle({ formatid: 'gen9customgame', seed: [1, 2, 3, 4] });
    E.attach(b, id);
    const set = (v, uuid) => ({ species: 'Mew', ability: 'Synchronize', moves: ['splash'], ...v, uuid, movesInfo: [{ pp: 20, maxPp: 20 }] });
    b.setPlayer('p1', { name: 'A', team: [set({ item: field.seed ? merged.items[field.seed.item].name : '' }, '00000000-0000-0000-0000-000000000001')] });
    b.setPlayer('p2', { name: 'B', team: [set({}, '00000000-0000-0000-0000-000000000002')] });
    b.choose('p1', 'team 1'); b.choose('p2', 'team 1'); b.choose('p1', 'move 1'); b.choose('p2', 'move 1');
    if (E.current(b).id !== id && !E.current(b).id) throw new Error('field did not attach');
    b.destroy();
    console.log(`OK   ${id}: attached, one turn played`);
  } catch (error) { failures++; console.error(`FAIL ${id}: ${error.message}`); }
}
console.log(`${shipped} shipped fields + ${added.length} added = ${Object.keys(catalog.fields).length}; ${merged.mappings.length} environment rules, ${merged.structures.length} structure rules`);
process.exit(failures ? 1 : 0);
