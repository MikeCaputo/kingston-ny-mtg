import { useEffect, useState } from 'react';
import Hex from './Hex.jsx';
import { areArraysEqual } from './helper-methods.js';

const HexGrid = (props) => {
  const hexSize = 75;
  const [hexArray, setHexArray] = useState([]);

  // Map data
  const selectedMap = props.selectedMap;

  useEffect(() => {
    // Generate a grid of hexagons on initialization
    createHexGrid();
  }, []);

  const createHexGrid = () => {

    // first, clear out any existing hexes (page reloading, etc).
    setHexArray([]);

    const hexes = [];
    // Start with a small number, just to I can do simple dev prototyping.
    // WIP!! I need to move this to the _map data_. Each map can be different. And then I won't have to do weird matching of which hex gets an enemy base.
    const cols = selectedMap.hexGridWidth;
    const rows = selectedMap.hexGridHeight;

    // MC note: ChatGPT started me with this. Then I nudged the numbers around until I got what I wanted.
    // ugh, some of the row nad col geometry is flipped here. I'll fix that later; not a blocker atm.
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const xOffset = (row % 2) * hexSize * 1.55;
        const x = col * hexSize * 3.10 + xOffset;
        const y = row * hexSize * 0.85;

        // here....need to see if there is a base here.
        // might be able to refactor this into a "deep search".
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
  };

  // const handleHexClick = (id) => {
  //   console.log(`Hex clicked: ${id}`);
  // };

  return (
    <div className="hex-grid">
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
        />
      ))}
      {/* <button onClick={createHexGrid}>Create Hex Grid</button> */}
    </div>
  );
};

export default HexGrid;
