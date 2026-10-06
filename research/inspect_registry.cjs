const path=require('node:path'),fs=require('node:fs');
const root=path.resolve(__dirname,'../..');
const {Dex}=require(path.join(root,'showdown/sim/dex'));
const dex=Dex.mod('cobblemon');
const ids=kind=>dex[kind].all().filter(x=>x.exists).map(x=>x.id).sort();
const result={moves:ids('moves'),abilities:ids('abilities'),items:ids('items'),species:ids('species'),conditions:Object.keys(dex.data.Conditions)};
// Datapacks/mods can supply additional Showdown scripts at runtime. IDs are
// inventoried separately from the base dex instead of assuming they were loaded.
fs.writeFileSync(path.join(__dirname,'simulator-registry.json'),JSON.stringify(result,null,2));
// Display names for the player-facing field notes (moves, abilities, items), straight from the installed dex.
const names=kind=>Object.fromEntries(dex[kind].all().filter(x=>x.exists).map(x=>[x.id,x.name]).sort((a,b)=>a[0]<b[0]?-1:1));
fs.writeFileSync(path.join(__dirname,'display-names.json'),JSON.stringify({moves:names('moves'),abilities:names('abilities'),items:names('items')},null,1));
console.log('Inspected bundled Cobblemon dex: '+result.moves.length+' moves, '+result.abilities.length+' abilities, '+result.items.length+' items');
