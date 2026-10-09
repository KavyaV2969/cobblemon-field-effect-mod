// Offline full-fight test of the 13 Kanto league fights: complete battles on the assigned field, with the trainer side
// driven by the field engine's consequence scoring using the same decision rule as compat/RunBunStrategy.java
// (score = consequence - resourceCost, Mega mandatory, Tera/Dynamax only for declared members).
// Opponent teams are generic "player" teams at the trainer's level cap.
// Usage: node research/simulate_kanto_fights.cjs --variant classic|hardcore [--seeds N] [--only id,id] [--parallel]
// The variant picks the roster pack (datapack/kanto-classic or datapack/kanto-hardcore); the fields come from the shared extension (datapack/cobbleverse).
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const root = path.resolve(__dirname, '..'), profile = path.resolve(root, '..');
const simRequire = require('node:module').createRequire(path.join(profile, 'showdown/index.js'));
const { Battle } = simRequire('./sim/battle'), { Dex } = simRequire('./sim/dex');
const argv = process.argv.slice(2), arg = (name, fallback) => { const i = argv.indexOf('--' + name); return i >= 0 ? argv[i + 1] : fallback; };
const SEEDS = Number(arg('seeds', 3)), ONLY = arg('only', '') ? arg('only').split(',') : null, MAX_TURNS = 250;
const variant = arg('variant', '');
if (!['classic', 'hardcore'].includes(variant)) { console.error('Usage: node research/simulate_kanto_fights.cjs --variant classic|hardcore [--seeds N] [--only id,id] [--parallel]'); process.exit(2); }
const source = path.join(root, 'datapack', 'kanto-' + variant);

// Z-A Mega data normally injected by Fabric at startup (same preamble as verify_kanto_gyms.cjs).
const runtime = JSON.parse(fs.readFileSync(path.join(root, 'research/test-results/kanto-gyms-runtime.json'), 'utf8'));
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
let engineSource = fs.readFileSync(path.join(root, 'core/src/main/resources/rejuvenation-engine.js'), 'utf8');
// TRACE_ROWS=1 keeps the stack of failed candidate rows (diagnostic only; the shipped engine is never modified).
if (process.env.TRACE_ROWS) engineSource = engineSource.replace('error:String(error.message || error)', 'error:String(error.stack)');
vm.runInContext(engineSource, sandbox);
const E = sandbox.RejuvenationEngine;
E.load(JSON.stringify(catalog));

const caps = { brock: 16, misty: 28, ltsurge: 36, erika: 44, sabrina: 59, koga: 68, blaine: 76, giovanni: 81,
  league_lorelei: 85, league_bruno: 85, league_agatha: 85, league_lance: 85, champion_blue: 85 };
const fields = { brock: 'crystal_cavern', misty: 'water_surface', ltsurge: 'murkwater_surface', erika: 'warped_forest',
  sabrina: 'psychic_terrain', koga: 'wasteland', blaine: 'crimson_forest', giovanni: 'deep_dark',
  league_lorelei: 'frozen_dimension', league_bruno: 'colosseum', league_agatha: 'haunted', league_lance: 'dragons_den', champion_blue: 'new_world' };
// Cobblemon item IDs whose Showdown ID differs (Cobblemon's Charcoal Stick is Showdown's Charcoal).
const ITEM_ALIASES = { charcoalstick: 'charcoal' };
const showdownItem = id => { const bare = id.split(':')[1].toLowerCase().replace(/[^a-z0-9]/g, ''); return ITEM_ALIASES[bare] || bare; };
const toID = text => String(text).toLowerCase().replace(/[^a-z0-9]/g, '');
const uuid = (group, n) => `00000000-0000-0000-${String(group).padStart(4, '0')}-${String(n).padStart(12, '0')}`;
function formName(mon) {
  for (const [aspect, suffix] of [['alolan', 'alola'], ['hisuian', 'hisui'], ['hearthflame-mask', 'hearthflame'], ['wash-appliance', 'wash'], ['low_key-form', 'lowkey'],
    ['ice-rider', 'ice'], ['shadow-rider', 'shadow'], ['crowned', 'crowned'], ['dusk-fusion', 'duskmane'], ['bloodmoon', 'bloodmoon']])
    if ((mon.aspects || []).includes(aspect)) return mon.species + suffix;
  return mon.species;
}
const info = m => ({ pp: Dex.moves.get(m).pp, maxPp: Dex.moves.get(m).pp });
function trainerSet(mon, i) {
  return { species: Dex.species.get(formName(mon)).name, ability: Dex.abilities.get(mon.ability).name,
    item: mon.heldItem.length ? Dex.items.get(showdownItem(mon.heldItem[0])).name : '', nature: Dex.natures.get(mon.nature).name,
    moves: mon.moveset.slice(), movesInfo: mon.moveset.map(info), level: mon.level, ivs: { ...mon.ivs }, evs: { ...mon.evs },
    teraType: mon.gimmicks?.tera || undefined, gender: mon.gender === 'FEMALE' ? 'F' : mon.gender === 'MALE' ? 'M' : '', uuid: uuid(1, i + 1) };
}

// Generic challenger teams (fixed species, scaled to the fight's cap). "stall" stresses long-battle loops (recovery, Protect, hazards).
const CHALLENGERS = {
  balanced: [['Garchomp', 'Rough Skin', 'Life Orb', ['earthquake', 'dragonclaw', 'stoneedge', 'swordsdance']],
    ['Corviknight', 'Pressure', 'Leftovers', ['bravebird', 'bodypress', 'roost', 'defog']],
    ['Slowbro', 'Regenerator', 'Assault Vest', ['scald', 'slackoff', 'psychic', 'thunderwave']],
    ['Dragapult', 'Clear Body', 'Choice Specs', ['shadowball', 'dracometeor', 'flamethrower', 'uturn']],
    ['Rotom-Wash', 'Levitate', 'Sitrus Berry', ['hydropump', 'voltswitch', 'willowisp', 'thunderbolt']],
    ['Excadrill', 'Mold Breaker', 'Focus Sash', ['earthquake', 'ironhead', 'rockslide', 'swordsdance']]],
  offense: [['Landorus-Therian', 'Intimidate', 'Rocky Helmet', ['earthquake', 'uturn', 'stoneedge', 'stealthrock']],
    ['Volcarona', 'Flame Body', 'Heavy-Duty Boots', ['quiverdance', 'fireblast', 'bugbuzz', 'gigadrain']],
    ['Weavile', 'Pressure', 'Choice Band', ['tripleaxel', 'knockoff', 'iceshard', 'lowkick']],
    ['Heracross', 'Guts', 'Flame Orb', ['closecombat', 'megahorn', 'knockoff', 'facade']],
    ['Gliscor', 'Poison Heal', 'Toxic Orb', ['earthquake', 'protect', 'knockoff', 'swordsdance']],
    ['Tapu Koko', 'Electric Surge', 'Life Orb', ['thunderbolt', 'dazzlinggleam', 'voltswitch', 'hiddenpowerice']]],
  stall: [['Blissey', 'Natural Cure', 'Leftovers', ['softboiled', 'seismictoss', 'toxic', 'protect']],
    ['Skarmory', 'Sturdy', 'Rocky Helmet', ['spikes', 'roost', 'bravebird', 'whirlwind']],
    ['Toxapex', 'Regenerator', 'Black Sludge', ['recover', 'toxic', 'scald', 'haze']],
    ['Ferrothorn', 'Iron Barbs', 'Leftovers', ['leechseed', 'powerwhip', 'stealthrock', 'protect']],
    ['Clefable', 'Magic Guard', 'Leftovers', ['moonblast', 'calmmind', 'softboiled', 'flamethrower']],
    ['Hippowdon', 'Sand Stream', 'Leftovers', ['earthquake', 'slackoff', 'stealthrock', 'toxic']]]
};
const challenger = (kind, cap, group) => CHALLENGERS[kind].map(([species, ability, item, moves], i) => ({
  species, ability, item, level: cap, moves, movesInfo: moves.map(info), uuid: uuid(group, i + 1) }));

const resourceCost = (gimmick, allies) => (gimmick === 'mega' || gimmick === 'ultra' ? 2 : 8) + Math.max(0, allies - 1) * 4;
const requestMon = (side, uuidValue) => side.pokemon.find(p => p.set.uuid === uuidValue);

/**
 * One side's choice for the current request. `rules` = { gimmickMembers: Set(species ids allowed to Tera/Dynamax) } for trainers.
 * Returns { choice, notes } where notes are the gimmicks and counts used (for policy assertions).
 */
function decide(b, sideId, rules, stats) {
  const side = b[sideId], req = side.activeRequest;
  const foeSide = side.foe;
  const alive = side.pokemon.filter(p => p.hp > 0 && !p.fainted);
  const used = new Set(), reserved = new Set(), picks = [];
  const foeActive = foeSide.active.filter(p => p && p.hp > 0 && !p.fainted);
  if (req.forceSwitch) {
    const needed = req.forceSwitch;
    needed.forEach((must, slot) => {
      if (!must) { picks.push('pass'); return; }
      const bench = alive.filter(p => !p.isActive && !used.has(p.set.uuid));
      if (!bench.length) { picks.push('pass'); return; }
      // Best reserve by strongest scored move into the first foe (switch-in screening); fall back to party order.
      let best = bench[0], bestScore = -Infinity;
      for (const cand of bench) {
        try {
          const rows = JSON.parse(E.strategy(b, { user: cand.set.uuid, screen: false, candidates: cand.moveSlots.map(s => ({ move: s.id, target: foeActive[0]?.set.uuid })).filter(c => c.target) })).candidates;
          const top = Math.max(...rows.filter(r => !r.error).map(r => r.score), -Infinity);
          if (top > bestScore) { best = cand; bestScore = top; }
        } catch (_) { stats.switchScoreErrors++; }
      }
      used.add(best.set.uuid); picks.push('switch ' + (side.pokemon.indexOf(best) + 1));
    });
    return picks.join(', ');
  }
  const mandatoryMega = req.active.some((a, i) => a && a.canMegaEvo && side.active[i] && side.active[i].hp > 0);
  const megaPending = new Set();
  req.active.forEach((slotReq, slot) => {
    const mon = side.active[slot];
    if (!slotReq || !mon || mon.hp <= 0 || mon.fainted) { picks.push('pass'); return; }
    const candidates = [], choices = [];
    const requiredMega = !!slotReq.canMegaEvo && !megaPending.size;
    const foeTargets = foeActive.length ? foeActive : [];
    slotReq.moves.forEach((m, mi) => {
      if (m.disabled || !m.pp) return;
      const variants = [''];
      if (slotReq.canMegaEvo && !megaPending.size) variants.push('mega');
      if (slotReq.canUltraBurst) variants.push('ultra');
      if (slotReq.canTerastallize && rules.gimmickMembers.has(mon.species.id) && !reserved.has('terastallize')) variants.push('terastallize');
      if (slotReq.canZMove && slotReq.canZMove[mi] && !reserved.has('zmove')) variants.push('zmove');
      for (const gimmick of variants) {
        const tgts = (m.target === 'self' || m.target === 'allySide' || m.target === 'allyTeam' || m.target === 'all' || m.target === 'foeSide' || m.target === 'randomNormal' || m.target === 'allAdjacent' || m.target === 'allAdjacentFoes' || m.target === 'adjacentAllyOrSelf')
          ? [foeTargets[0]] : foeTargets;
        for (const t of tgts) {
          if (!t) continue;
          const q = { user: mon.set.uuid, target: t.set.uuid, move: m.id };
          if (gimmick) q.gimmick = gimmick;
          candidates.push(q);
          const needsTarget = ['normal', 'any', 'adjacentFoe', 'adjacentAlly', 'adjacentAllyOrSelf'].includes(m.target) && foeSide.active.length > 1;
          const loc = foeSide.active.indexOf(t) + 1;
          choices.push(`move ${mi + 1}${needsTarget ? ' ' + loc : ''}${gimmick ? ' ' + gimmick : ''}`);
        }
      }
    });
    if (!slotReq.trapped && !requiredMega) for (const p of alive) {
      if (p.isActive || used.has(p.set.uuid)) continue;
      candidates.push({ user: mon.set.uuid, switch: p.set.uuid });
      choices.push('switch ' + (side.pokemon.indexOf(p) + 1));
    }
    if (!candidates.length) { picks.push('move 1'); return; }
    let result;
    const t0 = process.hrtime.bigint();
    try { result = JSON.parse(E.strategy(b, { user: mon.set.uuid, candidates })).candidates; }
    catch (error) { stats.strategyExceptions.push(error.message); picks.push('default'); return; }
    stats.decisionMs.push(Number(process.hrtime.bigint() - t0) / 1e6);
    const allies = alive.length;
    let best = -Infinity, pick = -1;
    result.forEach((row, i) => {
      if (row.error) { stats.rowErrors.push(`${mon.species.id}: ${row.error} (${JSON.stringify(candidates[i])})`); return; }
      if (row.pruned) return;
      const gimmick = candidates[i].gimmick || '';
      if (requiredMega && gimmick !== 'mega') return;
      const score = row.score - (gimmick ? resourceCost(gimmick, allies) : 0);
      if (score > best) { best = score; pick = i; }
    });
    if (pick < 0) { stats.noScorable++; picks.push(choices.find(c => c.startsWith('move')) || 'default'); return; }
    const c = candidates[pick];
    if (process.env.KEEP_LOG && slotReq.trapped && c.switch) console.log('TRAPPED-SWITCH', sideId, JSON.stringify({ trapped: slotReq.trapped, req: Object.keys(req), forceSwitch: req.forceSwitch, activeLen: req.active.length }));
    if (c.gimmick) { reserved.add(c.gimmick); if (c.gimmick === 'mega') megaPending.add(slot); }
    if (c.switch) used.add(c.switch);
    picks.push(choices[pick]);
  });
  return picks.join(', ');
}

function fight(gym, trainer, field, kind, seed, lead = -1) {
  const doubles = trainer.battleFormat === 'GEN_9_DOUBLES', cap = caps[gym];
  const b = new Battle({ formatid: doubles ? 'gen9doublescustomgame' : 'gen9customgame', seed: [seed, seed * 7 + 1, seed * 13 + 2, seed * 29 + 3] });
  E.attach(b, 'rejuvenation:' + field);
  const order = lead >= 0 ? [trainer.team[lead], ...trainer.team.filter((_, i) => i !== lead)] : trainer.team;
  const team = order.map(trainerSet);
  b.setPlayer('p1', { name: trainer.name.literal, team });
  b.setPlayer('p2', { name: 'Challenger', team: challenger(kind, cap, 2) });
  const declared = new Set(trainer.team.filter(m => m.gimmicks?.tera).map(m => m.species));
  const speciesOf = Object.fromEntries(team.map(m => [m.uuid, toID(m.species)]));
  const stats = { strategyExceptions: [], rowErrors: [], decisionMs: [], noScorable: 0, switchScoreErrors: 0, illegalChoices: [] };
  // A member's declaration authorizes its Tera whatever form it is in (Ogerpon-Hearthflame, Typhlosion-Hisui, Toxtricity-Low-Key, Ursaluna-Bloodmoon).
  const declaredIds = new Set(trainer.team.filter(m => m.gimmicks?.tera).flatMap(m => [toID(m.species), toID(Dex.species.get(formName(m)).id)]));
  const rulesTrainer = { gimmickMembers: declaredIds }, rulesPlayer = { gimmickMembers: new Set() };
  let reason = '';
  try {
    if (b.requestState === 'teampreview') {
      b.choose('p1', 'team ' + team.map((_, i) => i + 1).join(''));
      b.choose('p2', 'team ' + [1, 2, 3, 4, 5, 6].join(''));
    }
    const startField = E.current(b).id;
    let guard = 0;
    while (!b.ended && b.turn <= MAX_TURNS && guard++ < MAX_TURNS * 3) {
      const wants = ['p1', 'p2'].filter(id => b[id].activeRequest && !b[id].activeRequest.wait);
      for (const id of wants) {
        const choice = decide(b, id, id === 'p1' ? rulesTrainer : rulesPlayer, stats);
        if (b.choose(id, choice) === false) {
          if (process.env.KEEP_LOG) console.log('ILLEGAL', id, b.turn, choice, 'FS=' + JSON.stringify(b[id].activeRequest.forceSwitch), 'side=' + Object.keys(b[id].activeRequest), b[id].pokemon.map(p => p.set.species + ':' + p.hp + ':' + p.isActive).join(','), b[id].choice?.error);
          if (id === 'p1') stats.illegalChoices.push(`turn ${b.turn}: "${choice}"`); else stats.challengerIllegal = (stats.challengerIllegal || 0) + 1;
          if (b.choose(id, 'default') === false) { reason = 'no legal fallback after illegal choice'; break; }
        }
      }
      if (reason) break;
    }
    const log = b.log;
    const count = re => log.filter(l => re.test(l)).length;
    const fainted = side => b[side].pokemon.filter(p => p.fainted || p.hp <= 0).length;
    if (process.env.KEEP_LOG) globalThis.__log = log;
    return { gym, kind, seed, ended: b.ended, winner: b.winner || null, turns: b.turn, reason, startField,
      endField: E.current(b).id, trainerFainted: fainted('p1'), challengerFainted: fainted('p2'),
      mega: log.filter(l => /^\|-mega\|p1/.test(l)).length, tera: log.filter(l => /^\|-terastallize\|p1/.test(l)).map(l => speciesOf[l.split('|')[2].split(': ')[1]]),
      ultra: log.filter(l => /^\|-burst\|p1/.test(l)).length, zmoves: log.filter(l => /^\|-zpower\|p1/.test(l)).length,
      dynamax: count(/^\|-start\|.*dynamax/i), challengerGimmicks: log.filter(l => /^\|-(mega|terastallize|burst|zpower)\|p2/.test(l)).length,
      trainerMoves: log.filter(l => /^\|move\|p1/.test(l)).map(l => toID(l.split('|')[3])),
      diveSeen: log.some(l => /^\|move\|p1[ab]: [^|]*\|Dive\|/.test(l)), logErrors: log.filter(l => /^\|error\||^\|html\|.*error/i.test(l)).length,
      stats };
  } catch (error) {
    return { gym, kind, seed, crashed: true, error: error.stack.split('\n').slice(0, 4).join(' | '), turns: b.turn, stats };
  } finally { try { b.destroy(); } catch (_) {} }
}

const results = [], problems = [], summary = [];
const started = Date.now();
const median = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
function runGym(gym) {
  const trainer = JSON.parse(fs.readFileSync(path.join(source, 'data/rctmod/trainers', `kanto_${gym}.json`), 'utf8'));
  const declaredMon = trainer.team.find(m => m.gimmicks?.tera)?.species;
  const rows = [], gymProblems = [];
  // Ordinary fights, plus fights led by each resource holder (Mega/Z/Ultra/Tera) so those policies are reached in every roster.
  const scenarios = [];
  for (const kind of Object.keys(CHALLENGERS)) for (let s = 1; s <= SEEDS; s++) scenarios.push({ kind, seed: s, lead: -1 });
  trainer.team.forEach((m, i) => {
    const it = m.heldItem.length ? Dex.items.get(showdownItem(m.heldItem[0])) : null;
    const holds = m.gimmicks?.tera || it?.megaStone || it?.zMove || it?.id === 'ultranecroziumz';
    if (holds) for (const kind of ['stall', 'balanced']) scenarios.push({ kind, seed: 1, lead: i, label: formName(m) });
  });
  for (const sc of scenarios) {
    const { kind, seed: s, lead } = sc;
    const r = fight(gym, trainer, fields[gym], kind, s, lead);
    if (process.env.KEEP_LOG && process.env.KEEP_LOG === gym + '/' + kind + '/' + s + '/' + lead) console.log(globalThis.__log.join('\n'));
    r.lead = lead >= 0 ? sc.label : null;
    rows.push(r);
    const tag = `${gym}/${kind}/seed${s}${lead >= 0 ? '/lead-' + sc.label : ''}`;
    if (r.crashed) { gymProblems.push(`${tag}: crashed: ${r.error}`); continue; }
    if (!r.ended) gymProblems.push(`${tag}: did not finish within ${MAX_TURNS} turns (${r.reason || 'stall'})`);
    if (r.startField !== 'rejuvenation:' + fields[gym]) gymProblems.push(`${tag}: started on ${r.startField}`);
    if (r.stats.strategyExceptions.length) gymProblems.push(`${tag}: ${r.stats.strategyExceptions.length} strategy exceptions, first: ${r.stats.strategyExceptions[0]}`);
    if (r.stats.rowErrors.length) gymProblems.push(`${tag}: ${r.stats.rowErrors.length} candidate errors, first: ${r.stats.rowErrors[0]}`);
    if (r.stats.illegalChoices.length) gymProblems.push(`${tag}: ${r.stats.illegalChoices.length} illegal choices, first: ${r.stats.illegalChoices[0]}`);
    if (r.mega > 1) gymProblems.push(`${tag}: ${r.mega} Mega evolutions`);
    if (r.tera.length > 1) gymProblems.push(`${tag}: ${r.tera.length} Tera uses`);
    if (r.tera.length && !declaredMon) gymProblems.push(`${tag}: Tera used with no declared member`);
    if (r.tera.length && declaredMon && r.tera.some(sp => !toID(sp).startsWith(toID(declaredMon)) && !toID(declaredMon).startsWith(toID(sp))))
      gymProblems.push(`${tag}: Tera used by ${r.tera} instead of declared ${declaredMon}`);
    if (lead >= 0) {
      const m = trainer.team[lead], it = m.heldItem.length ? Dex.items.get(showdownItem(m.heldItem[0])) : null;
      if (it?.megaStone && r.mega !== 1) gymProblems.push(`${tag}: Mega holder led but Mega count was ${r.mega} (policy requires activation on first legal move)`);
      r.leadGimmickUsed = !!(it?.megaStone ? r.mega : it?.id === 'ultranecroziumz' ? r.ultra : it?.zMove ? r.zmoves : r.tera.length);
    }
    if (r.dynamax) gymProblems.push(`${tag}: Dynamax/Gmax used`);
    if (r.logErrors) gymProblems.push(`${tag}: ${r.logErrors} error lines in the battle log`);
  }
  const done = rows.filter(r => !r.crashed);
  const used = new Set(done.flatMap(r => r.trainerMoves));
  const unused = trainer.team.flatMap(m => m.moveset.filter(mv => !used.has(mv)).map(mv => `${formName(m)}:${mv}`));
  const s = { gym, name: trainer.name.literal, field: fields[gym], format: trainer.battleFormat, battles: rows.length,
    finished: done.filter(r => r.ended).length, trainerWins: done.filter(r => r.winner === trainer.name.literal).length,
    medianTurns: median(done.map(r => r.turns)), megaFights: done.filter(r => r.mega).length, teraFights: done.filter(r => r.tera.length).length,
    teraSpecies: [...new Set(done.flatMap(r => r.tera))], ultraFights: done.filter(r => r.ultra).length, zFights: done.filter(r => r.zmoves).length,
    medianDecisionMs: Math.round(median(done.flatMap(r => r.stats.decisionMs))), maxDecisionMs: Math.round(Math.max(0, ...done.flatMap(r => r.stats.decisionMs))),
    movesNeverChosen: unused, leadScenarios: done.filter(r => r.lead).map(r => ({ lead: r.lead, vs: r.kind, gimmickUsed: r.leadGimmickUsed })), diveFights: gym === 'misty' ? done.filter(r => r.diveSeen).length : undefined,
    endedUnderwater: gym === 'misty' ? done.filter(r => r.endField === 'rejuvenation:underwater').length : undefined };
  console.log(`${s.name.padEnd(10)} ${s.format === 'GEN_9_DOUBLES' ? 'doubles' : 'singles'} ${s.finished}/${s.battles} finished, trainer won ${s.trainerWins}, median ${s.medianTurns} turns, ` +
    `mega ${s.megaFights} tera ${s.teraFights} ultra ${s.ultraFights} z ${s.zFights}, decision median ${s.medianDecisionMs} ms (max ${s.maxDecisionMs})${s.movesNeverChosen.length ? ', never chosen: ' + s.movesNeverChosen.join(' ') : ''}`);
  return { summary: s, problems: gymProblems, fights: rows.map(({ stats, trainerMoves, ...r }) => ({ ...r, decisions: stats.decisionMs.length })) };
}

const list = (ONLY || Object.keys(caps)).filter(g => caps[g]);
if (argv.includes('--parallel')) {
  const { spawn } = require('node:child_process'), os = require('node:os');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'kanto-fights-'));
  const run = gym => new Promise(resolve => {
    const out = path.join(tmp, gym + '.json');
    const child = spawn(process.execPath, [__filename, '--variant', variant, '--seeds', String(SEEDS), '--only', gym, '--child-out', out], { stdio: ['ignore', 'inherit', 'inherit'] });
    child.on('exit', () => resolve(out));
  });
  Promise.all(list.map(run)).then(files => {
    const parts = files.filter(f => fs.existsSync(f)).map(f => JSON.parse(fs.readFileSync(f, 'utf8')));
    const missing = list.filter(g => !parts.some(p => p.summary.gym === g));
    const all = { date: new Date().toISOString().slice(0, 10), variant, pack: `rejuvenation-fields-cobbleverse-${variant}`, seedsPerChallenger: SEEDS, challengers: Object.keys(CHALLENGERS), maxTurns: MAX_TURNS,
      problems: [...parts.flatMap(p => p.problems), ...missing.map(g => `${g}: child process produced no result`)],
      summary: list.map(g => parts.find(p => p.summary.gym === g)?.summary).filter(Boolean),
      fights: parts.flatMap(p => p.fights), seconds: Math.round((Date.now() - started) / 1000), liveMinecraftBattleTested: false };
    all.fightCount = all.fights.length;
    // Tie the receipt to the exact trainer files that were played (research/package.py compares these with the packaged roster).
    all.rosterSha256 = Object.fromEntries(fs.readdirSync(path.join(source, 'data/rctmod/trainers')).sort().map(f =>
      [f, require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(source, 'data/rctmod/trainers', f))).digest('hex')]));
    const target = path.join(root, `research/test-results/kanto-fights-simulation-${variant}.json`);
    try { fs.rmSync(target, { force: true }); } catch (_) {}
    fs.writeFileSync(target, JSON.stringify(all, null, 2) + '\n');
    console.log(`\n${all.fightCount} fights in ${all.seconds}s; ${all.problems.length} problems`);
    for (const p of all.problems) console.log(' - ' + p);
    process.exit(all.problems.length ? 1 : 0);
  });
} else {
  const out = list.map(runGym);
  const childOut = arg('child-out', '');
  if (childOut) fs.writeFileSync(childOut, JSON.stringify(out[0]));
  const bad = out.flatMap(o => o.problems);
  console.log(`${out.reduce((n, o) => n + o.fights.length, 0)} fights; ${bad.length} problems`);
  for (const p of bad) console.log(' - ' + p);
  process.exit(bad.length ? 1 : 0);
}
