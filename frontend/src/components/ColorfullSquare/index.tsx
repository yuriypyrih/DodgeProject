import React from 'react';

type SquareProps = {
  size?: number; // size of the square in pixels
  color1: string; // first color
  color2?: string; // second color
  style?: any;
  edge?: boolean;
};

const ColorfulSquare: React.FC<SquareProps> = ({ size = 16, color1, color2, style, edge = false }) => {
  const customStyle = {
    width: `${size}px`,
    height: `${size}px`,
    background: `linear-gradient(to top right, ${color1} ${edge ? 75 : 50}%, ${color2 || color1} ${edge ? 25 : 50}%)`,
  };

  return <div style={{ ...customStyle, ...style }} />;
};

export default ColorfulSquare;
