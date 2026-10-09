// Validate one Kanto league roster variant against the installed simulator and field engine, and generate its roster documentation.
//
//   node research/verify_kanto_gyms.cjs --variant classic|hardcore
//
// Classic and Hardcore are the two mutually exclusive roster packs (datapack/kanto-classic, datapack/kanto-hardcore). Both are checked against the
// same shared COBBLEVERSE extension (datapack/cobbleverse: field assignments, mappings, Lt. Surge gym). Per variant this writes
//   README_KANTO_<VARIANT>.md, datapack/kanto-<variant>/README.md, research/test-results/kanto-gyms-simulator-<variant>.json
// and (identically for both) docs/KANTO_LEAGUE_FIELDS.md. It also writes research/test-results/kanto-variant-isolation.json once both
// receipts exist.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), vm = require('node:vm');
const root = path.resolve(__dirname, '..'), profile = path.resolve(root, '..');
const argv = process.argv.slice(2), arg = (name, fallback) => { const i = argv.indexOf('--' + name); return i >= 0 ? argv[i + 1] : fallback; };
const variant = arg('variant', '');
if (!['classic', 'hardcore'].includes(variant)) { console.error('Usage: node research/verify_kanto_gyms.cjs --variant classic|hardcore'); process.exit(2); }
const other = variant === 'classic' ? 'hardcore' : 'classic';
const shared = path.join(root, 'datapack/cobbleverse');
const rosterDir = v => path.join(root, 'datapack', 'kanto-' + v);
const trainerFile = (v, gym) => path.join(rosterDir(v), 'data/rctmod/trainers', `kanto_${gym}.json`);
const VERSION = fs.readFileSync(path.join(root, 'gradle.properties'), 'utf8').match(/^version=(.*)$/m)[1].trim();
const label = v => v === 'classic' ? 'Classic' : 'Hardcore';
const packName = v => `rejuvenation-fields-cobbleverse-${v}-${VERSION}.zip`;
const readTrainer = (v, gym) => JSON.parse(fs.readFileSync(trainerFile(v, gym), 'utf8'));

const simRequire = require('node:module').createRequire(path.join(profile, 'showdown/index.js'));
const { Battle } = simRequire('./sim/battle'), { Dex } = simRequire('./sim/dex');
const runtime = JSON.parse(fs.readFileSync(path.join(root, 'research/test-results/kanto-gyms-runtime.json'), 'utf8'));
// Fabric normally injects Z-A Mega item and species data into its Graal Dex at startup.
// Load the exact installed resources into this isolated Node process as well.
for (const [id, addon] of Object.entries(runtime.addons)) {
  Dex.data.Items[addon.stone] = vm.runInNewContext('(' + addon.itemJS.trim() + ')');
  const mega = addon.addition.forms.find(f => f.name === 'Mega'), base = Dex.species.get(id);
  Dex.data.Pokedex[id + 'mega'] = { ...Dex.data.Pokedex[id], name: base.name + '-Mega', baseSpecies: base.name,
    forme: 'Mega', requiredItem: addon.stone, isMega: true, abilities: { 0: mega.abilities[0] },
    baseStats: { hp: mega.baseStats.hp, atk: mega.baseStats.attack, def: mega.baseStats.defence,
      spa: mega.baseStats.special_attack, spd: mega.baseStats.special_defence, spe: mega.baseStats.speed },
    heightm: mega.height / 10, weightkg: mega.weight / 10, otherFormes: undefined,
    types: [mega.primaryType || base.types[0], mega.secondaryType || base.types[1]].filter(Boolean) };
}
const io = require('./catalog_io.cjs'), catalog = io.load(root);
const sandbox = { require: simRequire, REJUVENATION_SHOWDOWN_ROOT: './', console };
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'core/src/main/resources/rejuvenation-engine.js'), 'utf8'), sandbox);
const E = sandbox.RejuvenationEngine;
E.load(JSON.stringify(catalog));
const failures = [], checks = [], gyms = {}, stats = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
function check(ok, message) { if (!ok) failures.push(message); else checks.push(message); }
const caps = { brock: 16, misty: 28, ltsurge: 36, erika: 44, sabrina: 59, koga: 68, blaine: 76, giovanni: 81,
  league_lorelei: 85, league_bruno: 85, league_agatha: 85, league_lance: 85, champion_blue: 85 };
const fields = { brock: 'crystal_cavern', misty: 'water_surface', ltsurge: 'murkwater_surface', erika: 'warped_forest',
  sabrina: 'psychic_terrain', koga: 'wasteland', blaine: 'crimson_forest', giovanni: 'deep_dark',
  league_lorelei: 'frozen_dimension', league_bruno: 'colosseum', league_agatha: 'haunted', league_lance: 'dragons_den', champion_blue: 'new_world' };
// The one declared Tera member per trainer, the Mega holder (none for Brock), and the Z-Move / Ultra Burst holder.
const expectedTera = {
  hardcore: { brock: 'sableye', misty: 'floatzel', ltsurge: 'magnezone', erika: 'ogerpon', sabrina: 'espathra', koga: 'sneasler', blaine: 'chiyu', giovanni: 'chienpao',
    league_lorelei: 'arctovish', league_bruno: 'terrakion', league_agatha: 'ceruledge', league_lance: 'roaringmoon', champion_blue: 'ursaluna' }};
expectedTera.classic = { ...expectedTera.hardcore, blaine: 'typhlosion', giovanni: 'toxtricity' };
const expectedMega = {
  hardcore: { brock: null, misty: 'gyarados', ltsurge: 'eelektross', erika: 'venusaur', sabrina: 'alakazam', koga: 'gengar', blaine: 'charizard', giovanni: 'tyranitar',
    league_lorelei: 'baxcalibur', league_bruno: 'lucario', league_agatha: 'gengar', league_lance: 'dragonite', champion_blue: 'metagross' }};
expectedMega.classic = { ...expectedMega.hardcore, koga: 'dragalge' };
const expectedZ = { giovanni: { species: 'kommoo', kind: 'z', move: 'Clangorous Soulblaze' }, league_lance: { species: 'necrozma', kind: 'ultra' }, champion_blue: { species: 'kingambit', kind: 'z', move: 'Black Hole Eclipse' } };
const expectedOrder = { koga: variant === 'classic' ? ['glimmora', 'dragalge', 'pecharunt', 'sneasler', 'naganadel', 'cinderace'] : ['glimmora', 'pecharunt', 'sneasler', 'naganadel', 'cinderace', 'gengar'] };

// Cobblemon item IDs whose Showdown ID differs (Cobblemon's Charcoal Stick is Showdown's Charcoal).
const ITEM_ALIASES = { charcoalstick: 'charcoal' };
const showdownItem = id => { const bare = id.split(':')[1].toLowerCase().replace(/[^a-z0-9]/g, ''); return ITEM_ALIASES[bare] || bare; };
const toID = text => text.toLowerCase().replace(/[^a-z0-9]/g, '');
const ASPECT_SUFFIX = [['alolan', 'alola'], ['hisuian', 'hisui'], ['hearthflame-mask', 'hearthflame'], ['wash-appliance', 'wash'], ['low_key-form', 'lowkey'],
  ['ice-rider', 'ice'], ['shadow-rider', 'shadow'], ['crowned', 'crowned'], ['dusk-fusion', 'duskmane'], ['bloodmoon', 'bloodmoon']];
function formName(mon) {
  for (const [aspect, suffix] of ASPECT_SUFFIX) if ((mon.aspects || []).includes(aspect)) return mon.species + suffix;
  return mon.species;
}
// Add-on Mega stones are registered with lower-case names (dragalgite); show them capitalised like the others.
const pretty = name => /^[a-z]/.test(name) ? name[0].toUpperCase() + name.slice(1) : name;
function item(mon) { return mon.heldItem.length ? Dex.items.get(showdownItem(mon.heldItem[0])).name : ''; }
function set(mon, index = 0) {
  return { species: Dex.species.get(formName(mon)).name, ability: Dex.abilities.get(mon.ability).name,
    item: item(mon), nature: Dex.natures.get(mon.nature).name, moves: mon.moveset.slice(),
    movesInfo: mon.moveset.map(m => ({ pp: Dex.moves.get(m).pp, maxPp: Dex.moves.get(m).pp })),
    level: mon.level, ivs: { ...mon.ivs }, evs: { ...mon.evs },
    teraType: mon.gimmicks?.tera || undefined, gender: mon.gender === 'FEMALE' ? 'F' : mon.gender === 'MALE' ? 'M' : '',
    uuid: '00000000-0000-0000-0000-' + String(index + 1).padStart(12, '0') };
}
function battle(field, team, doubles = false) {
  const b = new Battle({ formatid: doubles ? 'gen9doublescustomgame' : 'gen9customgame', seed: [11, 22, 33, 44] });
  E.attach(b, field);
  b.setPlayer('p1', { name: 'Gym', team: team.map((m, i) => set(m, i)) });
  b.setPlayer('p2', { name: 'Verifier', team: Array.from({ length: doubles ? 2 : 1 }, (_, i) => ({
    species: 'Blissey', ability: 'Natural Cure', level: 100, moves: ['splash'], movesInfo: [{ pp: 40, maxPp: 40 }], uuid: '00000000-0000-0000-0001-' + String(i + 1).padStart(12, '0') })) });
  if (b.requestState === 'teampreview') { b.choose('p1', 'team ' + team.map((_, i) => i + 1).join('')); b.choose('p2', doubles ? 'team 12' : 'team 1'); }
  return b;
}
const megaStoneOf = mon => { const it = mon.heldItem.length ? Dex.items.get(showdownItem(mon.heldItem[0])) : null; return it?.megaStone ? it : null; };

for (const [gym, cap] of Object.entries(caps)) {
  const trainer = readTrainer(variant, gym);
  gyms[gym] = trainer;
  const field = catalog.trainers['kanto_' + gym]?.field;
  check(field === 'rejuvenation:' + fields[gym] && !!catalog.fields[field], `${gym}: exact field assignment exists`);
  check(trainer.team.length === 6 && Math.max(...trainer.team.map(m => m.level)) === cap, `${gym}: six Pokemon and unchanged cap ${cap}`);
  check(trainer.ai.type === 'rb' && JSON.stringify(trainer.battleRules) === JSON.stringify(runtime.originalControls[gym].battleRules) &&
    JSON.stringify(trainer.bag) === JSON.stringify(runtime.originalControls[gym].bag), `${gym}: existing AI, item rules and bag retained`);
  check(trainer.battleFormat === (gym === 'giovanni' ? 'GEN_9_DOUBLES' : 'GEN_9_SINGLES'), `${gym}: existing battle format retained`);
  const declared = trainer.team.filter(m => m.gimmicks?.tera).map(m => m.species);
  check(declared.length === 1 && declared[0] === expectedTera[variant][gym], `${gym}: only the specified Pokemon has Tera permission (${expectedTera[variant][gym]})`);
  check(trainer.ai.data.canTera === (declared.length > 0) &&
    trainer.ai.data.teraTarget === (declared.length === 1 ? declared[0] : '') &&
    trainer.ai.data.canDynamax === false && trainer.ai.data.canGmax === false, `${gym}: Tera declarations and AI targets agree; Dynamax/Gmax disabled`);
  const megaHolders = trainer.team.filter(megaStoneOf).map(m => m.species);
  check(JSON.stringify(megaHolders) === JSON.stringify(expectedMega[variant][gym] ? [expectedMega[variant][gym]] : []), `${gym}: Mega holder is ${expectedMega[variant][gym] || 'none'}`);
  if (expectedOrder[gym]) check(JSON.stringify(trainer.team.map(m => m.species)) === JSON.stringify(expectedOrder[gym]), `${gym}: team order is ${expectedOrder[gym].join(', ')}`);
  for (const mon of trainer.team) {
    const where = `${gym}/${formName(mon)}`;
    const total = stats.reduce((v, s) => v + mon.evs[s], 0);
    check(mon.level <= cap && (gym === 'ltsurge' || mon.level === cap), `${where}: level adheres to cap`);
    check(stats.every(s => mon.ivs[s] === 31), `${where}: all six IVs are 31`);
    check(stats.every(s => Number.isInteger(mon.evs[s]) && mon.evs[s] >= 0 && mon.evs[s] <= 252) &&
      (variant === 'hardcore' && gym === 'champion_blue' ? stats.every(s => mon.evs[s] === 252) : total <= 510),
      variant === 'hardcore' && gym === 'champion_blue' ? `${where}: Hardcore Blue keeps 252 EVs in every stat` : `${where}: legal EV spread (${total} total, at most 510)`);
    check(Dex.species.get(formName(mon)).exists && Dex.abilities.get(mon.ability).exists && Dex.natures.get(mon.nature).exists, `${where}: species/form, ability and nature resolve`);
    const species = Dex.species.get(formName(mon));
    check(Object.values(species.abilities).map(toID).includes(mon.ability) , `${where}: ability is one the form can have`);
    check(mon.moveset.length === 4 && mon.moveset.every(m => Dex.moves.get(m).exists), `${where}: all four moves resolve`);
    check(!mon.heldItem.length || Dex.items.get(item(mon)).exists, `${where}: held item resolves (including custom seeds)`);
    check(!mon.gimmicks?.dynamax && !mon.gimmicks?.gmax, `${where}: no undeclared Max gimmick`);
    let b;
    try {
      b = battle(field, [mon]);
      const active = b.p1.active[0], request = b.p1.activeRequest.active[0];
      check((mon.species === 'arceus' ? toID(active.set.species) : active.species.id) === toID(formName(mon)), `${where}: simulator initializes exact form (active ${active.species.id})`);
      check(stats.every(s => active.set.ivs[s] === 31), `${where}: simulator retains perfect IVs`);
      check(stats.every(s => active.set.evs[s] === mon.evs[s]), `${where}: simulator retains every requested EV`);
      check(toID(active.set.ability) === mon.ability, `${where}: simulator initializes requested base ability`);
      if (gym === 'giovanni' && mon.species === 'hydreigon') check(active.ability === 'soundproof', `${where}: Deep Dark Magical Seed applies its existing Soundproof effect`);
      if (mon.moveset.includes('hiddenpowerground')) check(active.hpType === 'Ground', `${where}: explicit Hidden Power Ground retained alongside perfect IVs`);
      if (mon.gimmicks?.tera) {
        check(toID(request.canTerastallize || '') === mon.gimmicks.tera, `${where}: declared Tera is available`);
        b.choose('p1', 'move 1 terastallize'); b.choose('p2', 'move 1');
        check(toID(active.terastallized || '') === mon.gimmicks.tera, `${where}: requested Tera executes`);
        if (mon.species === 'ogerpon') check(active.species.id === 'ogerponhearthflametera' && active.ability === 'embodyaspecthearthflame', `${where}: Fire Tera activates Hearthflame Embody Aspect`);
      } else if (mon.heldItem.some(i => i.endsWith('ultranecrozium_z'))) {
        check(request.canUltraBurst === true, `${where}: Ultra Burst is available`);
        b.choose('p1', 'move 1 ultra'); b.choose('p2', 'move 1');
        check(active.species.id === 'necrozmaultra', `${where}: Ultra Burst executes`);
      } else if (Dex.items.get(item(mon)).megaStone) {
        check(request.canMegaEvo === true, `${where}: requested Mega Stone enables evolution`);
        b.choose('p1', 'move 1 mega'); b.choose('p2', 'move 1');
        check(active.species.isMega === true, `${where}: Mega evolution executes`);
        if (mon.species === 'dragalge') check(active.species.id === 'dragalgemega' && active.hasAbility('regenerator'), `${where}: Mega Dragalge uses the implemented Dragalge-Mega form (${active.species.id}, ${active.ability})`);
      } else if (mon.species === 'kommoo') {
        check(request.canZMove?.[0]?.move === 'Clangorous Soulblaze', `${where}: Kommonium Z enables the signature Z-Move`);
        b.choose('p1', 'move 1 zmove'); b.choose('p2', 'move 1');
        check(b.log.some(line => line.includes('Clangorous Soulblaze')), `${where}: signature Z-Move executes`);
      } else if (mon.species === 'kingambit') {
        check(request.canZMove?.[0]?.move === 'Black Hole Eclipse', `${where}: Darkinium Z enables Black Hole Eclipse`);
        b.choose('p1', 'move 1 zmove'); b.choose('p2', 'move 1');
        check(b.log.some(line => line.includes('Black Hole Eclipse')), `${where}: Darkinium Z executes`);
      } else {
        b.choose('p1', 'move 1'); b.choose('p2', 'move 1');
      }
      check(b.turn >= 2 || b.ended, `${where}: one real simulator turn executes on assigned field`);
    } catch (err) { failures.push(`${where}: ${err.message}`); }
    finally { if (b) b.destroy(); }
  }
  let b;
  try {
    b = battle(field, trainer.team, gym === 'giovanni');
    check(E.current(b).id === field, `${gym}: complete roster starts on assigned field`);
    b.choose('p1', 'default'); b.choose('p2', 'default');
    check(b.turn >= 2 || b.ended, `${gym}: complete roster plays one turn in configured format`);
  } catch (err) { failures.push(`${gym} full team: ${err.message}`); }
  finally { if (b) b.destroy(); }
}
// Misty's actual Gyarados set drives the requested Water Surface -> Underwater transition.
let diveBattle;
try {
  diveBattle = battle('rejuvenation:water_surface', [gyms.misty.team.find(m => m.species === 'gyarados')]);
  for (let turn = 0; turn < 3 && E.current(diveBattle).id !== 'rejuvenation:underwater'; turn++) {
    diveBattle.choose('p1', 'move 1'); diveBattle.choose('p2', 'move 1');
  }
  check(E.current(diveBattle).id === 'rejuvenation:underwater', 'Misty: Gyarados Dive transitions Water Surface to Underwater');
} catch (err) { failures.push('Misty Dive transition: ' + err.message); }
finally { if (diveBattle) diveBattle.destroy(); }

// Exact differences between the two variants. Hardcore is the reference (byte-for-byte the pre-split override); Classic may differ only as listed.
const norm = text => text.replace(/\r\n/g, '\n');
const hardcoreBaseline = JSON.parse(fs.readFileSync(path.join(root, 'research/baseline/kanto-hardcore-sha256.json'), 'utf8')).files;
const sha = text => crypto.createHash('sha256').update(text).digest('hex');
for (const gym of Object.keys(caps)) {
  check(sha(norm(fs.readFileSync(trainerFile('hardcore', gym), 'utf8'))) === hardcoreBaseline[`kanto_${gym}.json`], `kanto_${gym}.json: Hardcore is identical to the pre-split roster override`);
}
function describeDiff(gym) {
  const a = readTrainer('hardcore', gym), c = readTrainer('classic', gym), out = [];
  const strip = t => ({ ...t, team: undefined, ai: { ...t.ai, data: { ...t.ai.data, teraTarget: undefined } } });
  if (JSON.stringify(strip(a)) !== JSON.stringify(strip(c))) out.push(`${gym}: trainer settings (AI, rules, bag, format) differ`);
  if (a.ai.data.teraTarget !== c.ai.data.teraTarget) out.push(`${gym}: teraTarget ${a.ai.data.teraTarget} -> ${c.ai.data.teraTarget}`);
  const bySpecies = t => Object.fromEntries(t.team.map(m => [m.species, m]));
  const A = bySpecies(a), C = bySpecies(c);
  const removed = Object.keys(A).filter(s => !C[s]), added = Object.keys(C).filter(s => !A[s]);
  for (const s of removed) out.push(`${gym}: -${s}`);
  for (const s of added) out.push(`${gym}: +${s}`);
  for (const s of Object.keys(A).filter(s => C[s])) {
    for (const key of new Set([...Object.keys(A[s]), ...Object.keys(C[s])])) {
      if (JSON.stringify(A[s][key]) === JSON.stringify(C[s][key])) continue;
      if (key === 'moveset') out.push(`${gym}/${s}: moves -${A[s].moveset.filter(m => !C[s].moveset.includes(m)).join(',')} +${C[s].moveset.filter(m => !A[s].moveset.includes(m)).join(',')}`);
      else if (key === 'evs') out.push(`${gym}/${s}: evs ${stats.filter(k => A[s].evs[k]).map(k => A[s].evs[k] + k).join('/')} -> ${stats.filter(k => C[s].evs[k]).map(k => C[s].evs[k] + k).join('/')}`);
      else out.push(`${gym}/${s}: ${key} ${JSON.stringify(A[s][key])} -> ${JSON.stringify(C[s][key])}`);
    }
  }
  // Order: map each added Pokemon back onto the slot of the one it replaced; any remaining difference is a reordering.
  const mapped = c.team.map(m => (added.length === 1 && removed.length === 1 && m.species === added[0]) ? removed[0] : m.species);
  if (JSON.stringify(mapped) !== JSON.stringify(a.team.map(m => m.species))) out.push(`${gym}: team order ${c.team.map(m => m.species).join(',')}`);
  return out;
}
// Each entry: the user-facing change (also printed in README_KANTO_CLASSIC.md) and the exact diff lines it must produce.
const CLASSIC_CHANGES = [
  { gym: 'ltsurge', text: 'Iron Hands: Booster Energy replaced by Expert Belt.', diff: ['ltsurge/ironhands: heldItem ["mega_showdown:booster_energy"] -> ["cobblemon:expert_belt"]'] },
  { gym: 'erika', text: 'Kartana replaced by Adamant Ferrothorn (Rocky Helmet; Power Whip, Gyro Ball, Leech Seed, Knock Off; 252 HP / 252 Atk / 4 SpD) in the same slot.', diff: ['erika: -kartana', 'erika: +ferrothorn'] },
  { gym: 'sabrina', text: 'Mega Alakazam: Calm Mind replaced by Shadow Ball.', diff: ['sabrina/alakazam: moves -calmmind +shadowball'] },
  { gym: 'koga', text: 'Naganadel: Nasty Plot replaced by Dark Pulse. Sneasler: Swords Dance replaced by Knock Off (pure attacker). Mega Gengar replaced by Mega Dragalge, moved to second in the team order.',
    diff: ['koga/naganadel: moves -nastyplot +darkpulse', 'koga/sneasler: moves -swordsdance +knockoff', 'koga: -gengar', 'koga: +dragalge', 'koga: team order glimmora,dragalge,pecharunt,sneasler,naganadel,cinderace'] },
  { gym: 'blaine', text: 'Chi-Yu replaced by Timid Typhlosion-Hisui (Charcoal; Eruption, Flamethrower, Extrasensory, Tera Blast). Blaine\'s Tera user is now Typhlosion-Hisui, Tera Grass.',
    diff: ['blaine: teraTarget chiyu -> typhlosion', 'blaine: -chiyu', 'blaine: +typhlosion'] },
  { gym: 'giovanni', text: 'Chien-Pao replaced by Timid Toxtricity (Silk Scarf; Boomburst, Overdrive, Sludge Bomb, Protect). Giovanni\'s Tera user is now Toxtricity, Tera Normal.',
    diff: ['giovanni: teraTarget chienpao -> toxtricity', 'giovanni: -chienpao', 'giovanni: +toxtricity'] },
  { gym: 'league_lorelei', text: 'Calyrex-Ice: Swords Dance replaced by Crunch. Arctovish: Choice Band replaced by Chople Berry.',
    diff: ['league_lorelei/calyrex: moves -swordsdance +crunch', 'league_lorelei/arctovish: heldItem ["cobblemon:choice_band"] -> ["cobblemon:chople_berry"]'] },
  { gym: 'league_bruno', text: 'Terrakion: Swords Dance replaced by Poison Jab. Mega Lucario: Swords Dance replaced by Crunch.', diff: ['league_bruno/terrakion: moves -swordsdance +poisonjab', 'league_bruno/lucario: moves -swordsdance +crunch'] },
  { gym: 'league_agatha', text: 'Basculegion: Choice Scarf replaced by Clear Amulet, nature Jolly to Adamant, EVs 252 Atk / 4 SpD / 252 Spe to 252 HP / 252 Atk / 4 SpD. Last Respects and the other moves are unchanged.',
    diff: ['league_agatha/basculegion: nature "jolly" -> "adamant"', 'league_agatha/basculegion: heldItem ["cobblemon:choice_scarf"] -> ["cobblemon:clear_amulet"]', 'league_agatha/basculegion: evs 252atk/4spd/252spe -> 252hp/252atk/4spd'] },
  { gym: 'league_lance', text: 'Only Mega Dragonite keeps Dragon Dance. Haxorus: Dragon Dance replaced by Close Combat. Roaring Moon: Dragon Dance replaced by Earthquake. Necrozma-Dusk-Mane: Dragon Dance replaced by Sunsteel Strike.',
    diff: ['league_lance/haxorus: moves -dragondance +closecombat', 'league_lance/roaringmoon: moves -dragondance +earthquake', 'league_lance/necrozma: moves -dragondance +sunsteelstrike'] },
  { gym: 'champion_blue', text: 'The 252-EVs-in-all-six-stats rule is gone: every member has a normal 508-EV spread (nature, moves, items, Mega/Tera/Z usage and team are unchanged).',
    diff: ['champion_blue/hawlucha: evs 252hp/252atk/252def/252spa/252spd/252spe -> 252atk/4spd/252spe', 'champion_blue/ironvaliant: evs 252hp/252atk/252def/252spa/252spd/252spe -> 4def/252spa/252spe',
      'champion_blue/kingambit: evs 252hp/252atk/252def/252spa/252spd/252spe -> 252hp/252atk/4spd', 'champion_blue/ursaluna: evs 252hp/252atk/252def/252spa/252spd/252spe -> 252hp/252spa/4spd',
      'champion_blue/metagross: evs 252hp/252atk/252def/252spa/252spd/252spe -> 252atk/4spd/252spe', 'champion_blue/arceus: evs 252hp/252atk/252def/252spa/252spd/252spe -> 4def/252spa/252spe'] },
];
const actualDiff = Object.keys(caps).flatMap(describeDiff);
const expectedDiff = CLASSIC_CHANGES.flatMap(c => c.diff);
check(JSON.stringify([...actualDiff].sort()) === JSON.stringify([...expectedDiff].sort()), 'Classic differs from Hardcore only by the listed balance changes' +
  (JSON.stringify([...actualDiff].sort()) === JSON.stringify([...expectedDiff].sort()) ? ` (${actualDiff.length} differences)` : ` -- unexpected: ${actualDiff.filter(d => !expectedDiff.includes(d)).join(' | ')}; missing: ${expectedDiff.filter(d => !actualDiff.includes(d)).join(' | ')}`));
check(Object.keys(caps).every(g => fs.existsSync(trainerFile('classic', g)) && fs.existsSync(trainerFile('hardcore', g))), 'both variants define exactly the same 13 trainer files');
check(fs.readdirSync(path.join(rosterDir(variant), 'data/rctmod/trainers')).length === 13 && !fs.existsSync(path.join(shared, 'data/rctmod')), 'the shared extension carries no trainer files (rosters live only in the variant packs)');

// Informational: moves outside Cobblemon's own learnsets (the roster rows are the owner's requested sets, not learnset-legal substitutions).
const learnsetNotes = [];
function cobblemonLearnsets() {
  const zlib = require('node:zlib');
  const jar = fs.readdirSync(path.join(profile, 'mods')).find(f => f.startsWith('Cobblemon-fabric'));
  const buf = fs.readFileSync(path.join(profile, 'mods', jar));
  let eocd = buf.length - 22; while (buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  const count = buf.readUInt16LE(eocd + 10); let p = buf.readUInt32LE(eocd + 16); const map = {};
  for (let i = 0; i < count; i++) {
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20), nlen = buf.readUInt16LE(p + 28), xlen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32), off = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nlen); p += 46 + nlen + xlen + clen;
    const m = /^data\/cobblemon\/species\/[^/]+\/([^/]+)\.json$/.exec(name);
    if (!m) continue;
    const start = off + 30 + buf.readUInt16LE(off + 26) + buf.readUInt16LE(off + 28), raw = buf.subarray(start, start + csize);
    const doc = JSON.parse((method === 8 ? zlib.inflateRawSync(raw) : raw).toString('utf8'));
    const moves = new Set((doc.moves || []).map(x => x.split(':').pop()));
    for (const f of doc.forms || []) for (const x of f.moves || []) moves.add(x.split(':').pop());
    map[m[1]] = moves;
  }
  return map;
}
try {
  const learn = cobblemonLearnsets();
  for (const [gym, t] of Object.entries(gyms)) for (const mon of t.team) for (const mv of mon.moveset)
    if (learn[mon.species] && !learn[mon.species].has(mv)) learnsetNotes.push(`${t.name.literal}: ${Dex.species.get(formName(mon)).name} ${Dex.moves.get(mv).name}`);
} catch (err) { learnsetNotes.push('learnset comparison unavailable: ' + err.message); }

const labels = { hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };
const stage = gym => gym.startsWith('league_') ? 'Elite Four' : gym === 'champion_blue' ? 'Champion' : String(Object.keys(caps).filter(g => !g.startsWith('league_') && g !== 'champion_blue').indexOf(gym) + 1);
const fieldName = gym => catalog.fields['rejuvenation:' + fields[gym]].name + (gym === 'misty' ? ' → Underwater via Dive' : '');
const teraName = mon => Dex.types.get(mon.gimmicks.tera).name;
function gimmickOf(gym, mon) {
  if (mon.gimmicks?.tera) return `Tera ${teraName(mon)}`;
  const mega = megaStoneOf(mon);
  if (mega) return `Mega Evolution (${pretty(mega.name)})`;
  if (expectedZ[gym]?.species === mon.species) return expectedZ[gym].kind === 'ultra' ? 'Ultra Burst (Ultra Necrozma)' : `Z-Move: ${expectedZ[gym].move}`;
  return '';
}
const monName = mon => Dex.species.get(formName(mon)).name;

// Per-field notes: what the assigned field does to this variant's roster. Rules are taken from the field's Field Notes.
const FIELD_NOTES = {
  brock: 'Crystal Cavern: Rock- and Dragon-type moves gain 1.5x power, and Rock moves take on a cycling Fire / Water / Grass / Psychic crystal type. Stealth Rock deals crystal-type damage. Ancient Power and Rock Tomb are boosted.',
  misty: 'Water Surface becomes Underwater when Gyarados uses Dive, through the existing field transition.',
  ltsurge: 'Murkwater Surface: Water moves gain Poison typing and 1.5x power, Poison moves 1.5x and Electric moves 1.3x. Ground moves fail. Grounded non-Poison, non-Steel Pokémon lose 1/8 of their HP each turn. Elemental Seed raises Speed and Aqua Rings the holder but poisons it.',
  erika: 'Warped Forest: Grass, Dark and special Bug moves gain 1.5x power, damaging Grass moves also count as Dark for type effectiveness, Power Whip gains a further 1.5x (2.25x in all) and Leech Seed drains 1/4. Weather cannot start and nothing can be frozen. Magical Seed raises Defense and Special Defense but lowers Speed and applies Ingrain.',
  sabrina: 'Psychic Terrain: grounded Psychic moves gain 1.5x power, and Aura Sphere, Focus Blast, Hex, Moonblast and Mystical Fire gain 1.5x. Priority attacks fail against grounded Pokémon. Calm Mind raises Special Attack and Special Defense by 2 stages. Magical Seed raises Special Attack by 2 stages but confuses the holder.',
  koga: 'Wasteland: Spikes and Stealth Rock are consumed at the end of the turn and hit harder (1/3 per Spikes layer, doubled Stealth Rock damage). Sludge Bomb and Gunk Shot gain 1.2x and a chance of a random Burn, Freeze, Paralysis or Poison; Dire Claw always rolls a status. Earthquake is cut to 0.25x. Telluric Seed raises Attack and Special Attack and lays Stealth Rock on both sides.',
  blaine: 'Crimson Forest: Fire, Grass and Poison moves gain 1.3x power. Positive-priority damaging moves lose 20% accuracy and crash on a miss. Knocking out a Pokémon raises the user\'s Attack by 1 stage (Piglin Bloodlust). Hail and Snow cannot last and nothing can be frozen. Good as Gold raises Speed and Special Attack on entry.',
  giovanni: 'Deep Dark: Dark and Ghost moves gain 1.5x power. Sound moves (such as Boomburst and Clanging Scales) and earthquake-style moves raise the shared Sculk Warning by 2; at Warning 4 every Pokémon that is not Ghost-type, Soundproof, Punk Rock or Solid Rock loses 20% of its HP. Magical Seed turns Hydreigon\'s ability into Soundproof. Giovanni fights in doubles.',
  league_lorelei: 'Frozen Dimensional Field: Dark moves gain 1.5x power and Ice moves 1.2x; Dark Pulse, Night Slash, Hydro Pump and Surf gain Ice typing. Ice and Ghost Pokémon gain 1.2x defenses and Fire Pokémon lose 20%. Pressure lowers the opponent\'s defenses on entry. Elemental Seed raises Speed by 2 stages but applies Torment.',
  league_bruno: 'Colosseum: switches resolve in attack order, forced-switch moves and Encore fail, Swords Dance gives +3, and Reversal, Sacred Sword, Secret Sword, Meteor Mash, Bullet Punch and Leaf Blade gain power. Justified raises Attack and Special Attack on entry. A knockout boosts the user\'s best-matching stat. Synthetic Seed raises Attack by 2 stages but applies Taunt.',
  league_agatha: 'Haunted Field: Ghost moves gain 1.5x power and hit Normal-types neutrally; sleeping non-Ghost Pokémon take 1/16 each turn. Phantom Force and Shadow Force take one turn, Hypnosis and Will-O-Wisp are 90% accurate, Destiny Bond can be repeated. Magical Seed raises Defense and Special Defense but burns the holder.',
  league_lance: 'Dragon\'s Den: Dragon and Fire moves gain 1.5x power and Rock moves 1.3x. Dragon Dance raises Attack and Speed by 2 stages. Earthquake gains Fire typing, Earth Power is boosted, Dragon Rush has 100% accuracy and Scale Shot does not lower defenses. Multiscale always negates Dragon weaknesses. Fields cannot be generated.',
  champion_blue: 'New World: Dark moves gain 1.5x power; Draco Meteor, Meteor Mash, Moonblast, Vacuum Wave, Spacial Rend and Ancient Power gain 2x, Earth Power and Judgment 1.5x. Earthquake is 0.25x. Grounded Pokémon move at 0.75x Speed. Moonlight heals 75%. Multitype randomises Arceus\'s type on entry and each turn. Weather and fields cannot be set.',
};
const ROSTER_NOTES = {
  classic: {
    ltsurge: 'Iron Hands now holds Expert Belt, so its Quark Drive no longer starts from an item (unless Electric Terrain is up); Swords Dance and the punches are unchanged.',
    erika: 'Ferrothorn\'s Power Whip is 2.25x here (and a Dark-typed Grass move), and its Leech Seed drains 1/4 per turn. Rocky Helmet and Iron Barbs punish contact. Ogerpon-Hearthflame is still the Tera user.',
    sabrina: 'Mega Alakazam has no Calm Mind, so Psychic Terrain\'s +2/+2 Calm Mind bonus belongs to Espathra only. Shadow Ball takes no terrain boost.',
    koga: 'Mega Dragalge (Poison/Dragon, Regenerator as a Mega) enters second; its Sludge Bomb gains the Wasteland\'s 1.2x and random-status chance. Dire Claw (Sneasler) always rolls a status. Sneasler holds the Telluric Seed (Stealth Rock on both sides) and remains the Tera Dark user.',
    blaine: 'Typhlosion-Hisui is the Tera user: Tera Grass makes Tera Blast a Grass move that Crimson Forest boosts 1.3x. Eruption and Flamethrower take the Fire boost of 1.3x.',
    giovanni: 'Low-Key Toxtricity has Punk Rock, which is immune to Deep Dark\'s Warning-4 strike and boosts sound moves. Boomburst and Overdrive both count as sound moves and raise the Warning by 2, and Tera Normal gives Boomburst same-type bonus. Kommo-o (Soundproof) is equally immune. Chien-Pao is gone, so Giovanni has no Swords Dance setup.',
    league_lorelei: 'Crunch is a Dark move and gains the Dimension\'s 1.5x on Calyrex-Ice and Arctovish. Chople Berry halves one Fighting-type hit on Arctovish.',
    league_bruno: 'Terrakion and Lucario no longer have Swords Dance, so the Colosseum\'s +3 never applies; Reversal, Sacred Sword and Meteor Mash keep their field boosts.',
    league_agatha: 'Basculegion is now a bulkier Adamant attacker with Clear Amulet; Last Respects is a Ghost move and gains 1.5x here.',
    league_lance: 'Dragon Dance is only on Mega Dragonite, so only that Pokémon takes the Den\'s +2 Attack and Speed. Roaring Moon\'s Earthquake gains Fire typing and Sunsteel Strike gives Necrozma-Dusk-Mane a Steel STAB move. Necrozma keeps Ultranecrozium Z for Ultra Burst.',
    champion_blue: 'Blue\'s moves, items and gimmicks are unchanged; only his EVs are normal spreads.',
  },
  hardcore: {
    giovanni: 'Hydreigon starts with Levitate; consuming its Magical Seed on Deep Dark applies the existing field effect that changes its active ability to Soundproof. Chien-Pao (Sword of Ruin) is the Tera user.',
    league_lance: 'Haxorus, Roaring Moon, Necrozma-Dusk-Mane and Mega Dragonite all carry Dragon Dance, which gives +2 Attack and Speed here.',
    champion_blue: 'Arceus keeps Multitype and can change form and Judgment type during battle. Blue\'s requested 252 EVs in every stat (1512 total) are restored by the compat mod for the NPC tagged kanto_champion_blue only.',
  },
};

function rosterText(v) {
  const lines = [];
  const intro = v === 'classic'
    ? ['# Kanto League: Classic roster (recommended)', '',
       `Install \`${packName('classic')}\` **instead of** the Hardcore pack. It replaces the teams of all 13 Kanto league fights. It does not contain the field assignments, mappings or the Lt. Surge gym, which come from \`rejuvenation-fields-cobbleverse-${VERSION}.zip\`; install that as well. Updated 2026-10-09.`, '',
       'Classic is the recommended difficulty. It is still a hard, Rejuvenation-style challenge, with the same fields, level caps, trainer AI and Mega / Tera / Z-Move / Ultra Burst gimmicks as Hardcore, but it trims setup stacking, Uber density and raw statistical advantages. The original, maximum-difficulty rosters are the [Hardcore](README_KANTO_HARDCORE.md) pack.', '',
       '**Install only one league roster pack at a time.** Classic and Hardcore define the same 13 trainer files, so with both installed whichever loads last would silently win and you would not know which one you are fighting.', '']
    : ['# Kanto League: Hardcore roster', '',
       `Install \`${packName('hardcore')}\` **instead of** the Classic pack. It is the original roster override, unchanged: 13 fights with highly optimised teams. It does not contain the field assignments, mappings or the Lt. Surge gym, which come from \`rejuvenation-fields-cobbleverse-${VERSION}.zip\`; install that as well. Updated 2026-10-09.`, '',
       'Hardcore is for players who want the maximum-difficulty version. Most players should start with the [Classic](README_KANTO_CLASSIC.md) roster, which keeps the same fields and gimmicks but is more balanced.', '',
       '**Install only one league roster pack at a time.** Classic and Hardcore define the same 13 trainer files, so with both installed whichever loads last would silently win and you would not know which one you are fighting.', ''];
  lines.push(...intro);
  lines.push('All 78 league Pokemon have **31 IVs in all six stats**. Every replacement team uses its trainer cap for every member. Lt. Surge keeps his existing team: level 36 except Rotom-Wash at 35. All Elite Four and Champion Pokemon are level 85. EVs, abilities, natures, moves, forms, held items and declared Tera types are listed exactly below.', '');
  lines.push('The cap before each fight equals the next required trainer\'s highest level (`relativeLevelCap = 0`). Sabrina precedes Koga. All trainers use singles except Giovanni, who uses doubles. Trainers use Run & Bun AI with their original item-use limits and Full Restore bags. Dynamax and Gigantamax are disabled for every trainer.', '');
  if (v === 'hardcore') lines.push('Blue\'s spreads use **252 EVs in all six stats (1512 total)**. RCT/Cobblemon normally limits total EVs to 510. The compat mod restores these spreads only for NPC teams tagged `kanto_champion_blue`, including copies created for battle. Player Pokemon and other trainers keep normal EV limits. The Hardcore pack and the compat jar must be installed together for Blue\'s full spreads.', '');
  else lines.push('Every Classic Pokemon, Blue\'s included, has a normal legal EV spread of at most 510 EVs (508 for all of Blue\'s). Classic does not use the compat mod\'s Blue EV exception.', '');
  if (v === 'classic') {
    lines.push('## Changes from Hardcore', '', 'Everything not listed here is identical to Hardcore: fields, level caps, the other team members, IVs, trainer AI, battle rules, bags, battle formats, and the Mega / Tera / Z-Move / Ultra Burst policy.', '');
    for (const c of CLASSIC_CHANGES) lines.push(`- **${gyms[c.gym].name.literal}:** ${c.text}`);
    lines.push('', 'Brock and Misty are unchanged. Choices the change list left open: Mega Dragalge uses Dragalge\'s hidden ability Adaptability before it Mega Evolves (it becomes Regenerator as a Mega) and a Modest nature; Typhlosion-Hisui has Blaze; Ferrothorn has Iron Barbs; Toxtricity is the Low-Key form, because Timid is a Low-Key nature, with Punk Rock. Sneasler does not learn Knock Off in Cobblemon\'s learnset data; the move exists in the battle engine, so the set works as requested, like the six other off-learnset moves already in Hardcore.', '');
  }
  lines.push('## Progression, level caps and fields', '', '| Stage | Trainer | Level cap | Format | Starting field | Team order |', '|---|---|---:|---|---|---|');
  for (const [gym, cap] of Object.entries(caps)) lines.push(`| ${stage(gym)} | ${gyms[gym].name.literal} | ${cap} | ${gyms[gym].battleFormat === 'GEN_9_DOUBLES' ? 'Doubles' : 'Singles'} | ${fieldName(gym)} | ${gyms[gym].team.map((m, i) => `${i + 1}. ${monName(m)}`).join(', ')} |`);
  lines.push('', '## Mega, Tera and Z-Move users', '', '| Trainer | Mega Evolution | Terastallization (one per trainer) | Z-Move / Ultra Burst |', '|---|---|---|---|');
  for (const [gym, t] of Object.entries(gyms)) {
    const mega = t.team.filter(megaStoneOf).map(m => `${monName(m)} (${pretty(megaStoneOf(m).name)})`).join(', ') || 'none';
    const tera = t.team.filter(m => m.gimmicks?.tera).map(m => `${monName(m)}, Tera ${teraName(m)}`).join(', ');
    const z = expectedZ[gym] ? t.team.filter(m => m.species === expectedZ[gym].species).map(m => `${monName(m)} (${expectedZ[gym].kind === 'ultra' ? 'Ultra Burst' : expectedZ[gym].move})`).join(', ') : 'none';
    lines.push(`| ${t.name.literal} | ${mega} | ${tera} | ${z} |`);
  }
  lines.push('', 'Mega Evolution happens on the first legal move. Only the declared Tera user ever Terastallizes. Each side has one Tera use per battle. Dynamax and Gigantamax are disabled. Brock has no Mega Evolution.', '');
  lines.push('## Field-specific interactions', '', 'The trainer\'s field is fixed by `datapack/cobbleverse/.../trainers/kanto.json` and is the same in both variants. Full rules: [Field Notes](field-notes/FIELD_NOTES.md).', '');
  for (const gym of Object.keys(caps)) {
    lines.push(`- **${gyms[gym].name.literal} — ${fieldName(gym)}.** ${FIELD_NOTES[gym]}${ROSTER_NOTES[v][gym] ? ' ' + ROSTER_NOTES[v][gym] : ''}`);
  }
  lines.push('', '- Lunatone (Brock) explicitly has Hidden Power Ground and 31 IVs in every stat. The installed simulator accepts that typed move without reducing IVs.', '- New World keeps its existing Multitype effects, which can change Arceus\'s active form and Judgment type during battle.', '');
  lines.push('## Complete gym, Elite Four and Champion rosters', '');
  for (const [gym, trainer] of Object.entries(gyms)) {
    lines.push(`### ${stage(gym) === 'Elite Four' || stage(gym) === 'Champion' ? stage(gym) : 'Gym ' + stage(gym)}: ${trainer.name.literal} — ${fieldName(gym)} — cap ${caps[gym]}`, '', `${trainer.battleFormat === 'GEN_9_DOUBLES' ? 'Doubles' : 'Singles'}. Team order (lead first): ${trainer.team.map((m, i) => `${i + 1}. ${monName(m)}`).join(', ')}.`, '',
      '| # | Pokémon | Item | Ability | Gimmick |', '|---:|---|---|---|---|');
    trainer.team.forEach((m, i) => lines.push(`| ${i + 1} | ${monName(m)} | ${pretty(item(m)) || '—'} | ${Dex.abilities.get(m.ability).name} | ${gimmickOf(gym, m) || '—'} |`));
    lines.push('', '```text');
    trainer.team.forEach((mon, i) => {
      lines.push(monName(mon) + (item(mon) ? ' @ ' + pretty(item(mon)) : '') + (mon.gender !== 'GENDERLESS' ? ` (${mon.gender === 'FEMALE' ? 'F' : 'M'})` : ''),
        `Slot: ${i + 1}${i === 0 ? ' (lead)' : ''}`, `Level: ${mon.level}`,
        'Ability: ' + Dex.abilities.get(mon.ability).name, ...(mon.gimmicks?.tera ? ['Tera Type: ' + teraName(mon)] : []),
        ...(gimmickOf(gym, mon) && !mon.gimmicks?.tera ? ['Gimmick: ' + gimmickOf(gym, mon)] : []),
        'Nature: ' + Dex.natures.get(mon.nature).name, 'IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe',
        'EVs: ' + stats.filter(s => mon.evs[s]).map(s => `${mon.evs[s]} ${labels[s]}`).join(' / '),
        ...mon.moveset.map(m => '- ' + Dex.moves.get(m).name), '');
    });
    lines.push('```', '');
  }
  lines.push('## Installation and verification', '',
    `Use the Modrinth App's instance folder (see the main [README](README.md)). Put \`rejuvenation-fields-base-${VERSION}.zip\`, \`rejuvenation-fields-cobbleverse-${VERSION}.zip\` and **one** of \`${packName('classic')}\` / \`${packName('hardcore')}\` in \`datapacks\`. To switch variant, delete the one you have and add the other, then restart the world. The league roster zip must sort after \`COBBLEVERSE-RCT-DP-v20.zip\` so its trainer files override the originals; Global Packs' alphabetical order does that. An already spawned trainer may keep its old team; use a newly spawned gym NPC or a new world.`, '',
    `Validated offline against the installed Showdown simulator and the field engine: every species and form, item, move, ability, nature, level, IV and EV spread, complete teams and field starts; the declared Tera choices; Mega Evolution; Z-Moves and Ultra Burst; Misty's Dive transition${v === 'classic' ? '; Koga\'s team order; Mega Dragalge; and that Classic differs from Hardcore only by the changes listed above' : '; and that every file is identical to the pre-split roster override'}. ${checks.length} checks passed. These rosters have not been tested in live Minecraft battles.`, '',
    `Validation receipt: \`research/test-results/kanto-gyms-simulator-${v}.json\`. Full-battle simulation: \`research/test-results/kanto-fights-simulation-${v}.json\`.`, '');
  return lines.join('\n');
}

if (!failures.length) {
  const text = rosterText(variant);
  fs.writeFileSync(path.join(rosterDir(variant), 'README.md'), text);
  fs.writeFileSync(path.join(root, `README_KANTO_${variant.toUpperCase()}.md`), text);
  fs.writeFileSync(path.join(root, 'docs/KANTO_LEAGUE_FIELDS.md'), [
    '# Kanto league fields', '', 'Two roster variants share these fields, level caps and formats: [Classic](../README_KANTO_CLASSIC.md) (recommended) and [Hardcore](../README_KANTO_HARDCORE.md). Overview: [README_KANTO_LEAGUE.md](../README_KANTO_LEAGUE.md).', '',
    'All trainer fields follow the user-authored rosters dated 2026-10-08. Earlier win-share scores in research/trainer-field-scores.json describe the prior teams and are historical; they are not performance claims for these replacements.', '',
    '| Trainer | Cap | Format | Starting field |', '|---|---:|---|---|',
    ...Object.entries(gyms).map(([gym, t]) => `| ${t.name.literal} | ${caps[gym]} | ${t.battleFormat} | ${fieldName(gym)} |`),
    '',
    'Bindings live in `datapack/cobbleverse/data/rejuvenation/rejuvenation/trainers/kanto.json`, in the shared extension pack, so they apply to whichever roster variant is installed. TrainerFieldBridge selects them on battle pre-start at TRAINER priority; an EXPLICIT selection still takes precedence.', ''
  ].join('\n'));
}
const hashDir = dir => {
  const out = {};
  (function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const file = path.join(d, entry.name);
      if (entry.isDirectory()) walk(file);
      else out[path.relative(dir, file).replaceAll('\\', '/')] = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    }
  })(dir);
  return out;
};
const receipt = { date: '2026-10-09', variant, pack: packName(variant), checksPassed: checks.length, failures, checks, learnsetNotes,
  classicChangesVerified: variant === 'classic' ? actualDiff : undefined,
  sourceHashes: hashDir(rosterDir(variant)), sharedSourceHashes: hashDir(shared),
  addonSha256: runtime.addonSha256, originalTrainerPackSha256: runtime.originalTrainerPackSha256, savedWorldPackOrder: runtime.savedWorldPackOrder,
  simulator: 'Installed profile/showdown', fieldEngineSha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'core/src/main/resources/rejuvenation-engine.js'))).digest('hex'),
  liveMinecraftBattleTested: false };
fs.writeFileSync(path.join(root, `research/test-results/kanto-gyms-simulator-${variant}.json`), JSON.stringify(receipt, null, 2) + '\n');
console.log(`${label(variant)}: ${checks.length} checks passed; ${failures.length} failures`);
for (const failure of failures) console.error(failure);
process.exit(failures.length ? 1 : 0);
