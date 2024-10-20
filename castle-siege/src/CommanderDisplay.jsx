import './css/App.scss';
import React, { useState } from 'react';

const CommanderDisplay = (props) => {

  // const [commanderPickerArray, setCommanderPickerArray] = useState([]);
  // const [cardSearchInput, setCardSearchInput] = useState('');

  // Passed props
  const commander = props.commander;
  console.log('commander in CommanderDisplay: ', commander)
  // const playerNumber = props.playerNumber;

  return (
    <section className="commander-display">

      <img
        src={commander.scryfallCardData.image_uris?.small}
        alt={commander.scryfallCardData.name}
        title={commander.scryfallCardData.name}
      />
      <p>Life total: {commander.lifeTotal}</p>
      <p>Player number: {commander.playerNumber}</p>
      <p>Location: (todo)</p>

    </section>
  );
}

export default CommanderDisplay;
