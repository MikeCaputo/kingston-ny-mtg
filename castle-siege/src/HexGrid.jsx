import { useEffect, useState } from 'react';
import Hex from './Hex.jsx';

const HexGrid = () => {
  const hexSize = 75;
  const [hexArray, setHexArray] = useState([]);

  useEffect(() => {
    // Generate a grid of hexagons on initialization
    createHexGrid();
  }, []);

  const createHexGrid = () => {

    // first, clear out any existing hexes (page reloading, etc).
    setHexArray([]);

    const hexes = [];
    const rows = 30;
    const cols = 20;

    // MC note: ChatGPT started me with this. Then I nudged the numbers (1.57, 3.14, 0.85) until I got what I wanted.
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const xOffset = (row % 2) * hexSize * 1.55;
        const x = col * hexSize * 3.10 + xOffset;
        const y = row * hexSize * 0.85;

        hexes.push({
          id: `${row}-${col}`, // Unique ID for each hex
          x: x,
          y: y,
          size: hexSize,
        });
      }
    }
    setHexArray(hexes); // Store the hex grid in state
  };

  const handleHexClick = (id) => {
    console.log(`Hex clicked: ${id}`);
  };

  return (
    <div className="hex-grid">
      {hexArray.map((hex) => (
        <Hex
          key={hex.id}
          id={hex.id}
          x={hex.x}
          y={hex.y}
          size={hex.size}
          onClick={handleHexClick}
        />
      ))}
      {/* <button onClick={createHexGrid}>Create Hex Grid</button> */}
    </div>
  );
};

export default HexGrid;
