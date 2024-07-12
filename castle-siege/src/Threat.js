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

  const [damageToDealToThreat, setDamageToDealToThreat] = useState(0);
  const [threatLifeTotal, setThreatLifeTotal] = useState(props.lifeTotal);
  const [isThreatAlive, setIsThreatAlive] = useState(true);
  
  const [hasCompletedTurn, setHasCompletedTurn] = useState(true);
  const [actionsForThisTurn, setActionsForThisTurn] = useState(props.turnOrder); // July 9, 8:30pm. I think I want to deprecate this: I should just use a simple INTEGER that is a counter; 0, 1, 2... and when it reaches the length of the turnOrder, then the modal should be closed and it should go back to zero. Something like that... I'm jumping around on this...
  
  const [currentCardToDisplay, setCurrentCardToDisplay] = useState();
  const [currentTurnButtonText, setCurrentTurnButtonText] = useState(''); // wip...
  const [currentTurnButtonAction, setCurrentTurnButtonAction] = useState(null); // wip... TODO: I don't think this is needed. I think it should always called `commenceAttack`...
  const [cardAreaText, setCardAreaText] = useState('');

  // going to use these to control the modal. Jul 10
  const [isTurnUnderway, setIsTurnUnderway] = useState(false);
  const [isViewingReward, setIsViewingReward] = useState(false);
  
  const turnOrder = props.turnOrder; // this will NOT be mutated. Once the current actions are completed, we will set them back to this.

  const attacksWith = props.attacksWith;
  const usesSpells = props.usesSpells;
  const yieldsReward = props.rewards;

  // Modal controls:
  const closeModal = props.closeModal;
  const populateModal = props.populateModal;
  const setIsModalOpen = props.setIsModalOpen;

  // const commenceTurn = async () => { // todo: this might ALWAYS be called. 
  // // does it need to be async? Because it calls another async method...

  //   console.log(`actionsForThisTurn: ${actionsForThisTurn}`)
  //   setIsTurnUnderway(true);
    
  //   // WIP: this will take the turn, in order.
  //   // Working on parameterizing it: can attack or cast a spell, in any order. Can cast multiple spells, and I suppose can perform multiple attacks as well. (This could enable a "Relentless assault" type Threat); or a spell-slinger threat that casts multiple spells, no attacks.
    
  //   // Seems kinda wonky, I bet there's a more elegant way.
  //   // if(!currentTurnButtonAction) {
  //   //   assignCurrentAction();
  //   // }

  //   console.log(`currentTurnButtonAction is: ${currentTurnButtonAction}`)
    
  //   // crude ceck here.... I am being so ignorant with this.
  //   if(currentTurnButtonAction) {
  //     await currentTurnButtonAction();
  //   }
  //   setActionsForThisTurn(actionsForThisTurn.slice(1)); // feeling possibly suspicious of this today. I need to consider where should the source of truth lie for all of this? The Threat, or the Modal? I would think the Threat... so I'll have to get that sorted out once the prototype is running...
  //   setCurrentActionIndex(currentActionIndex++);
    
    
  //   // if(actionsForThisTurn.length) {
  //   //   switch(actionsForThisTurn[0]) {
  //   //     case 'castSpell':
  //   //       console.log(`should be casting a spell`)
  //   //       await randomSpell();
  //   //       setActionsForThisTurn(actionsForThisTurn.slice(1)); // feeling possibly suspicious of this today. I need to consider where should the source of truth lie for all of this? The Threat, or the Modal? I would think the Threat... so I'll have to get that sorted out once the prototype is running...
  //   //       break;

  //   //     case 'attack':
  //   //       console.log(`should be performing an attack`)
  //   //       await randomAttack();
  //   //       setActionsForThisTurn(actionsForThisTurn.slice(1));
  //   //     break;
  //   //   }
  //   // }

  //   // This hasn't updated yet, that's why. Let me confirm...
  //   // console.log(`actionsForThisTurn.length: ${actionsForThisTurn.length}`)
  //   // setHasCompletedTurn(actionsForThisTurn.length === 0); // todo: should make this a computed function; do not manually assign it like this.

  //   // Once finished, set `setHasCompletedTurn(true)`. This will control modal button states.

  // };

  // const concludeTurn = () => {
  //   setIsTurnUnderway(false);
  // };

  // const concludeReward = () => {
  //   setIsViewingReward(false);
  // };


  // useEffect(() => {
  //   if(currentActionIndex === turnOrder.length) {
  //     setCurrentActionIndex(0); // would this cause an infinite number of renders? ***********
  //   }
  // }, [currentActionIndex]);

  // wip: controlling modal in a more React-like way
  // useEffect(() => {
  //   setIsModalOpen(isTurnUnderway || isViewingReward);
  // }, [isTurnUnderway, isViewingReward]);

  // const assignCurrentAction = () => {
  //   if(actionsForThisTurn.length === 0) {
  //     setCurrentTurnButtonText('Finish');
  //     // setCurrentTurnButtonAction(() => closeModal);
  //     setCurrentTurnButtonAction(() => concludeTurn);
  //     // setCurrentTurnButtonAction(() => closeCurrentTurnArea);
  //     // console.log(`the button action should be: ${closeCurrentTurnArea}`)
  //   } else if(actionsForThisTurn[0] == 'castSpell') {
  //     setCurrentTurnButtonText('Next');
  //     setCurrentTurnButtonAction(() => randomSpell);
  //   } else if(actionsForThisTurn[0] == 'attack') {
  //     setCurrentTurnButtonText('Next');
  //     setCurrentTurnButtonAction(() => randomAttack);
  //   }

  //   setHasCompletedTurn(actionsForThisTurn.length === 0);
    
  // };

  // useEffect(() => {
  //   assignCurrentAction();
  // }, [actionsForThisTurn]);





  // This is a pattern tha can resolve the asynchronous, "update isn't reflected yet" nature of React bundling updates.
  // useEffect(() => {
  //   // I think this is just to kick the application into updating immediately.
  //   if (currentTurnButtonText) {
  //     console.log('Button text updated:', currentTurnButtonText);
  //     // Perform any actions based on the updated state here
  //   }
  // }, [currentTurnButtonText]);

  // const updateButtonText = () => {
  //   setCurrentTurnButtonText('Next');
  //   // currentTurnButtonText will still be the old value here
  // };




  // ==============================================
  // July 10:
  // Okay, I have a little baseline here. This is what I needed to do the first time around, no craziness. Just build out from here, slowly and incrementally.
  const [currentActionIndex, setCurrentActionIndex] = useState(0); // july 10
  const rotateThroughTurn = () => {
    console.log(`currentActionIndex: ${currentActionIndex}`)
    console.log(`current turn is: ${turnOrder[currentActionIndex]}`)
    console.log(`modal text should reflect: ${turnOrder[currentActionIndex]}`)
    console.log(`turnOrder.length: ${turnOrder.length}`)
    console.log(`currentActionIndex + 1: ${currentActionIndex + 1}`)
    console.log(`turnOrder.length > currentActionIndex + 1: ${turnOrder.length > currentActionIndex + 1}`)

    // Need to add one to account for the length
    const hasAdditionalStepsInTurn = turnOrder.length > currentActionIndex + 1;
    setCurrentTurnButtonText(hasAdditionalStepsInTurn ? 'Next' : 'Finish');
    // updateButtonText(hasAdditionalStepsInTurn ? 'Next' : 'Finish');
    setCurrentActionIndex(hasAdditionalStepsInTurn ? currentActionIndex + 1 : 0);
    // console.log(`And the button text should read: ${turnOrder.length > currentActionIndex + 1 ? 'Next' : 'Finish'}`);
    // if(turnOrder.length > currentActionIndex + 1) {
    //   setCurrentActionIndex(currentActionIndex + 1);
    // } else {
    //   setCurrentActionIndex(0);
    // }
  };
  // ==============================================


  // const randomSpell = async () => {
  const randomSpell = useCallback(async () => {

    rotateThroughTurn(); // wip, should this be called imperatively?

    // TODO:
    // Once these are fetched for the first time, we should store the image in the object.
    // Subsequently it will be obtained locally.
    // This will save on API hits...
    const randomSpell = usesSpells[_.random(0, usesSpells.length - 1)];
    const cardApiData = await fetchCard(randomSpell.name);
    const thisText = `${props.name} casts ${randomSpell.name}${randomSpell.targetsPlayer ? ' on you' : ''}!`;
    setCurrentCardToDisplay(cardApiData);
    setCardAreaText(thisText);
    // New idea, July 9th: maybe this all should NOT bubble up to the parent commponent modal. What purpose does that serve...? Maybe each Threat should handle displaying its own attacks and such??

    // console.log(`random spell... inspecting params: ${{'text': currentTurnButtonText, 'function': commenceTurn}}`)


    // populateModal(
    //   cardApiData,
    //   thisText,
    //   // {'text': currentTurnButtonText, 'function': commenceTurn}
    //   {'text': currentTurnButtonText, 'function': closeModal}
    // )
  // }, [usesSpells, props.name]);
  });
  
  // const randomAttack = async () => {
  const randomAttack = useCallback(async () => {

    rotateThroughTurn(); // wip, should this be called imperatively?

    const whichCreatureType = attacksWith[_.random(0, attacksWith.length - 1)];
    const howMany = _.random(whichCreatureType.quantityRange[0], whichCreatureType.quantityRange[1]);
    const cardApiData = await fetchCard(whichCreatureType.name, true, 'red');
    const thisText = `${props.name} attacks you with ${howMany} ${whichCreatureType.name}${howMany > 1 ? 's' : ''}!`;
    setCurrentCardToDisplay(cardApiData);
    setCardAreaText(thisText);
    

    // populateModal(
    //   cardApiData,
    //   thisText,
    //   // {text: currentTurnButtonText, function: currentTurnButtonAction}
    //   // {'text': currentTurnButtonText, 'function': commenceTurn}
    //   // {'text': currentTurnButtonText, 'function': closeModal}
    //   {text: currentTurnButtonText, function: closeModal}
    // )
  });
  // }, [attacksWith, props.name]);

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
      setIsViewingReward(true);
      populateModal(
        cardApiData,
        `${props.name} has been defeated! You gain ${howMany} ${whichRewardType.name} Token${howMany > 1 ? 's' : ''}.`,
        {text: 'Close', function: closeModal}
        // {text: 'Close', function: concludeReward}
      );
    }

  }

  return (
    <div className={`Threat ${isThreatAlive ? '' : 'defeated'}`}>

      <h3>{props.name}</h3>

      {isThreatAlive &&
        <>
          {/* <button onClick={commenceTurn} disabled={!hasCompletedTurn}>Commence {props.name}'s turn</button> */}
          {/* <button onClick={commenceTurn}>Commence {props.name}'s turn</button> */}
          <button onClick={randomSpell}>Cast from among the pre-set spells (to deprecate)</button>
          <button onClick={randomAttack}>Have the enemy perform an attack (to deprecate)</button>
          <button onClick={rotateThroughTurn}>Rotate through the turn (just console for now)</button>
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
        
        
          {cardAreaText &&
            <p>{cardAreaText}</p>
          }
          {currentCardToDisplay &&
            <>
              <img src={currentCardToDisplay?.image_uris?.border_crop} alt={currentCardToDisplay.name} title={currentCardToDisplay.name} />
              {/* <button className="close-button" onClick={currentTurnButtonAction}> */}
              {/* <button className="close-button" onClick={runCurrentTurnButtonAction}> */}
              <button className="close-button" onClick={() => console.log('pressed button.')}>
                {currentTurnButtonText}
              </button>
            </>
          }
        
        
        
        </>
      }

    </div>
  );
}

export default Threat;
