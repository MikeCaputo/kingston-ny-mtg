import { useEffect, useState } from 'react';
import Hex from './Hex.jsx';

const HexGrid = (props) => {
  const hexSize = 75;
  const [hexArray, setHexArray] = useState([]);
  const [hexGridWidthInPixels, setHexGridWidthInPixels] = useState(0);

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
    const cols = selectedMap.hexGridWidth;
    const rows = selectedMap.hexGridHeight;

    // Hex grid variables; still a little fuzzy, but better than pure "magic numbers"
    const staggerFactor = 1.55;       // Controls the stagger between adjacent rows (xOffset)
    const columnSpacingFactor = 3.10; // Controls the horizontal spacing between columns
    const rowSpacingFactor = 0.85;    // Controls the vertical spacing between rows

    // Create a map for enemy bases, where the key is the [col, row] coordinate and the value is the enemy base. (Reduce time complexity. help from ChatGPT)
    const enemyBaseMap = new Map();
    selectedMap.enemyBases.forEach((base) => {
      base.hexGridLocations.forEach((location) => {
        enemyBaseMap.set(location.toString(), base);  // Using .toString() to use arrays as keys
      });
    });

    // Create a Set for path locations for faster lookup. (Reduce time complexity. help from ChatGPT)
    const pathSet = new Set(selectedMap.pathLocations.map(location => location.toString()));

    // Loop through the grid and check the maps for enemy bases and paths
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        const xOffset = (row % 2) * hexSize * staggerFactor;
        const x = col * hexSize * columnSpacingFactor + xOffset;
        const y = row * hexSize * rowSpacingFactor;

        // Lookup enemy base at this hex (if any)
        const enemyBaseAtThisHex = enemyBaseMap.get([col, row].toString()) || null;

        // Lookup path at this hex
        const isThereAPathAtThisHex = pathSet.has([col, row].toString());

        // Push the hex data into the grid
        hexes.push({
          id: `${col}-${row}`, // Unique ID for each hex
          col: col,
          row: row,
          x: x,
          y: y,
          size: hexSize,
          enemyBaseAtThisHex: enemyBaseAtThisHex,
          isThereAPathAtThisHex: isThereAPathAtThisHex
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
            isThereAPathAtThisHex={hex.isThereAPathAtThisHex}
            commandersArray={props.commandersArray}
            setCommandersArray={props.setCommandersArray}
            addToGameLog={props.addToGameLog}
            generateGameSummary={props.generateGameSummary}
            openai={props.openai}
            setIsModalOpen={props.setIsModalOpen}
            populateModal={props.populateModal}
          />
        ))}
      </div>
    </div>
  );
};

export default HexGrid;
