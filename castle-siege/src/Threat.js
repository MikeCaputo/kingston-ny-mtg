import './App.css';
import _, { random } from 'underscore';
// import React, { useState, useEffect } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
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
    // console.log(`cardWithExactNameMatch: ${cardWithExactNameMatch}`);
    return cardWithExactNameMatch;
    // handle some load state, etc
  } catch (error) {
    // handle some load state, etc
    console.error(error); // Log the error or handle it as needed
    return null; // Return null or handle it appropriately
  }
}

const Threat = (props) => {

  // Damage / life total
  const [damageToDealToThreat, setDamageToDealToThreat] = useState(0);
  const [threatLifeTotal, setThreatLifeTotal] = useState(props.lifeTotal);
  const [isThreatAlive, setIsThreatAlive] = useState(true);

  // Turn-specific display elements
  const [currentCardToDisplay, setCurrentCardToDisplay] = useState();
  const [currentTurnButtonText, setCurrentTurnButtonText] = useState('');
  const [cardAreaText, setCardAreaText] = useState('');

  // When true, the current turn actions will be shown.
  const [isTurnUnderway, setIsTurnUnderway] = useState(false);

  // Passed props
  const turnOrder = props.turnOrder;
  const attacksWith = props.attacksWith;
  const usesSpells = props.usesSpells;
  const yieldsReward = props.rewards;

  // Modal controls:
  const populateModal = props.populateModal;
  const setIsModalOpen = props.setIsModalOpen;

  // `currentActionIndex` controls the flow of a turn. The component reacts to its value.
  const [currentActionIndex, setCurrentActionIndex] = useState(-1);
  const rotateThroughTurn = () => {
    // This function rotates the index from 0-n, then -1.
    // 0-n , it runs the current turn
    // -1 means the turn isnt active.

    // Need to add one to account for the length
    const hasAdditionalStepsInTurn = turnOrder.length > currentActionIndex + 1;
    setCurrentActionIndex(hasAdditionalStepsInTurn ? currentActionIndex + 1 : -1);
  };

    useEffect(() => {
      console.log(`in the useEffect; currentActionIndex is ${currentActionIndex}`)
      if(currentActionIndex > -1) {

        if(turnOrder.length) {
          switch(turnOrder[currentActionIndex]) {
            case 'castSpell':
              console.log(`should be casting a spell`)
              // await randomSpell();
              randomSpell();
              break;
  
          case 'attack':
            console.log(`should be performing an attack`)
            // await randomAttack();
            randomAttack();
            break;
        }
      }

      const hasAdditionalStepsInTurn = turnOrder.length > currentActionIndex + 1;
      setCurrentTurnButtonText(hasAdditionalStepsInTurn ? 'Next' : 'End Turn');
    }

    setIsTurnUnderway(currentActionIndex > -1); // just a computed handy variable

  }, [currentActionIndex]);

  // const randomSpell = async () => {
  const randomSpell = useCallback(async () => {
    // TODO:
    // Once these are fetched for the first time, we should store the image in the object.
    // Subsequently it will be obtained locally.
    // This will save on API hits...
    const randomSpell = usesSpells[_.random(0, usesSpells.length - 1)];
    const cardApiData = await fetchCard(randomSpell.name);
    const thisText = `${props.name} casts ${randomSpell.name}${randomSpell.targetsPlayer ? ' on you' : ''}!`;
    setCurrentCardToDisplay(cardApiData);
    setCardAreaText(thisText);
  });

  // const randomAttack = async () => {
  const randomAttack = useCallback(async () => {
    const whichCreatureType = attacksWith[_.random(0, attacksWith.length - 1)];
    const howMany = _.random(whichCreatureType.quantityRange[0], whichCreatureType.quantityRange[1]);
    const cardApiData = await fetchCard(whichCreatureType.name, true, 'red');
    const thisText = `${props.name} attacks you with ${howMany} ${whichCreatureType.name}${howMany > 1 ? 's' : ''}!`;
    setCurrentCardToDisplay(cardApiData);
    setCardAreaText(thisText);
  });

  const dealDamangeToThreat = () => {
    const newLifeTotal = Math.max(0, threatLifeTotal - damageToDealToThreat);
    setThreatLifeTotal(newLifeTotal);
    setDamageToDealToThreat(0); // Reset the input

    if(newLifeTotal === 0) {
      threatIsDefeated();
    }

  };

  const threatIsDefeated = async () => {

    setIsThreatAlive(false);

    if(props.isBoss) {
      alert(`Hurrah, hurrah forever! ${props.name} has been defeated! Your team has vanquished this terrible foe. Now, only the fates know how long it will be until a new leader arises to take their place...`);
    } else {
      const whichRewardType = yieldsReward[_.random(0, yieldsReward.length - 1)];
      const cardApiData = await fetchCard(whichRewardType.name, true);
      const howMany = [_.random(whichRewardType.quantityRange[0], whichRewardType.quantityRange[1])];
      populateModal(
        cardApiData,
        `${props.name} has been defeated! You gain ${howMany} ${whichRewardType.name} Token${howMany > 1 ? 's' : ''}.`,
        {text: 'Close', function: setIsModalOpen(false)}
      );
    }

  }

  return (
    <div className={`Threat ${isThreatAlive ? '' : 'defeated'}`}>

      <h3>{props.name}</h3>

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

          {isTurnUnderway &&
            <>
              {cardAreaText &&
                <p>{cardAreaText}</p>
              }
              {currentCardToDisplay &&
                <>
                <img src={currentCardToDisplay?.image_uris?.border_crop} alt={currentCardToDisplay.name} title={currentCardToDisplay.name} />
                <button className="close-button" onClick={rotateThroughTurn}>
                  {currentTurnButtonText}
                </button>
                </>
              }
            </>
          }
          {!isTurnUnderway &&
            <button className="close-button" onClick={rotateThroughTurn}>
              {'Begin Turn'}
            </button>
          }
        </>
      }

    </div>
  );
}

export default Threat;
