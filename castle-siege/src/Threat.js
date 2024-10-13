import './css/App.scss';
import _ from 'underscore';
import React, { useCallback, useEffect, useState } from 'react';
import { listOfCommanderNames, queryScryfall } from './helper-methods';

const Threat = (props) => {

  // Damage / life total
  const [damageToDealToThreat, setDamageToDealToThreat] = useState(0);
  const [threatLifeTotal, setThreatLifeTotal] = useState(props.lifeTotal);
  const [isThreatAlive, setIsThreatAlive] = useState(true);

  // Used for tracking misc notes: Monarch status, poison counters, etc.
  const [notesOnThreat, setNotesOnThreat] = useState('');

  // Turn-specific display elements
  const [currentCardToDisplay, setCurrentCardToDisplay] = useState(null);
  const [currentTurnButtonText, setCurrentTurnButtonText] = useState('');
  const [cardAreaText, setCardAreaText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // When true, the current turn actions will be shown.
  const [isTurnUnderway, setIsTurnUnderway] = useState(false);

  // Passed props
  const turnOrder = props.turnOrder;
  const attacksWith = props.attacksWith;
  const usesSpells = props.usesSpells;
  const yieldsReward = props.rewards;
  const threatName = props.name;
  const generateGameSummary = props.generateGameSummary;
  const setModalText = props.setModalText;
  // Props for showing commander names. Ties into log system and AI-generated game summary.
  const commandersArray = props.commandersArray;
  const setCommandersArray = props.setCommandersArray;
  const addToGameLog = props.addToGameLog;
  const setDisplayEnemyBase = props.setDisplayEnemyBase;

  // Handle checkboxes for which commanders are attacking. I'll want to update this so it can be reset as well.
  const updateAttackingCommanders = (commanderIndex) => {
    // Create a new array with updated isAttacking value
    const updatedCommanders = commandersArray.map((commander, i) =>
      i === commanderIndex ? { ...commander, isAttacking: !commander.isAttacking } : commander
    );

    // Update state
    setCommandersArray(updatedCommanders)
  };

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

    // If the turn has ended, clear out this data so it will not display momentarily when a new turn begins.
    if(!hasAdditionalStepsInTurn) {
      // console.log('clearing out....')
      setCurrentCardToDisplay(null);
      setCardAreaText('');
    }
  };

  // This reacts to `currentActionIndex`, determining the rendering of the turn order.
  useEffect(() => {
    // console.log(`in the useEffect; currentActionIndex is ${currentActionIndex}`)
    // wip: set a 1-second timeout to allow for css transitions
    if(currentActionIndex > -1) {
      if(turnOrder.length) {
          // const timeoutId = setTimeout(() => {
          setIsLoading(true); // wip; need to be careful with getting and setting this. Don't want it to get stuck
          setTimeout(() => {
            switch(turnOrder[currentActionIndex]) {
              case 'castSpell':
                // console.log(`should be casting a spell`)
                // await randomSpell();
                randomSpell();
                break;

              case 'attack':
                // console.log(`should be performing an attack`)
                // await randomAttack();
                randomAttack();
                break;
            }
          }, 1000);
        }
        const hasAdditionalStepsInTurn = turnOrder.length > currentActionIndex + 1;
        setCurrentTurnButtonText(hasAdditionalStepsInTurn ? 'Next' : 'End Turn');
      }

    setIsTurnUnderway(currentActionIndex > -1); // just a computed handy variable

    // Cleanup function to clear the timeout if the component unmounts
    // return () => clearTimeout(timeoutId);

  }, [currentActionIndex]);

  const randomSpell = useCallback(async () => {
    // TODO:
    // Once these are fetched for the first time, we should store the image in the object.
    // Subsequently it will be obtained locally.
    // This will save on API hits...
    const randomSpell = usesSpells[_.random(0, usesSpells.length - 1)];
    const cardApiData = await queryScryfall(randomSpell.name);
    setIsLoading(false);
    const thisText = `${threatName} casts ${randomSpell.name}${randomSpell.targetsPlayer ? ' on you' : ''}!`;
    addToGameLog(thisText);
    setCurrentCardToDisplay(cardApiData);
    setCardAreaText(thisText);
  });

  // const randomAttack = async () => {
  const randomAttack = useCallback(async () => {
    const whichCreatureType = attacksWith[_.random(0, attacksWith.length - 1)];
    const howMany = _.random(whichCreatureType.quantityRange[0], whichCreatureType.quantityRange[1]);
    const cardApiData = await queryScryfall(whichCreatureType.name, whichCreatureType.isToken, whichCreatureType.queryParameters);
    setIsLoading(false);
    const thisText = `${threatName} attacks with ${howMany} ${whichCreatureType.name}${howMany > 1 ? 's' : ''}!`;
    addToGameLog(thisText);
    setCurrentCardToDisplay(cardApiData);
    setCardAreaText(thisText);
  });

  const dealDamageToThreat = () => {
    const newLifeTotal = Math.max(0, threatLifeTotal - damageToDealToThreat);
    setThreatLifeTotal(newLifeTotal);
    if(newLifeTotal === 0) {
      threatIsDefeated();
    }
    addToGameLog(`${listOfCommanderNames(commandersArray, true)} deals ${damageToDealToThreat} damage to ${threatName}${newLifeTotal === 0 ? ', defeating it!' : '.'}`);

    setDamageToDealToThreat(0); // Reset the input
  };

  const threatIsDefeated = async () => {

    setIsThreatAlive(false);

    if(props.isBoss) {

      // Quick loading state. Will implement better state management in the future: https://github.com/MikeCaputo/kingston-ny-mtg/issues/9
      populateModal(
        null,
        `${threatName} has been defeated! Loading game summary...`,
        {text: 'A Well-Earned Victory', function: setIsModalOpen(false)}
      );

      const aiGeneratedSummary = await generateGameSummary();

      setModalText(`${threatName} has been defeated! Your game summary is:\n\n${aiGeneratedSummary}`);

    } else {
      const whichRewardType = yieldsReward[_.random(0, yieldsReward.length - 1)];
      const cardApiData = await queryScryfall(whichRewardType.name, true);
      setIsLoading(false);
      const howMany = [_.random(whichRewardType.quantityRange[0], whichRewardType.quantityRange[1])];
      populateModal(
        cardApiData,
        `${threatName} has been defeated! Each player at this base gains ${howMany} ${whichRewardType.name} Token${howMany > 1 ? 's' : ''}.`,
        {text: 'Close', function: setIsModalOpen(false)}
      );
    }

  }

  const fadeInCardBack = () => {
  }

  return (
    <section
      className={`Threat ${isThreatAlive ? '' : 'defeated'} ${isTurnUnderway? 'turn-underway' : ''}`}
      style={props.style}
    >

      <h3>{threatName}</h3>

      {/* Need a more elegant way to render a zero. It's falsey. But `.toString() mutates the data, which I don't want.... this is okay for now */}
      <h4>Life total: {threatLifeTotal > 0 ? threatLifeTotal : "0"}</h4>

      {isThreatAlive &&
        <>
          <label>
            <span>Deal damage to this Enemy Base:</span>
            <input
              type="number"
              value={damageToDealToThreat}
              onChange={e => setDamageToDealToThreat(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </label>
          <p>Who is dealing damage?</p>
          {commandersArray.map((commander, i) => {
            return (
              <label key={`${commander.scryfallCardData.name}`}>
                <input
                  type="checkbox"
                  value={commander.isAttacking}
                  onChange={() => updateAttackingCommanders(i)}
                />
                <span>{commander.scryfallCardData.name}</span>
              </label>
            )
          })}
          <button onClick={dealDamageToThreat}>Deal damage to this Enemy Base</button>

          <label>
            <span>Notes:</span>
            <input
              type="text"
              value={notesOnThreat}
              onChange={e => setNotesOnThreat(e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </label>

          {isTurnUnderway &&
            <>
              {cardAreaText &&
                <p>{cardAreaText}</p>
              }
              {currentCardToDisplay &&
                <>
                  <img
                    src={currentCardToDisplay?.image_uris?.border_crop}
                    alt={currentCardToDisplay.name}
                    title={currentCardToDisplay.name}
                    className='card-display'
                  />
                  <button onClick={rotateThroughTurn} disabled={isLoading}>
                    {isLoading ? 'Loading...' : currentTurnButtonText}
                  </button>
                </>
              }
            </>
          }
          {!isTurnUnderway &&
            <button onClick={rotateThroughTurn}>
              {'Begin Turn'}
            </button>
          }

          {/* WIP*/}
          {/* <button onClick={fadeInCardBack}>
            dev wip: Fade in card back
          </button> */}
        </>
      }

      <button onClick={() => setDisplayEnemyBase(false)}><em>Close Enemy Base</em></button>

    </section>
  );
}

export default Threat;
