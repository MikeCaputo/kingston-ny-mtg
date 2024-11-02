import './css/App.scss';
import _ from 'underscore';
import React, { useCallback, useEffect, useState } from 'react';
import { listOfCommanderNames, queryScryfall } from './helper-methods';
import CommandersAtThisLocation from './CommandersAtThisLocation';

const EnemyBase = (props) => {

  // Damage / life total
  const [damageToDealToEnemyBase, setDamageToDealToEnemyBase] = useState(0);
  const [enemyBaseLifeTotal, setEnemyBaseLifeTotal] = useState(props.enemyBaseAtThisHex.lifeTotal);
  const [isEnemyBaseAlive, setIsEnemyBaseAlive] = useState(true);

  // Used for tracking misc notes: Monarch status, poison counters, etc.
  const [notesOnEnemyBase, setNotesOnEnemyBase] = useState('');

  // Turn-specific display elements
  const [currentCardToDisplay, setCurrentCardToDisplay] = useState(null);
  const [currentTurnButtonText, setCurrentTurnButtonText] = useState('');
  const [cardAreaText, setCardAreaText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // When true, the current turn actions will be shown.
  const [isTurnUnderway, setIsTurnUnderway] = useState(false);

  // Passed props
  const enemyBaseName = props.enemyBaseAtThisHex.name;
  const isBoss = props.enemyBaseAtThisHex.isBoss;
  const turnOrder = props.enemyBaseAtThisHex.turnOrder;
  const attacksWith = props.enemyBaseAtThisHex.attacksWith;
  const usesSpells = props.enemyBaseAtThisHex.usesSpells;
  const yieldsReward = props.enemyBaseAtThisHex.rewards;

  const generateGameSummary = props.generateGameSummary;
  const setModalText = props.setModalText;
  // Props for showing commander names. Ties into log system and AI-generated game summary.
  const commandersArray = props.commandersArray;
  const addToGameLog = props.addToGameLog;
  const setDisplayEnemyBase = props.setDisplayEnemyBase;

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

  // Only enable button functionalities if there are living commanders at the enemy base location.
  const [areThereLivingCommandersAtThisBase, setAreThereLivingCommandersAtThisBase] = useState(false);
  useEffect(() => {
    const howManyLivingCommandersHere = commandersArray.filter((commander) =>
      !commander.isDefeated &&
      commander.hexLocation &&
      commander.hexLocation[0] === props.hexCol &&
      commander.hexLocation[1] === props.hexRow
    ).length;
    setAreThereLivingCommandersAtThisBase(howManyLivingCommandersHere > 0);
  }, [commandersArray]);

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
                randomSpell();
                break;

              case 'attack':
                // console.log(`should be performing an attack`)
                randomAttack();
                break;

              default:
                console.error('Error: turn is not configured correctly. Did not find a matching case for ', turnOrder[currentActionIndex]);
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
    const thisText = `${enemyBaseName} casts ${randomSpell.name}${randomSpell.targetsPlayer ? ' on you' : ''}!`;
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
    const thisText = `${enemyBaseName} attacks with ${howMany} ${whichCreatureType.name}${howMany > 1 ? 's' : ''}!`;
    addToGameLog(thisText);
    setCurrentCardToDisplay(cardApiData);
    setCardAreaText(thisText);
  });

  const dealDamageToEnemyBase = () => {
    const newLifeTotal = Math.max(0, enemyBaseLifeTotal - damageToDealToEnemyBase);
    setEnemyBaseLifeTotal(newLifeTotal);
    if(newLifeTotal === 0) {
      enemyBaseIsDefeated();
    }

    addToGameLog(`${listOfCommanderNames(commandersArray, false, true, [props.hexCol, props.hexRow])} deals ${damageToDealToEnemyBase} damage to ${enemyBaseName}${newLifeTotal === 0 ? ', defeating it!' : '.'}`);

    setDamageToDealToEnemyBase(0); // Reset the input
  };

  const enemyBaseIsDefeated = async () => {

    setIsEnemyBaseAlive(false);

    if(isBoss) {

      // Quick loading state. Will implement better state management in the future: https://github.com/MikeCaputo/kingston-ny-mtg/issues/9
      populateModal(
        null,
        `${enemyBaseName} has been defeated! Loading game summary...`,
        {text: 'A Well-Earned Victory', function: setIsModalOpen(false)}
      );

      const aiGeneratedSummary = await generateGameSummary();

      setModalText(`${enemyBaseName} has been defeated! Your game summary is:\n\n${aiGeneratedSummary}`);

    } else {
      const whichRewardType = yieldsReward[_.random(0, yieldsReward.length - 1)];
      const cardApiData = await queryScryfall(whichRewardType.name, true);
      setIsLoading(false);
      const howMany = [_.random(whichRewardType.quantityRange[0], whichRewardType.quantityRange[1])];
      populateModal(
        cardApiData,
        `${enemyBaseName} has been defeated! Each player at this base gains ${howMany} ${whichRewardType.name} Token${howMany > 1 ? 's' : ''}.`,
        {text: 'Close', function: setIsModalOpen(false)}
      );
    }

  }

  const fadeInCardBack = () => {
  }

  return (
    <section
      className={`EnemyBase ${isEnemyBaseAlive ? '' : 'defeated'} ${isTurnUnderway? 'turn-underway' : ''}`}
      style={props.style}
    >

      <button className="close-enemy-base" onClick={() => setDisplayEnemyBase(false)}>X</button>

      <CommandersAtThisLocation
        commandersArray={commandersArray}
        hexCol={props.hexCol}
        hexRow={props.hexRow}
        isEnemyBaseAlive={isEnemyBaseAlive}
      />

      <hr />

      <h3>{enemyBaseName}</h3>

      {/* Need a more elegant way to render a zero. It's falsey. But `.toString() mutates the data, which I don't want.... this is okay for now */}
      <h4>Life total: {enemyBaseLifeTotal > 0 ? enemyBaseLifeTotal : "0"}</h4>

      {isEnemyBaseAlive &&
        <>
          <label>
            <span>Deal damage to this Enemy Base:</span>
            <input
              type="number"
              value={damageToDealToEnemyBase}
              onChange={e => setDamageToDealToEnemyBase(e.target.value)}
              onFocus={(e) => e.target.select()}
              disabled={!areThereLivingCommandersAtThisBase}
            />
          </label>
          <button onClick={dealDamageToEnemyBase} disabled={!areThereLivingCommandersAtThisBase}>
            Deal damage to this Enemy Base
          </button>

          <label>
            <span>Notes:</span>
            <input
              type="text"
              value={notesOnEnemyBase}
              onChange={e => setNotesOnEnemyBase(e.target.value)}
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
            <button onClick={rotateThroughTurn} disabled={!areThereLivingCommandersAtThisBase}>
              {'Begin Turn'}
            </button>
          }

          {/* WIP*/}
          {/* <button onClick={fadeInCardBack}>
            dev wip: Fade in card back
          </button> */}
        </>
      }

    </section>
  );
}

export default EnemyBase;
