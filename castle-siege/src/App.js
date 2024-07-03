import './App.css';
import _, { map, random } from 'underscore';

function App() {

  // Many TODOs, I'm just getting a few things scaffolded for now.
  // 1. I'll start with a simple set of HARD CODED threats, and a few HARD CODED spells.
  // 2. I'll want to tie these to the MtG API, so I can show the images of the cards.

  // function randomSpell() {
  const randomSpell = () => {
    const spellNamesTargetsPlayer = [
      'Lightning Bolt',
      'Lava Axe',
      'Shock'
    ];
    // todo: will set up different modes of cating spells.
    const spellNamesGlobal = [
      'Pyroclasm'
    ];

    const randomSpellName = spellNamesTargetsPlayer[_.random(0, spellNamesTargetsPlayer.length - 1)];

    alert(`The enemy casts ${randomSpellName} on you!`)
  };

  const randomAttack = () => {
    // todo: handle singular / plural
    // todo: for further reduction of cognitive load, it would be best to use standard tokens for these, too!
    // I'll keep expanding this as a global library. Then it will be called like, "give me a random attack of goblin, ogre, or giant", or "give me a random attack of elemental or dragon"
    const creatureTypes = [
      {
        key: 'goblin',
        text: '1/1 Goblin',
        quantityRange: [3,6]
      },
      {
        key: 'ogre',
        text: '2/2 Ogre with menace',
        quantityRange: [2,4]
      },
      {
        key: 'giant',
        text: '3/3 Giant with trample',
        quantityRange: [1,3]
      }
    ];

    const whichCreatureType = creatureTypes[_.random(0, creatureTypes.length - 1)];
    const whichCreatureTypeName = whichCreatureType.text;
    const howMany = [_.random(whichCreatureType.quantityRange[0], whichCreatureType.quantityRange[1])]; 

    alert(`The enemy attacks you with ${howMany} ${whichCreatureTypeName}!`)
  };

  return (
    <div className="App">

      <button onClick={randomSpell}>Cast from among the pre-set spells</button>
      <button onClick={randomAttack}>Have the enemy perform an attack</button>

      <h1>Castle Siege</h1>

      <h2><em>A new format of Magic the Gathering, being developed by Mike Caputo</em></h2>

      <hr />

      <h3>Lowland Tribes</h3>
      <h3>The Drake Nests</h3>
      <h3>Elemental Pools</h3>
      <h3>Mons' Castle</h3>

    </div>
  );
}

export default App;
