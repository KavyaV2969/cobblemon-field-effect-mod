// Assemble the authored packs into one catalog the way the mod's loader does (RejuvenationFields.reload + RuleDocuments); the JavaScript
// counterpart of catalog_io.py. Mapping and structure documents are ordered by (order, resource id), never by pack or listing order.
const fs = require('node:fs'), path = require('node:path');
const PACK_NAMES = ['base', 'cobbleverse'];
const MAX_ORDER = 1000000;
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const listJson = dir => fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort() : [];
const packDir = (root, name) => path.join(root, 'datapack', name, 'data/rejuvenation/rejuvenation');

function docOrder(doc, where) {
  for (const key of Object.keys(doc)) if (!['schemaVersion', 'order', 'rules', 'description'].includes(key)) throw new Error(`${where}: unknown rule document key ${key}`);
  if (!Array.isArray(doc.rules)) throw new Error(`${where}: rules must be an array`);
  const order = doc.order === undefined ? 0 : doc.order;
  if (!Number.isInteger(order) || Math.abs(order) > MAX_ORDER) throw new Error(`${where}: order must be an integer within +/-${MAX_ORDER}`);
  return order;
}
/** docs: [{id, doc}] in any order -> rows ordered by (order, id). */
function mergeRules(docs) {
  return docs.map(({ id, doc }) => ({ order: docOrder(doc, id), id, doc }))
    .sort((a, b) => a.order - b.order || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0)).flatMap(d => d.doc.rules);
}
/** Merged catalog of the named packs under `root` (the repository root). */
function load(root, packs = PACK_NAMES) {
  const out = { fields: {}, items: {}, abilities: {}, trainers: {}, notes: {}, default: 'rejuvenation:indoor' };
  const mappingDocs = [], structureDocs = [];
  for (const name of packs) {
    const base = packDir(root, name);
    for (const f of listJson(path.join(base, 'fields'))) {
      const field = readJson(path.join(base, 'fields', f));
      if (out.fields[field.id]) throw new Error('Duplicate field ' + field.id);
      out.fields[field.id] = field;
    }
    for (const f of listJson(path.join(base, 'notes'))) { const doc = readJson(path.join(base, 'notes', f)); out.notes[doc.field] = doc; }
    for (const kind of ['items', 'abilities', 'trainers'])
      for (const f of listJson(path.join(base, kind)))
        for (const [k, v] of Object.entries(readJson(path.join(base, kind, f))[kind])) {
          if (out[kind][k]) throw new Error(`Duplicate ${kind} entry ${k}`);
          out[kind][k] = v;
        }
    for (const f of listJson(path.join(base, 'mappings'))) mappingDocs.push({ id: `rejuvenation:rejuvenation/mappings/${f}`, doc: readJson(path.join(base, 'mappings', f)) });
    for (const f of listJson(path.join(base, 'structures'))) structureDocs.push({ id: `rejuvenation:rejuvenation/structures/${f}`, doc: readJson(path.join(base, 'structures', f)) });
  }
  out.mappings = mergeRules(mappingDocs);
  out.structures = mergeRules(structureDocs);
  return out;
}
module.exports = { load, mergeRules, docOrder, packDir, PACK_NAMES };
