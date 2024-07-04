import './App.css';
// import _, { map, random } from 'underscore';
import _ from 'underscore';
import React, { useState, useEffect } from 'react'; // I forget, does this need to be imported into each component, or only at the top?

const Threat = (props) => {
// function Threat({name}) {

  // Many TODOs, I'm just getting a few things scaffolded for now.
  // 1. I'll start with a simple set of HARD CODED threats, and a few HARD CODED spells.
  // 2. I'll want to tie these to the MtG API, so I can show the images of the cards.

  const attacksWith = props.attacksWith;

  const [damageToDealToThreat, setDamageToDealToThreat] = useState(0);
  const [threatLifeTotal, setThreatLifeTotal] = useState(props.lifeTotal);
  const [isThreatAlive, setIsThreatAlive] = useState(true);

  const creatureTypes = [ // this is just a library of creatures, NOT now many will be used
    {
      key: 'carnivore',
      text: '3/1 Carnivore',
      quantityRange: [3,6]
    },
    {
      key: 'dragon',
      text: '4/4 Dragon with flying',
      quantityRange: [3,6]
    },
    {
      key: 'elemental',
      text: '3/1 Elemental',
      quantityRange: [3,6]
    },
    {
      key: 'giant',
      text: '4/4 Giant',
      quantityRange: [1,3] // TODO: deprecate this here. Use the props.
    },
    {
      key: 'goblin',
      text: '1/1 Goblin',
      quantityRange: [3,6]
    },
    {
      key: 'ogre',
      text: '3/3 Ogre',
      quantityRange: [2,4]
    }
  ];

  const rewards = [
    {
      key: 'treasure',
      text: 'Treasure Token',
      quantityRange: [3,6]
    },
    {
      key: 'map',
      text: 'Map Token',
      quantityRange: [2,4]
    },
    {
      key: 'food',
      text: 'Food Token',
      quantityRange: [1,3]
    },
    {
      key: 'clue',
      text: 'Clue Token',
      quantityRange: [1,3]
    }
  ];

  const spellNamesTargetsPlayer = [
    'Lightning Bolt',
    'Lava Axe',
    'Shock'
  ];

  // function randomSpell() {
  const randomSpell = () => {

    // todo: will set up different modes of cating spells.
    const spellNamesGlobal = [
      'Pyroclasm'
    ];

    const randomSpellName = spellNamesTargetsPlayer[_.random(0, spellNamesTargetsPlayer.length - 1)];

    alert(`${props.name} casts ${randomSpellName} on you!`)
  };

  const randomAttack = () => {
    // todo: handle singular / plural
    // todo: for further reduction of cognitive load, it would be best to use standard tokens for these, too!
    const whichCreatureType = attacksWith[_.random(0, attacksWith.length - 1)];
    const whichCreatureTypeName = creatureTypes.find(creatureType => creatureType.key === whichCreatureType.key).text;
    const howMany = [_.random(whichCreatureType.quantityRange[0], whichCreatureType.quantityRange[1])];
    alert(`${props.name} attacks you with ${howMany} ${whichCreatureTypeName}!`)
  };

  const dealDamangeToThreat = () => {
    const newLifeTotal = Math.max(0, threatLifeTotal - damageToDealToThreat);
    setThreatLifeTotal(newLifeTotal);
    setDamageToDealToThreat(0); // Reset the input

    if(newLifeTotal === 0) {
      threatIsDefeated();
    }

  }

  const threatIsDefeated = () => {

    const whichRewardType = rewards[_.random(0, rewards.length - 1)];
    const whichRewardTypeName = whichRewardType.text;
    const howMany = [_.random(whichRewardType.quantityRange[0], whichRewardType.quantityRange[1])];

    setIsThreatAlive(false);

    if(props.isBoss) {
      alert(`Hurrah, hurrah forever! ${props.name} has been defeated! Your team has vanquished this terrible foe. Now, only the fates know what is in store for this leaderless land...`);
    } else {
      alert(`${props.name} has been defeated! You gain ${howMany} ${whichRewardTypeName}.`);
    }

  }

  return (
    <div className={`Threat ${isThreatAlive ? '' : 'defeated'}`}>

      <h3>{props.name}</h3>

      {isThreatAlive &&
        <>
          <button onClick={randomSpell}>Cast from among the pre-set spells</button>
          <button onClick={randomAttack}>Have the enemy perform an attack</button>
        </>
      }

      {/* Need a more elegant way to render a zero. It's falsey. But `.toString() mutates the data, which I don't want.... this is okay for now */}
      <h4>Life total: {threatLifeTotal > 0 ? threatLifeTotal : "0"}</h4>

      {isThreatAlive &&
        <>
          <input
            type="number"
            value={damageToDealToThreat}
            onChange={e => setDamageToDealToThreat(e.target.value)}  
          />
          <button onClick={dealDamangeToThreat}>Deal damage to this Threat</button>
        </>
      }

    </div>
  );
}

export default Threat;