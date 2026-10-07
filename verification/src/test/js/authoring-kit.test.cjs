// Custom-field authoring kit, end to end in the installed simulator. Standalone process: the engine registers declared abilities in the shared
// simulator on load, so the example catalog is loaded exactly once here and the rejection cases run in child processes.
//
//   node verification/src/test/js/authoring-kit.test.cjs
//
// The worked example (research/custom-fields/_examples/mossy_ruins.json) is built into a data pack by research/build_custom_pack.py, merged
// over the shipped catalog, validated by the engine's closed validator and played. Writes research/test-results/authoring-kit.json.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), os = require('node:os'), assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '../../../..');
const profile = process.env.REJUVENATION_PROFILE || path.resolve(root, '..');
const requireSimulator = require('node:module').createRequire(path.join(profile, 'showdown/index.js'));
const { Battle } = requireSimulator('./sim/battle');
const python = process.env.PYTHON || 'python';
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const listJson = dir => fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().map(f => path.join(dir, f)) : [];

const out = path.join(root, 'research/test-results/example-pack');
const run = spawnSync(python, [path.join(root, 'research/build_custom_pack.py'), path.join(root, 'research/custom-fields/_examples'), out], { encoding: 'utf8' });
assert.equal(run.status, 0, 'build_custom_pack.py failed: ' + run.stderr + run.error);

const io = require(path.join(root, 'research/catalog_io.cjs'));
const catalog = io.load(root); delete catalog.notes;
const exampleBase = path.join(out, 'data/example/rejuvenation');
const exampleDocs = kind => listJson(path.join(exampleBase, kind)).map(file => ({ id: 'example:rejuvenation/' + kind + '/' + path.basename(file), doc: readJson(file) }));
// The shipped rows are already merged in their own order; as one document of order 0 they sort after the example's "example:" resource ID.
const shippedDoc = rows => ({ id: 'rejuvenation:rejuvenation/shipped.json', doc: { rules: rows } });
const shippedFieldCount = Object.keys(catalog.fields).length;
const merged = JSON.parse(JSON.stringify(catalog));
merged.fields['example:mossy_ruins'] = readJson(path.join(exampleBase, 'fields/mossy_ruins.json'));
merged.mappings = io.mergeRules([shippedDoc(catalog.mappings), ...exampleDocs('mappings')]);
merged.structures = io.mergeRules([shippedDoc(catalog.structures), ...exampleDocs('structures')]);

const sandbox = { require: requireSimulator, REJUVENATION_SHOWDOWN_ROOT: './', console };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'core/src/main/resources/rejuvenation-engine.js'), 'utf8'), sandbox);
const E = sandbox.RejuvenationEngine;
E.load(JSON.stringify(merged));

const ex = 'example:mossy_ruins';
const attach = (field, a = {}, t = {}, seed = [1, 2, 3, 4]) => {
  const b = new Battle({ formatid: 'gen9customgame', seed });
  E.attach(b, field);
  const set = (v, uuid) => ({ species: 'Mew', ability: 'Synchronize', moves: ['splash'], ...v, uuid, movesInfo: (v.moves || ['splash']).map(() => ({ pp: 20, maxPp: 20 })) });
  b.setPlayer('p1', { name: 'A', team: [set(a, '00000000-0000-0000-0000-000000000001')] });
  b.setPlayer('p2', { name: 'B', team: [set(t, '00000000-0000-0000-0000-000000000002')] });
  b.choose('p1', 'team 1'); b.choose('p2', 'team 1');
  return b;
};
const passed = [], failed = [];
function test(name, fn) { try { fn(); passed.push(name); console.log('PASS ' + name); } catch (error) { failed.push(name); process.exitCode = 1; console.error('FAIL ' + name, error); } }

test('the example is accepted next to the shipped 61 fields and is data only', () => {
  assert.equal(Object.keys(merged.fields).length, 62);
  assert.equal(shippedFieldCount, 61, 'the shipped catalog is 57 original + 4 custom');
  assert.equal(Object.values(catalog.fields).filter(f => f.custom).length, 4);
  for (const pack of ['base', 'cobbleverse']) assert(!fs.existsSync(path.join(root, 'datapack', pack, 'data/example')), 'the example is not in the shipped ' + pack + ' pack');
  const field = merged.fields[ex];
  assert.equal(field.custom, true); assert.equal(field.id, ex);
  assert(!JSON.stringify(field).includes('"script"'), 'no executable content');
});
test('type, move and Power Whip multipliers behave as authored', () => {
  const power = (mid) => { const b = attach(ex, { moves: [mid] }), [u, t] = [b.sides[0].active[0], b.sides[1].active[0]], m = b.dex.getActiveMove(mid); b.activeMove = m; const v = b.runEvent('BasePower', u, t, m, 100); b.destroy(); return v; };
  assert.equal(power('energyball'), 130, 'Grass x1.3');
  assert.equal(power('rockslide'), 120, 'physical Rock x1.2');
  assert.equal(power('powergem'), 100, 'special Rock is unchanged');
  assert.equal(power('flamethrower'), 80, 'Fire x0.8');
  assert.equal(power('powerwhip'), 195, 'Power Whip x1.5 on top of Grass x1.3');
});
test('the added secondary type changes effectiveness only (no replaced type, no extra same-type bonus)', () => {
  const b = attach(ex, { moves: ['rockslide'] }, { species: 'Vaporeon', ability: 'Water Absorb' }), [u, t] = [b.sides[0].active[0], b.sides[1].active[0]], m = b.dex.getActiveMove('rockslide');
  b.runEvent('ModifyMove', u, t, m, m);
  assert.equal(m.type, 'Rock', 'the primary type is not replaced');
  assert.equal(t.runEffectiveness(m), 1, 'Rock (neutral on Water) plus the added Grass component is super effective');
  const control = attach('rejuvenation:indoor', { moves: ['rockslide'] }, { species: 'Vaporeon', ability: 'Water Absorb' }), cm = control.dex.getActiveMove('rockslide');
  control.runEvent('ModifyMove', control.sides[0].active[0], control.sides[1].active[0], cm, cm);
  assert.equal(control.sides[1].active[0].runEffectiveness(cm), 0, 'without the field Rock Slide is neutral on Water');
  b.destroy(); control.destroy();
});
test('standard hooks: Mimicry is Rock and Nature Power is Power Whip', () => {
  const b = attach(ex, { ability: 'Mimicry' });
  assert.equal(b.sides[0].active[0].getTypes().join('/'), 'Rock');
  assert.equal(merged.fields[ex].naturePower, 'powerwhip'); assert.equal(merged.fields[ex].secretPower, 'powerwhip');
  b.destroy();
});
test('grounded Grass Pokemon recover 1/16 each turn; other types do not', () => {
  for (const [types, heals] of [[['Grass'], true], [['Fire'], false]]) {
    const b = attach(ex), u = b.sides[0].active[0];
    u.setType(types); u.hp = Math.floor(u.maxhp / 2); const before = u.hp;
    b.residualEvent('Residual');
    assert.equal(u.hp - before, heals ? Math.floor(u.maxhp / 16) : 0, types.join());
    b.destroy();
  }
});
test('seed boost applies once and is consumed; another family seed is kept', () => {
  const b = attach(ex, { item: 'Telluric Seed' }), u = b.sides[0].active[0];
  assert.equal(u.boosts.def, 1); assert.equal(u.item, ''); b.destroy();
  const c = attach(ex, { item: 'Magical Seed' }), v = c.sides[0].active[0];
  assert.equal(v.boosts.def, 0); assert.equal(v.item, 'magicalseed'); c.destroy();
});
test('counter and transition configured through data primitives', () => {
  const b = attach(ex, { moves: ['surf'] });
  assert.equal(E.current(b).id, ex);
  for (let i = 0; i < 3; i++) { b.choose('p1', 'move 1'); b.choose('p2', 'move 1'); }
  assert.equal(E.current(b).id, 'rejuvenation:swamp', 'the third Surf floods the ruins'); b.destroy();
  const a = attach(ex, { moves: ['surf'] });
  for (let i = 0; i < 2; i++) { a.choose('p1', 'move 1'); a.choose('p2', 'move 1'); }
  assert.equal(E.current(a).id, ex, 'two uses do not'); a.destroy();
});
test('selected parent rules are copied with exact counts, unchanged and in parent order', () => {
  const field = merged.fields[ex], forest = catalog.fields['rejuvenation:forest'];
  const sap = field.rules.filter(r => r.event === 'residual' && JSON.stringify(r).includes('sapsipper'));
  assert.equal(sap.length, 1, 'exactly the selected Forest Sap Sipper rule');
  assert.deepEqual(sap[0], forest.rules.find(r => r.event === 'residual' && JSON.stringify(r).includes('sapsipper')));
  assert.deepEqual(field.abilityHandlers.effectspore, forest.abilityHandlers.effectspore);
  assert(!field.rules.some(r => r.event === 'setStatus' && JSON.stringify(r).includes('leafguard')), 'unselected Forest rules are not inherited');
});

// Acceptance: copy the template, change only the documented fields, build, and the engine loads and plays it, with no engine change.
test('copying the template and changing the documented fields produces a valid loadable field', () => {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'rej-template-'));
  const inputs = path.join(work, 'inputs'); fs.mkdirSync(inputs);
  const template = readJson(path.join(root, 'research/custom-fields/_template/my_field.json'));
  Object.assign(template, { id: 'copypack:copied_field', originalId: 'COPYPACKCOPIEDFIELD', name: 'Copied Field', entryMessage: 'A copied field stirs...', specification: 'Copied_Field.md', biomes: ['minecraft:lush_caves'] });
  template.types[0] = { type: 'Fire', multiplier: 1.4, message: 'The copied field strengthened the attack!' };
  template.seed = { item: 'syntheticseed', effect: null, duration: null, message: null, stats: { atk: 1 } };
  fs.writeFileSync(path.join(inputs, 'copied_field.json'), JSON.stringify(template, null, 2));
  const pack = path.join(work, 'pack');
  const build = spawnSync(python, [path.join(root, 'research/build_custom_pack.py'), inputs, pack], { encoding: 'utf8' });
  assert.equal(build.status, 0, build.stderr);
  const result = verify(pack);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert(/copypack:copied_field: attached/.test(result.stdout));
  const field = readJson(path.join(pack, 'data/copypack/rejuvenation/fields/copied_field.json'));
  assert.equal(field.types.at(-1).multiplier, 1.4); assert.equal(field.seed.item, 'syntheticseed');
  assert(fs.existsSync(path.join(pack, 'data/copypack/rejuvenation/mappings/copypack_copied_field.json')));
  fs.rmSync(work, { recursive: true, force: true });
});

// Rejection cases: each runs in a fresh process because loading a catalog registers abilities in the shared simulator.
function copyPack() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rej-example-'));
  fs.cpSync(out, dir, { recursive: true });
  return dir;
}
function verify(pack) { return spawnSync(process.execPath, [path.join(root, 'research/verify_custom_pack.cjs'), pack], { encoding: 'utf8', env: { ...process.env, REJUVENATION_PROFILE: profile } }); }
test('a clean example pack passes the standalone pack verifier', () => {
  const result = verify(out);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert(/example:mossy_ruins: attached/.test(result.stdout));
});
for (const [label, mutate, expected] of [
  ['an unknown operator', f => f.rules.push({ event: 'residual', condition: { always: true }, actions: [{ op: 'eval', code: '1' }], source: 'bad' }), /Unknown action eval/],
  ['an unknown event', f => f.rules.push({ event: 'notAnEvent', condition: { always: true }, actions: [], source: 'bad' }), /Unknown event notAnEvent/],
  ['an unknown condition', f => f.rules.push({ event: 'residual', condition: { madeUpCondition: 1 }, actions: [], source: 'bad' }), /Malformed condition/],
  ['a transition to a missing field', f => { f.moves.surf.transition.field = 'example:missing'; }, /Invalid transition example:missing/]]) {
  test(`the engine rejects ${label} in an authored field`, () => {
    const pack = copyPack();
    const file = path.join(pack, 'data/example/rejuvenation/fields/mossy_ruins.json');
    const field = readJson(file); mutate(field); fs.writeFileSync(file, JSON.stringify(field));
    const result = verify(pack);
    fs.rmSync(pack, { recursive: true, force: true });
    assert.notEqual(result.status, 0, 'the bad field was accepted');
    assert(expected.test(result.stderr + result.stdout), 'unexpected rejection reason: ' + result.stderr + result.stdout);
  });
}
console.log(`${passed.length} authoring kit checks passed${failed.length ? ', ' + failed.length + ' failed' : ''}`);
fs.mkdirSync(path.join(root, 'research/test-results'), { recursive: true });
const receiptFile = path.join(root, 'research/test-results/authoring-kit.json');
if (fs.existsSync(receiptFile)) fs.unlinkSync(receiptFile);
fs.writeFileSync(receiptFile, JSON.stringify({ passed: passed.length, failed, tests: passed, shippedFields: shippedFieldCount, exampleBuiltFrom: 'research/custom-fields/_examples/mossy_ruins.json' }, null, 1) + '\n');
