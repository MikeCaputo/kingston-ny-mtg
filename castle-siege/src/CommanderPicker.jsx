import './css/App.scss';
import React, { useState } from 'react';
import { queryScryfall } from './helper-methods';

const CommanderPicker = (props) => {

  const [commanderPickerArray, setCommanderPickerArray] = useState([]);
  const [cardSearchInput, setCardSearchInput] = useState('');
  
  // Passed props
  const setCommanderFunction = props.setCommanderFunction;
  const playerNumber = props.playerNumber;
  
  // This populates a card picker, allowing the player to select their exact commander.
  // So, typing "Aragorn" will generate a list of all cards with "Aragorn" in it.
  // Then the player will click on their commander, and we store the entire Scryfall card details.
  // This will be used partially for AI generation.
  // I'll just go deluxe and make a type-ahead, why not just go big.
  const populateCardPicker = async (commanderName) => {
    if(commanderName) {
      const scryfallCardList = await queryScryfall(commanderName, false, {}, false);
      console.log('in the populateCardPicker function; scryfallCardList: ', scryfallCardList);
      // Strangely, if Scryfall yields no results, it throws a 404, and scryfallCardList is null. I would have expected a 200 but an empty response. So, we only try to set the card picker if we get any results.
      if(scryfallCardList) {
        setCommanderPickerArray(scryfallCardList);
      }
    }
  }

  const chooseCommander = (selectedCard) => {

    setCommanderFunction(({
      hexLocation: null,
      lifeTotal: 40,
      playerNumber: playerNumber,
      scryfallCardData: selectedCard, // Set the card in the collection (from App.jsx)
      selfUpdate: setCommanderFunction
    }))
  }

  return (
    <section>

      <input
        type="text"
        value={cardSearchInput}
        onChange={e => setCardSearchInput(e.target.value)}
        onBlur={e => populateCardPicker(e.target.value)}
        className={'commander-selection-input'}
      />
      <div className="commander-validation">
        {
          commanderPickerArray.map((selectableCard, validatorIndex) => (
            <img
              key={validatorIndex}
              alt={selectableCard?.name}
              title={selectableCard?.name}
              src={selectableCard?.image_uris?.small}
              onClick={e => chooseCommander(selectableCard)}
              className="commander-selection-image"
            />
          ))
        }
      </div>

    </section>
  );
}

export default CommanderPicker;
