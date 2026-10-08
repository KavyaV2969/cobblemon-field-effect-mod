// Validate the authored gym sets against the installed simulator and field engine.
// Also generate the complete roster README from the validated trainer resources.
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto'), vm = require('node:vm');
const root = path.resolve(__dirname, '..'), profile = path.resolve(root, '..');
const source = path.join(root, 'datapack/cobbleverse');
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
const toID = text => text.toLowerCase().replace(/[^a-z0-9]/g, '');
function formName(mon) {
  if ((mon.aspects || []).includes('alolan')) return mon.species + 'alola';
  if ((mon.aspects || []).includes('hearthflame-mask')) return mon.species + 'hearthflame';
  if ((mon.aspects || []).includes('wash-appliance')) return mon.species + 'wash';
  for (const [aspect, suffix] of [['ice-rider', 'ice'], ['shadow-rider', 'shadow'], ['crowned', 'crowned'], ['dusk-fusion', 'duskmane'], ['bloodmoon', 'bloodmoon']])
    if ((mon.aspects || []).includes(aspect)) return mon.species + suffix;
  return mon.species;
}
function item(mon) { return mon.heldItem.length ? Dex.items.get(toID(mon.heldItem[0].split(':')[1])).name : ''; }
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
for (const [gym, cap] of Object.entries(caps)) {
  const trainer = JSON.parse(fs.readFileSync(path.join(source, 'data/rctmod/trainers', `kanto_${gym}.json`), 'utf8'));
  gyms[gym] = trainer;
  const field = catalog.trainers['kanto_' + gym]?.field;
  check(field === 'rejuvenation:' + fields[gym] && !!catalog.fields[field], `${gym}: exact field assignment exists`);
  check(trainer.team.length === 6 && Math.max(...trainer.team.map(m => m.level)) === cap, `${gym}: six Pokemon and unchanged cap ${cap}`);
  check(trainer.ai.type === 'rb' && JSON.stringify(trainer.battleRules) === JSON.stringify(runtime.originalControls[gym].battleRules) &&
    JSON.stringify(trainer.bag) === JSON.stringify(runtime.originalControls[gym].bag), `${gym}: existing AI, item rules and bag retained`);
  check(trainer.battleFormat === (gym === 'giovanni' ? 'GEN_9_DOUBLES' : 'GEN_9_SINGLES'), `${gym}: existing battle format retained`);
  const declared = trainer.team.filter(m => m.gimmicks?.tera).map(m => m.species);
  const expectedTera = { brock: 'sableye', misty: 'floatzel', ltsurge: 'magnezone', erika: 'ogerpon',
    sabrina: 'espathra', koga: 'sneasler', blaine: 'chiyu', giovanni: 'chienpao',
    league_lorelei: 'arctovish', league_bruno: 'terrakion', league_agatha: 'ceruledge', league_lance: 'roaringmoon', champion_blue: 'ursaluna' };
  check(declared.length === 1 && declared[0] === expectedTera[gym], `${gym}: only the specified Pokemon has Tera permission`);
  check(trainer.ai.data.canTera === (declared.length > 0) &&
    trainer.ai.data.teraTarget === (declared.length === 1 ? declared[0] : '') &&
    trainer.ai.data.canDynamax === false && trainer.ai.data.canGmax === false, `${gym}: Tera declarations and AI targets agree; Dynamax/Gmax disabled`);
  for (const mon of trainer.team) {
    const where = `${gym}/${formName(mon)}`;
    check(mon.level <= cap && (gym === 'ltsurge' || mon.level === cap), `${where}: level adheres to cap`);
    check(stats.every(s => mon.ivs[s] === 31), `${where}: all six IVs are 31`);
    check(stats.every(s => Number.isInteger(mon.evs[s]) && mon.evs[s] >= 0 && mon.evs[s] <= 252) &&
      (gym === 'champion_blue' ? stats.every(s => mon.evs[s] === 252) : stats.reduce((v, s) => v + mon.evs[s], 0) <= 510), `${where}: requested EV limits (Blue exception scoped to champion)`);
    check(Dex.species.get(formName(mon)).exists && Dex.abilities.get(mon.ability).exists && Dex.natures.get(mon.nature).exists, `${where}: species/form, ability and nature resolve`);
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

const labels = { hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe' };
const readme = ['# Complete Kanto league roster overrides', '',
  'Installed in `rejuvenation-fields-cobbleverse-0.1.zip`, the existing COBBLEVERSE extension datapack. Updated 2026-10-08.', '',
  'All 78 league Pokemon have **31 IVs in all six stats**. Every replacement team uses its trainer cap for every member. Lt. Surge keeps his existing team: level 36 except Rotom-Wash at 35. All Elite Four and Champion Pokemon are level 85. EVs, abilities, natures, moves, forms, held items and declared Tera types follow the supplied sets.', '',
  'The cap before each fight equals the next required trainer\'s highest level (`relativeLevelCap = 0`). Sabrina precedes Koga. All trainers use singles except Giovanni, who retains the existing doubles format. Trainers retain Run & Bun AI and their existing item-use limits and Full Restore bags.', '',
  'Blue\'s requested spreads use **252 EVs in all six stats (1512 total)**. RCT/Cobblemon normally limits total EVs to 510. The accompanying updated compat mod restores these spreads only for NPC teams tagged `kanto_champion_blue`, including copies created for battle. Player Pokemon and other trainers retain normal EV limits. The datapack and updated compat jar must be installed together for Blue\'s full spreads.', '',
  '## Progression, level caps and fields', '', '| Stage | Trainer | Level cap | Starting field |', '|---|---|---:|---|'];
let stage = 0;
for (const [gym, cap] of Object.entries(caps)) readme.push(`| ${gym.startsWith('league_') ? 'Elite Four' : gym === 'champion_blue' ? 'Champion' : ++stage} | ${gyms[gym].name.literal} | ${cap} | ${catalog.fields['rejuvenation:' + fields[gym]].name}${gym === 'misty' ? ' → Underwater via Dive' : ''} |`);
readme.push('',
  '## Battle mechanics', '',
  '- Misty starts on Water Surface. Gyarados\'s Dive uses the existing field transition to pull the battle Underwater.',
  '- Each league trainer has exactly one permitted Tera user. The corrected gyms retain Sneasler (Dark), Chien-Pao (Dark) and Ogerpon-Hearthflame (Fire). The new teams use Arctovish (Water), Terrakion (Fighting), Ceruledge (Fire), Roaring Moon (Flying) and Ursaluna-Bloodmoon (Normal). Each side still has one Tera use per battle.',
  '- Mega holders use the existing NPC Mega policy. Kommo-o holds Kommonium Z for Clangorous Soulblaze. Ogerpon starts in its Hearthflame form and may use Fire Tera to activate Embody Aspect.',
  '- Dynamax and Gigantamax are disabled for all league teams. Lance\'s Necrozma starts as Dusk Mane with Ultranecrozium Z for Ultra Burst; Blue\'s Kingambit has Darkinium Z.',
  '- Lunatone explicitly has Hidden Power Ground and 31 IVs in every stat. The installed simulator accepts that typed move without reducing IVs.',
  '- Hydreigon starts with Levitate; consuming its Magical Seed on Deep Dark applies the existing field effect that changes its active ability to Soundproof.', '',
  '- New World retains its existing Multitype effects, which can change Arceus\'s active form and Judgment type during battle.', '',
  '## Complete gym, Elite Four and Champion rosters', '');
for (const [gym, trainer] of Object.entries(gyms)) {
  readme.push(`### ${trainer.name.literal} — ${catalog.fields['rejuvenation:' + fields[gym]].name}${gym === 'misty' ? ' → Underwater' : ''} — cap ${caps[gym]}`, '', '```text');
  for (const mon of trainer.team) {
    readme.push(Dex.species.get(formName(mon)).name + (item(mon) ? ' @ ' + item(mon) : ''), `Level: ${mon.level}`,
      'Ability: ' + Dex.abilities.get(mon.ability).name, ...(mon.gimmicks?.tera ? ['Tera Type: ' + Dex.types.get(mon.gimmicks.tera).name] : []),
      'Nature: ' + Dex.natures.get(mon.nature).name, 'IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe',
      'EVs: ' + stats.filter(s => mon.evs[s]).map(s => `${mon.evs[s]} ${labels[s]}`).join(' / '),
      ...mon.moveset.map(m => '- ' + Dex.moves.get(m).name), '');
  }
  readme.push('```', '');
}
readme.push('## Installation and verification', '',
  'The updated archive replaces the existing same-named pack in the profile\'s `datapacks/` folder. Keep the Rejuvenation base pack and core/compat mods enabled. Load this extension after `COBBLEVERSE-RCT-DP-v20.zip` and `COBBLEVERSE-DP-v31.zip` so its resources override the originals. Global Packs already requires the profile\'s datapacks folder. The saved New World enabled-pack list was read and confirms this override order.', '',
  'Restart Minecraft and load the world to use the shipped definitions. `/datapack list enabled` can confirm the extension is enabled. An existing spawned trainer may have cached its old team; use a newly spawned/recreated gym NPC if necessary.', '',
  'Original COBBLEVERSE archives, league progression requirements, Surge\'s team and gym structure, and other extension resources are preserved. All 13 team files and requested field assignments are packaged in the existing extension.', '',
  `Validated offline against the installed Showdown simulator and the authored field engine: all species/forms, items, moves, abilities, natures, levels, IVs, EVs, complete teams and field starts; declared Tera choices; Mega evolution; Kommo-o\'s Z-Move; Misty\'s Dive transition. ${checks.length} checks passed. These changes have not been tested in live Minecraft gym battles.`, '',
  'Validation receipt: `rejuvenation/research/test-results/kanto-gyms-simulator.json`. Installation receipt and backup location: `rejuvenation/research/test-results/kanto-gyms-install.json`.', '');
if (!failures.length) {
  fs.writeFileSync(path.join(source, 'README.md'), readme.join('\n'));
  fs.writeFileSync(path.join(root, 'README_KANTO_GYMS.md'), readme.join('\n'));
  fs.writeFileSync(path.join(root, 'README_KANTO_LEAGUE.md'), readme.join('\n'));
  fs.writeFileSync(path.join(root, 'docs/KANTO_LEAGUE_FIELDS.md'), [
    '# Kanto league fields', '', 'Complete gym, Elite Four and Champion sets: [README_KANTO_LEAGUE.md](../README_KANTO_LEAGUE.md).', '',
    'All trainer fields follow the user-authored rosters dated 2026-10-08. Earlier win-share scores in research/trainer-field-scores.json describe the prior teams and are historical; they are not performance claims for these replacements.', '',
    '| Trainer | Cap | Format | Starting field |', '|---|---:|---|---|',
    ...Object.entries(gyms).map(([gym, t]) => `| ${t.name.literal} | ${caps[gym]} | ${t.battleFormat} | ${catalog.fields['rejuvenation:' + fields[gym]].name}${gym === 'misty' ? ' → Underwater via Dive' : ''} |`),
    '',
    'Bindings live in `datapack/cobbleverse/data/rejuvenation/rejuvenation/trainers/kanto.json`. TrainerFieldBridge selects these on battle pre-start at TRAINER priority; an EXPLICIT selection still takes precedence.', ''
  ].join('\n'));
}
const sourceHashes = {};
function hashFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) hashFiles(file);
    else sourceHashes[path.relative(source, file).replaceAll('\\', '/')] = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  }
}
hashFiles(source);
const receipt = { date: '2026-10-08', checksPassed: checks.length, failures, checks, sourceHashes,
  addonSha256: runtime.addonSha256, originalTrainerPackSha256: runtime.originalTrainerPackSha256, savedWorldPackOrder: runtime.savedWorldPackOrder,
  simulator: 'Installed profile/showdown', fieldEngineSha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(root, 'core/src/main/resources/rejuvenation-engine.js'))).digest('hex'),
  liveMinecraftBattleTested: false };
fs.writeFileSync(path.join(root, 'research/test-results/kanto-gyms-simulator.json'), JSON.stringify(receipt, null, 2) + '\n');
console.log(`${checks.length} checks passed; ${failures.length} failures`);
for (const failure of failures) console.error(failure);
process.exit(failures.length ? 1 : 0);
