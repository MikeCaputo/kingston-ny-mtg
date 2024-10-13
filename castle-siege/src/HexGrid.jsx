import { useEffect, useState } from 'react';
import Hex from './Hex.jsx';
import { areArraysEqual } from './helper-methods.js';

const HexGrid = (props) => {
  const hexSize = 75;
  const [hexArray, setHexArray] = useState([]);
  const [hexGridWidthInPixels, setHexGridWidthInPixels] = useState(0);

  // Map data
  const selectedMap = props.selectedMap;
  // const commandersArray = props.commandersArray;
  // const setCommandersArray = props.setCommandersArray;

  useEffect(() => {
    // Generate a grid of hexagons on initialization
    createHexGrid();
  }, []);

  const createHexGrid = () => {

    // first, clear out any existing hexes (page reloading, etc).
    setHexArray([]);

    const hexes = [];
    const cols = selectedMap.hexGridWidth;
    const rows = selectedMap.hexGridHeight;

    // console.log('map cols; should be width: ', cols)
    // console.log('map rows; should be height: ', rows)

    // Hex grid variables; still a little fuzzy, but better than pure "magic numbers"
    const staggerFactor = 1.55;       // Controls the stagger between adjacent rows (xOffset)
    const columnSpacingFactor = 3.10; // Controls the horizontal spacing between columns
    const rowSpacingFactor = 0.85;    // Controls the vertical spacing between rows

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const xOffset = (row % 2) * hexSize * staggerFactor;
        const x = col * hexSize * columnSpacingFactor + xOffset;
        const y = row * hexSize * rowSpacingFactor;

        // here....need to see if there is a base here.
        // might be able to refactor this into a "deep search". . --
        // NEXT, make sure as much of this is moved to the map schema. This is a critical one; what I have here is 100% prototype.
        let enemyBaseAtThisHex = null;
        for(let baseIndex = 0; baseIndex < selectedMap.enemyBases.length; baseIndex++){
          const thisEnemyBase = selectedMap.enemyBases[baseIndex];
          for(let hexGridIndex = 0; hexGridIndex < thisEnemyBase.hexGridLocations.length; hexGridIndex++) {
            const thisHexGrid = thisEnemyBase.hexGridLocations[hexGridIndex];
            // console.log('col is: ', col)
            // console.log('row is: ', row)
            // console.log('thisHexGrid is: ', thisHexGrid)
            // console.log('[col, row] is: ', [col, row])
            if(areArraysEqual(thisHexGrid, [col, row])) {
              console.log('there is an enemy base ', thisEnemyBase, ' here at col: ', col, ' and row: ', row);
              enemyBaseAtThisHex = thisEnemyBase;
            }
          }
        }

        hexes.push({
          id: `${col}-${row}`, // Unique ID for each hex
          col: col,
          row: row,
          x: x,
          y: y,
          size: hexSize,
          enemyBaseAtThisHex: enemyBaseAtThisHex
        });
      }
    }
    setHexArray(hexes); // Store the hex grid in state

    const hexWidthWhenRendered = 237; // Manually calcuated this after rendered in the browser. Used to determine the grid width to allow for css centering.
    setHexGridWidthInPixels(selectedMap.hexGridWidth *  hexWidthWhenRendered)
  };

  return (
    <div className="hex-grid">
      <div className="hex-grid-inner" style={{ width: `${hexGridWidthInPixels}px` }}>
        {hexArray.map((hex) => (
          <Hex
            key={hex.id}
            id={hex.id}
            x={hex.x}
            y={hex.y}
            col={hex.col}
            row={hex.row}
            size={hex.size}
            enemyBaseAtThisHex={hex.enemyBaseAtThisHex}
            commandersArray={props.commandersArray}
            setCommandersArray={props.setCommandersArray}
            addToGameLog={props.addToGameLog}
            generateGameSummary={props.generateGameSummary}
            openai={props.openai}
            setIsModalOpen={props.setIsModalOpen}
            populateModal={props.populateModal}
          />
        ))}
        {/* <button onClick={createHexGrid}>Create Hex Grid</button> */}
      </div>
    </div>
  );
};

export default HexGrid;
