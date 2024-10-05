import { useState } from 'react';

const Hex = ({ x, y, size, id, onClick }) => {
  const hexWidth = size * 2;
  const hexHeight = Math.sqrt(3) * size;

  const [isHovered, setIsHovered] = useState(false); // Track hover state

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

  return (
    <svg
      onClick={() => onClick(id)}
      width={hexWidth}
      height={hexHeight}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: "absolute",
        left: x,
        top: y,
        cursor: "pointer",
      }}
    >
      <polygon
        points={points}
        // fill={isHovered ? "#f1c40f" : "none"} // Change fill on hover
        // fill="none"
        // fill="rgba(0, 50, 200, .5)"
        fill={isHovered ? "rgba(0, 50, 150, .4)" : "rgba(0, 50, 200, .1)"} // Change fill on hover
        stroke={isHovered ? "#f1c40f" : "#2980b9"} // Change stroke on hover
        strokeWidth={2}
      />
    </svg>
  );
};

export default Hex;
