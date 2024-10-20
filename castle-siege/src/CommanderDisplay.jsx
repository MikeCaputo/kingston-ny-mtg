import './css/App.scss';
import React, { useState } from 'react';

const CommanderDisplay = (props) => {

  // Passed props
  const commander = props.commander;
  // console.log('commander in CommanderDisplay: ', commander)

  return (
    <section className="commander-display">

      <img
        src={commander.scryfallCardData.image_uris?.small}
        alt={commander.scryfallCardData.name}
        title={commander.scryfallCardData.name}
      />
      <p>Life total: {commander.lifeTotal}</p>

    </section>
  );
}

export default CommanderDisplay;
