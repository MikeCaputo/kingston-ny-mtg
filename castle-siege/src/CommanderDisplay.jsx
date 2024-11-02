import './css/App.scss';
import React, { useState } from 'react';

const CommanderDisplay = (props) => {

  // Passed props
  const commander = props.commander;
  const canChangeLifeTotal = props.canChangeLifeTotal;
  // console.log('commander in CommanderDisplay: ', commander)

  return (
    <section className="commander-display">

      <img
        src={commander.scryfallCardData.image_uris?.small}
        alt={commander.scryfallCardData.name}
        title={commander.scryfallCardData.name}
      />

      <label>
        Life Total
        <input
          type="number"
          value={commander.lifeTotal}
          onChange={e => commander.selfUpdate({...commander, lifeTotal: Math.max(e.target.value, 0)})}
          disabled={!canChangeLifeTotal}
        />
      </label>

    </section>
  );
}

export default CommanderDisplay;
