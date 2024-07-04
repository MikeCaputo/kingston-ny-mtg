import './App.css';
// import _, { map, random } from 'underscore';
import _ from 'underscore';
import React, { useState, useEffect } from 'react'; // I forget, does this need to be imported into each component, or only at the top?
// const mtgSdk = require('mtgsdk'); // https://docs.magicthegathering.io/
// import mtgSdk from 'mtgsdk'; // https://docs.magicthegathering.io/

const Threat = (props) => {

  // Many TODOs, I'm just getting a few things scaffolded for now.
  // 1. I'll start with a simple set of HARD CODED threats, and a few HARD CODED spells.
  // 2. I'll want to tie these to the MtG API, so I can show the images of the cards.

  const attacksWith = props.attacksWith;
  const usesSpells = props.usesSpells;
  const yieldsReward = props.rewards;

  const [damageToDealToThreat, setDamageToDealToThreat] = useState(0);
  const [threatLifeTotal, setThreatLifeTotal] = useState(props.lifeTotal);
  const [isThreatAlive, setIsThreatAlive] = useState(true);
  const [cardToDisplay, setCardToDisplay] = useState(null); // todo: need to slegantly handle no card vs a card display

  const creatureTypes = [
    {
      key: 'carnivore',
      text: '3/1 Carnivore'
    },
    {
      key: 'dragon',
      text: '4/4 Dragon with flying'
    },
    {
      key: 'elemental',
      text: '3/1 Elemental'
    },
    {
      key: 'giant',
      text: '4/4 Giant'
    },
    {
      key: 'goblin',
      text: '1/1 Goblin'
    },
    {
      key: 'ogre',
      text: '3/3 Ogre'
    }
  ];

  const spellTypes = [
    {
      key: 'lightningBolt',
      text: 'Lightning Bolt',
      targetsPlayer: true
    },
    {
      key: 'lavaAxe',
      text: 'Lava Axe',
      targetsPlayer: true
    },
    {
      key: 'pyroclasm',
      text: 'Pyroclasm',
      targetsPlayer: false
    },
    {
      key: 'shock',
      text: 'Shock',
      targetsPlayer: true
    },
    {
      key: 'shatterStorm',
      text: 'Shatter Storm',
      targetsPlayer: false
    },
    {
      key: 'destructiveForce',
      text: 'Destructive Force',
      targetsPlayer: false
    }
  ];

  const rewardTypes = [
    {
      key: 'clue',
      text: 'Clue Token'
    },
    {
      key: 'food',
      text: 'Food Token'
    },
    {
      key: 'goblin',
      text: '1/1 Goblin Token'
    },
    {
      key: 'junk',
      text: 'Junk Token'
    },
    {
      key: 'map',
      text: 'Map Token'
    },
    {
      key: 'treasure',
      text: 'Treasure Token'
    }
  ];

  const randomSpell = () => {
    const randomSpellKey = usesSpells[_.random(0, usesSpells.length - 1)];
    const whichSpellType = spellTypes.find(spellType => spellType.key === randomSpellKey);
    alert(`${props.name} casts ${whichSpellType.text}${whichSpellType.targetsPlayer ? ' on you' : ''}!`)
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

    setIsThreatAlive(false);

    if(props.isBoss) {
      alert(`Hurrah, hurrah forever! ${props.name} has been defeated! Your team has vanquished this terrible foe. Now, only the fates know how long it will be until a new leader arises to take their place...`);
    } else {
      const whichRewardType = yieldsReward[_.random(0, yieldsReward.length - 1)];
      const whichRewardTypeName = rewardTypes.find(rewardType => rewardType.key === whichRewardType.key).text;
      const howMany = [_.random(whichRewardType.quantityRange[0], whichRewardType.quantityRange[1])];
      alert(`${props.name} has been defeated! You gain ${howMany} ${whichRewardTypeName}.`);
    }

  }

  const generateCardImage = async (cardName) => { // name wip

    try {
      // todo: may need more advanced handling for tokens
      // const cardToDisplay = await mtgSdk.card.where({
      //   name: cardName
      // });

      // console.log(`cardToDisplay.name is: ${cardToDisplay.name}`)
      // console.log(`cardToDisplay.imageUrl is: ${cardToDisplay.imageUrl}`)
  
      // It seems that some of these fail to have images. In that case, I'll display the text...
      if(cardToDisplay.imageUrl) {
        // document.getElementById('commander-data').innerHTML = `
        //   <hr />  
        //   <img src="${cardToDisplay.imageUrl}" alt="${cardToDisplay.name}" title="${cardToDisplay.name}"/>
        //   <p>Now, go forth: build a fun deck and show the world what ${cardToDisplay.name} can do!</p>
        //   <hr />  
        // `;
      } else {
        // todo: handle lack of image....
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

      <div className="currentAttackCard">
        
      </div>

    </div>
  );
}

export default Threat;
