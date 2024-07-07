import './App.css';
import _ from 'underscore';
// import React, { useState, useEffect } from 'react';
import React, { useState } from 'react';
import axios from 'axios';

const fetchCard = async (cardName, isToken = false, color = '') => {
  // TODO: before hitting the API, we need to check if we've already fetched and stored it locally. That will save greatly on API hits.
  // > For both exact and fuzzy, card names are case-insensitive and punctuation is optional (you can drop apostrophes and periods etc). For example: fIReBALL is the same as Fireball and smugglers copter is the same as Smuggler's Copter. - https://scryfall.com/docs/api/cards/named
  try {
    // const response = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${cardName}`);
    //~ Second pass on this: using `/search` instead of `/named` gives me more parameters, specifically the ability to search for tokens. This seems to be the more robust way.
    // Adding the `color` parameter, so we can specify to get the correct color creatures (red giant instead of green). In the future, this section would need to be more robust, but this is a good v1.

    //~ Discoveries: a query such as "Shock" will get ALL cards with the name `shock` in them. Then they will be returned alphabetically. So, searching for "Shock", just grabbing the first will result in "Aether Shockwave" which is not what we want.
    //~ So, it looks like I'll need to locally do a `find` by the name to get the exact match.
    //~ Very inefficient right now, pulling down all of that extra data. Hopefully I can get better queries in place eventually.
    // TODO: I should be able to pass in `+oracle:' '` to have no rules text, but that isn't quite working yet.
    const scryfallQuery = `https://api.scryfall.com/cards/search?q=name:${cardName}${isToken ? '+layout:token' : ''}${color ? '+color:' + color : ''}`;
    // Can also test queries using the normal Scryfall API: https://scryfall.com/search?q=layout%3Atoken+name%3Agiant+color%3Ar&unique=cards&as=grid&order=name

    console.log(`scryfallQuery is: ${scryfallQuery}`)
    const response = await axios.get(scryfallQuery);

    const cardWithExactNameMatch = response.data?.data.find(card => card.name === cardName);
    console.log(`cardWithExactNameMatch: ${cardWithExactNameMatch}`);
    return cardWithExactNameMatch;
    // handle some load state, etc
  } catch (error) {
    // handle some load state, etc
    console.error(error); // Log the error or handle it as needed
    return null; // Return null or handle it appropriately
  }
}

const Threat = (props) => {

  // Many TODOs, I'm just getting a few things scaffolded for now.
  // 1. I'll start with a simple set of HARD CODED threats, and a few HARD CODED spells.

  const attacksWith = props.attacksWith;
  const usesSpells = props.usesSpells;
  const yieldsReward = props.rewards;
  const populateModal = props.populateModal;

  const [damageToDealToThreat, setDamageToDealToThreat] = useState(0);
  const [threatLifeTotal, setThreatLifeTotal] = useState(props.lifeTotal);
  const [isThreatAlive, setIsThreatAlive] = useState(true);

  const randomSpell = async () => {
    // TODO:
    // Once these are fetched for the first time, we should store the image in the object.
    // Subsequently it will be obtained locally.
    // This will save on API hits...
    const randomSpell = usesSpells[_.random(0, usesSpells.length - 1)];
    const cardApiData = await fetchCard(randomSpell.name);
    populateModal(cardApiData, `${props.name} casts ${randomSpell.name}${randomSpell.targetsPlayer ? ' on you' : ''}!`)
  };
  
  const randomAttack = async () => {
    const whichCreatureType = attacksWith[_.random(0, attacksWith.length - 1)];
    const howMany = _.random(whichCreatureType.quantityRange[0], whichCreatureType.quantityRange[1]);
    const cardApiData = await fetchCard(whichCreatureType.name, true, 'red');
    populateModal(cardApiData, `${props.name} attacks you with ${howMany} ${whichCreatureType.name}${howMany > 1 ? 's' : ''}!`);
  };

  const dealDamangeToThreat = () => {
    const newLifeTotal = Math.max(0, threatLifeTotal - damageToDealToThreat);
    setThreatLifeTotal(newLifeTotal);
    setDamageToDealToThreat(0); // Reset the input

    if(newLifeTotal === 0) {
      threatIsDefeated();
    }

  }

  const threatIsDefeated = async () => {

    setIsThreatAlive(false);

    if(props.isBoss) {
      alert(`Hurrah, hurrah forever! ${props.name} has been defeated! Your team has vanquished this terrible foe. Now, only the fates know how long it will be until a new leader arises to take their place...`);
    } else {
      const whichRewardType = yieldsReward[_.random(0, yieldsReward.length - 1)];
      const cardApiData = await fetchCard(whichRewardType.name, true);
      const howMany = [_.random(whichRewardType.quantityRange[0], whichRewardType.quantityRange[1])];
      populateModal(cardApiData, `${props.name} has been defeated! You gain ${howMany} ${whichRewardType.name} Token${howMany > 1 ? 's' : ''}.`)
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
