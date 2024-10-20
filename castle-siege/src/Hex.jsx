import { useState } from 'react';
import EnemyBase from './EnemyBase.jsx';
import castleIcon from './images/castle-icon.png';
import pathIcon from './images/path-icon.png';
import { generateBorderColors, listOfCommanderNames } from './helper-methods';

const Hex = ({ x, y, col, row, size, id, enemyBaseAtThisHex, isThereAPathAtThisHex, populateModal, closeModal, setIsModalOpen, setModalText, commandersArray, addToGameLog, generateGameSummary, openai }) => {
  const hexWidth = size * 2;
  const hexHeight = Math.sqrt(3) * size;

  const [isHovered, setIsHovered] = useState(false); // Track hover state
  const [displayEnemyBase, setDisplayEnemyBase] = useState(false); // Track enemy base display.

  const points = [
    [size * Math.cos(0), size * Math.sin(0)],
    [size * Math.cos(Math.PI / 3), size * Math.sin(Math.PI / 3)],
    [size * Math.cos(2 * Math.PI / 3), size * Math.sin(2 * Math.PI / 3)],
    [size * Math.cos(Math.PI), size * Math.sin(Math.PI)],
    [size * Math.cos(4 * Math.PI / 3), size * Math.sin(4 * Math.PI / 3)],
    [size * Math.cos(5 * Math.PI / 3), size * Math.sin(5 * Math.PI / 3)],
  ].map(([px, py]) => `${px + hexWidth / 2},${py + hexHeight / 2}`).join(' ');

  // Event handlers to track hover state
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const onClick = () => {
    // console.log(`clicked a hex: column and row is  is: [${col},${row}]`)
    if(enemyBaseAtThisHex) {
      setDisplayEnemyBase(!displayEnemyBase);
    }
  };

  const getBackgroundImage = () => {
    if(isThereAPathAtThisHex) {
      return `url(${pathIcon})`;
    } else {
      return enemyBaseAtThisHex ? `url(${castleIcon})` : 'none';
    }
  };

  const baseFillColor = enemyBaseAtThisHex ? 'rgba(0, 50, 150, .3)' : 'none';
  const baseHoverColor = enemyBaseAtThisHex ? 'rgba(0, 50, 200, .8)' : 'none';

  return (
    <>
      <span
        // Display hex coords. Can be used for debugging.
        style = {{
          display: 'none',
          position: 'absolute',
          left: x + (hexWidth / 2),
          top: y,
          color: '#ff0000'
        }}
      >
        {col}, {row}
      </span>
      <span
        // In small text, display which commanders are at this location.
        className='hex-commander-name-display'
        style = {{
          left: x + 30,
          top: y,
        }}
      >
        {listOfCommanderNames(commandersArray, true, [col, row])}
      </span>
      <svg
        onClick={() => onClick()}
        width = {hexWidth}
        height = {hexHeight}
        onMouseEnter = {handleMouseEnter}
        onMouseLeave = {handleMouseLeave}
        style = {{
          left: x,
          top: y,
          cursor: enemyBaseAtThisHex ? 'pointer' : 'default',
          backgroundImage: getBackgroundImage()
        }}
      >
        <polygon
          points={points}
          // fill={isHovered ? '#f1c40f' : 'none'} // Change fill on hover
          // fill='none'
          // fill='rgba(0, 50, 200, .5)'
          fill={isHovered || displayEnemyBase ? baseHoverColor : baseFillColor} // Change fill on hover
          stroke={isHovered || displayEnemyBase ? '#f1c40f' : '#2980b9'} // Change stroke on hover
          strokeWidth={2}
        />
      </svg>

      {
        enemyBaseAtThisHex &&
          <EnemyBase
            style={
              {
                backgroundImage: `linear-gradient(white, white), linear-gradient(45deg, ${generateBorderColors(enemyBaseAtThisHex)})`,
                left: x + hexWidth,
                top: y - hexHeight,
                display: displayEnemyBase ? 'block' : 'none'
              }
            }
            key={`${enemyBaseAtThisHex.name}-${id}`} // Ensure unique keys for each instance (okay to give it the id of the hexGrid?)
            enemyBaseAtThisHex={enemyBaseAtThisHex}
            populateModal={populateModal}
            closeModal={closeModal}
            setIsModalOpen={setIsModalOpen}
            setModalText={setModalText}
            commandersArray={commandersArray}
            hexCol={col}
            hexRow={row}
            addToGameLog={addToGameLog}
            generateGameSummary={generateGameSummary}
            openai={openai}
            setDisplayEnemyBase={setDisplayEnemyBase}
          />
      }

    </>
  );
};

export default Hex;
