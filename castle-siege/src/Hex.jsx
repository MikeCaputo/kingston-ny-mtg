import { useState } from 'react';
import Threat from './Threat.js';

const Hex = ({ x, y, col, row, size, id, enemyBaseAtThisHex, populateModal, closeModal, setIsModalOpen, setModalText, commandersArray, setCommandersArray, addToGameLog, generateGameSummary, openai }) => {
  const hexWidth = size * 2;
  const hexHeight = Math.sqrt(3) * size;

  const [isHovered, setIsHovered] = useState(false); // Track hover state
  const [displayEnemyBase, setDisplayEnemyBase] = useState(false); // Track enemy base display.

  // const enemyBaseAtThisHex = props.enemyBaseAtThisHex;

  const points = [
    [size * Math.cos(0), size * Math.sin(0)],
    [size * Math.cos(Math.PI / 3), size * Math.sin(Math.PI / 3)],
    [size * Math.cos(2 * Math.PI / 3), size * Math.sin(2 * Math.PI / 3)],
    [size * Math.cos(Math.PI), size * Math.sin(Math.PI)],
    [size * Math.cos(4 * Math.PI / 3), size * Math.sin(4 * Math.PI / 3)],
    [size * Math.cos(5 * Math.PI / 3), size * Math.sin(5 * Math.PI / 3)],
  ].map(([px, py]) => `${px + hexWidth / 2},${py + hexHeight / 2}`).join(" ");

  // Event handlers to track hover state
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // todo: maybe don't even initialize an onClick if there is no base here?
  const onClick = () => {
    // setIsHovered(false);
    console.log('clicked a hex! row is: ', row, ' and col is: ', col)
    console.log('does it have an enemyBase? ', enemyBaseAtThisHex)
    if(enemyBaseAtThisHex) {
      setDisplayEnemyBase(!displayEnemyBase);
    }
  };

  const baseFillColor = enemyBaseAtThisHex ? "rgba(0, 50, 150, .3)" : "none";
  const baseHoverColor = enemyBaseAtThisHex ? "rgba(0, 50, 200, .8)" : "none";

  return (
    <>
      <svg
        onClick={() => onClick()}
        width={hexWidth}
        height={hexHeight}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "absolute",
          left: x,
          top: y,
          cursor: enemyBaseAtThisHex ? "pointer" : "default",
        }}
      >
        <polygon
          points={points}
          // fill={isHovered ? "#f1c40f" : "none"} // Change fill on hover
          // fill="none"
          // fill="rgba(0, 50, 200, .5)"
          fill={isHovered ? baseHoverColor : baseFillColor} // Change fill on hover
          stroke={isHovered ? "#f1c40f" : "#2980b9"} // Change stroke on hover
          strokeWidth={2}
      />
      </svg>
      <displayEnemyBase && Threat
        style={
          {
            backgroundImage: `linear-gradient(white, white), linear-gradient(45deg, ${generateBorderColors(enemyBase)})`
          }
        }
        name={`${enemyBaseAtThisHex.name}`}
        key={`${enemyBaseAtThisHex.name}-${id}`} // Ensure unique keys for each instance (okay to give it the id of the hexGrid?)
        isBoss={enemyBaseAtThisHex.isBoss}
        lifeTotal={enemyBaseAtThisHex.lifeTotal}
        populateModal={populateModal}
        closeModal={closeModal}
        setIsModalOpen={setIsModalOpen}
        setModalText={setModalText}
        turnOrder={enemyBaseAtThisHex.turnOrder}
        attacksWith={enemyBaseAtThisHex.attacksWith}
        usesSpells={enemyBaseAtThisHex.usesSpells}
        rewards={enemyBaseAtThisHex.rewards}
        commandersArray={commandersArray}
        setCommandersArray={setCommandersArray}
        addToGameLog={addToGameLog}
        generateGameSummary={generateGameSummary}
        openai={openai}
      />
    </>
  );
};

export default Hex;
