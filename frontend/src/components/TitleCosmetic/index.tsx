import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import { TITLES } from '../../lib/api/specs/api.ts';

const fireStyle = {
  position: 'relative',
  display: 'inline-block',

  backgroundImage: 'linear-gradient(180deg, #fff6a9 0%, #ffd166 35%, #ff7b2f 70%, #c40000 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',

  textShadow: `
    0 0 6px rgba(255, 210, 120, 0.8),
    0 0 14px rgba(255, 160, 60, 0.7),
    0 0 24px rgba(255, 120, 30, 0.6),
    0 0 42px rgba(255, 70, 0, 0.5)
  `,

  animation: 'flameFlicker 1.6s infinite ease-in-out',

  // group A: faint, smaller, faster
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    mixBlendMode: 'screen',
    filter: 'blur(0.2px)',
    backgroundRepeat: 'no-repeat',
    opacity: 0.4,
    backgroundImage: [
      'radial-gradient(circle, rgba(255,230,160,0.8) 0.7px, rgba(255,180,90,0.25) 1.4px, transparent 2px)',
      'radial-gradient(circle, rgba(255,220,150,0.8) 0.7px, rgba(255,150,70,0.25) 1.4px, transparent 2px)',
      'radial-gradient(circle, rgba(255,210,140,0.8) 0.7px, rgba(255,120,50,0.25) 1.4px, transparent 2px)',
      'radial-gradient(circle, rgba(255,235,170,0.8) 0.7px, rgba(255,200,110,0.25) 1.4px, transparent 2px)',
      'radial-gradient(circle, rgba(255,245,190,0.8) 0.7px, rgba(255,160,80,0.25) 1.4px, transparent 2px)',
    ].join(','),
    backgroundSize: '3px 3px, 3px 3px, 3px 3px, 3px 3px, 3px 3px',
    backgroundPosition: '12% 108%, 35% 115%, 58% 110%, 77% 118%, 28% 120%',
    animation: 'emberRiseA 3.2s linear infinite',
  },

  // group B: slightly larger, slower
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    mixBlendMode: 'screen',
    filter: 'blur(0.25px)',
    backgroundRepeat: 'no-repeat',
    opacity: 0.4,
    backgroundImage: [
      'radial-gradient(circle, rgba(255,235,180,0.9) 0.9px, rgba(255,200,100,0.55) 1.6px, transparent 2.4px)',
      'radial-gradient(circle, rgba(255,225,160,0.85) 0.9px, rgba(255,170,80,0.5) 1.6px, transparent 2.4px)',
      'radial-gradient(circle, rgba(255,215,140,0.85) 0.9px, rgba(255,140,60,0.45) 1.6px, transparent 2.4px)',
    ].join(','),
    backgroundSize: '4px 4px, 4px 4px, 4px 4px',
    backgroundPosition: '22% 112%, 50% 118%, 74% 112%',
    animation: 'emberRiseB 4s linear infinite 0.4s',
  },

  '@keyframes flameFlicker': {
    '0%': { filter: 'brightness(1)' },
    '35%': { filter: 'brightness(1.15)' },
    '50%': { filter: 'brightness(0.95)' },
    '70%': { filter: 'brightness(1.2)' },
    '100%': { filter: 'brightness(1)' },
  },

  '@keyframes emberRiseA': {
    '0%': { backgroundPosition: '12% 50%, 35% 55%, 58% 52%, 77% 57%, 28% 53%', opacity: 0 },
    '50%': { backgroundPosition: '13% 20%, 34% 18%, 59% 22%, 76% 19%, 29% 21%', opacity: 0.6 },
    '100%': { backgroundPosition: '14% -20%, 33% -25%, 60% -18%, 75% -23%, 30% -19%', opacity: 1 },
  },

  '@keyframes emberRiseB': {
    '0%': { backgroundPosition: '22% 52%, 50% 56%, 74% 53%', opacity: 0 },
    '50%': { backgroundPosition: '21% 25%, 49% 22%, 73% 26%' },
    '100%': { backgroundPosition: '20% -18%, 48% -20%, 72% -15%', opacity: 0.6 },
  },
} as const;

const shadowStyle = {
  color: 'black',
  textShadow: `
    0 0 4px rgba(255,255,255,0.5),
    0 0 10px rgba(235,235,235,0.55),
    0 0 18px rgba(210,210,210,0.5)
  `,
  WebkitBoxReflect: 'below 2px linear-gradient(transparent, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.0) 85%)',
  animation: 'shadowReflectPulse 3s ease-in-out infinite',
  '@keyframes shadowReflectPulse': {
    '0%': { filter: 'brightness(1.2)', opacity: 1 },
    '80%': { filter: 'brightness(1)', opacity: 1 },
    '90%': { filter: 'brightness(0.8)', opacity: 0.2 },
    '100%': { filter: 'brightness(1)', opacity: 1 },
  },
};

const hackerStyle = {
  color: 'black',
  textShadow: `
    0 0 4px rgba(0, 255, 120, 0.7),
    0 0 12px rgba(0, 255, 100, 0.6),
    0 0 20px rgba(0, 200, 80, 0.55)
  `,
  animation: 'shadowGlitch 2.8s infinite steps(24, end)',
  '@keyframes shadowGlitch': {
    '0%': {
      transform: 'translate(0, 0)',
      textShadow: `
        0 0 4px rgba(0, 255, 120, 0.7),
        0 0 10px rgba(0, 255, 100, 0.6),
        0 0 18px rgba(0, 200, 80, 0.55)
      `,
    },
    '8%': { transform: 'translate(0.5px, -0.3px)' },
    '12%': {
      transform: 'translate(-0.9px, 0.5px)',
      textShadow: `
        1px 0 rgba(0, 255, 120, 0.6),
        -1px 0 rgba(0, 180, 80, 0.6),
        0 0 14px rgba(0, 255, 180, 0.5)
      `,
    },
    '14%': { transform: 'translate(0, 0)' },
    '30%': { transform: 'translate(0.3px, 0.2px)' },
    '32%': {
      transform: 'translate(-0.6px, -0.3px)',
      textShadow: `
        -1px 0 rgba(0, 255, 140, 0.6),
        1px 0 rgba(0, 200, 90, 0.55),
        0 0 16px rgba(0, 255, 180, 0.45)
      `,
    },
    '34%': { transform: 'translate(0, 0)' },
    '60%': { transform: 'translate(0.5px, 0)' },
    '62%': { transform: 'translate(0, 0.3px)' },
    '64%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(0, 0)' },
  },
};

const iceStyle = {
  position: 'relative',
  display: 'inline-block',
  backgroundImage: 'linear-gradient(180deg, #e8f9ff 0%, #b8ecff 40%, #6ad0ff 70%, #0077b6 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  textShadow: `
    0 0 8px rgba(200, 240, 255, 0.9),
    0 0 16px rgba(120, 220, 255, 0.8),
    0 0 24px rgba(80, 180, 255, 0.7),
    0 0 36px rgba(60, 150, 255, 0.6)
  `,
  animation: 'iceFlicker 2s infinite ease-in-out',

  // ✨ single sparkle that fades in/out
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 'calc(100% - 6px)',
    left: '100%',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(180,220,255,0.4) 60%, transparent 100%)',
    boxShadow: `
      0 0 6px rgba(200,240,255,0.9),
      0 0 12px rgba(160,220,255,0.7),
      0 0 20px rgba(120,200,255,0.6)
    `,
    opacity: 0,
    animation: 'sparkAppear 3s ease-in-out infinite',
    pointerEvents: 'none',
  },

  '@keyframes iceFlicker': {
    '0%': { filter: 'brightness(1)' },
    '40%': { filter: 'brightness(1.25)' },
    '60%': { filter: 'brightness(0.9)' },
    '100%': { filter: 'brightness(1)' },
  },

  '@keyframes sparkAppear': {
    '0%': { opacity: 0, transform: 'scale(0.4)', left: '0%' },
    '70%': { opacity: 0.8, transform: 'scale(0.4)', left: '0%' },
    '75%': { opacity: 1, transform: 'scale(1.2)', left: '60%' },
    '80%': { opacity: 0.8, transform: 'scale(0.9)', left: '80%' },
    '100%': { opacity: 0, transform: 'scale(0.4)', left: '100%' },
  },
} as const;

const rainbowStyle = {
  backgroundImage:
    'linear-gradient(90deg, blue, violet, violet, red, orange, yellow, green, cyan, blue, violet, violet, red)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  backgroundSize: '400% 100%',
  animation: 'rainbowFlow 3s linear  infinite',
  '@keyframes rainbowFlow': {
    '0%': { backgroundPosition: '0% 50%' },
    '100%': { backgroundPosition: '100% 50%' },
  },
};

const voidStyle = {
  color: 'black',
  textShadow: `
    0 0 4px rgba(160, 100, 255, 0.7),
    0 0 10px rgba(140, 60, 255, 0.8),
    0 0 18px rgba(120, 40, 255, 0.75),
    0 0 28px rgba(100, 20, 200, 0.65),
    0 0 42px rgba(90, 0, 180, 0.6)
  `,
  animation: 'voidPulse 4s infinite ease-in-out',
  '@keyframes voidPulse': {
    '0%': {
      filter: 'brightness(0.9) drop-shadow(0 0 8px rgba(150, 80, 255, 0.4))',
      transform: 'scaleX(1)',
    },
    '50%': {
      filter: 'brightness(1.1) drop-shadow(0 0 12px rgba(180, 100, 255, 1))',
      transform: 'scaleX(1.1)',
    },
    '100%': {
      filter: 'brightness(0.9) drop-shadow(0 0 8px rgba(150, 80, 255, 0.4))',
      transform: 'scaleX(1)',
    },
  },
};

const bronzeStyle = {
  textShadow: `
    0 0 4px rgba(255, 180, 90, 0.5),
    0 0 10px rgba(180, 100, 40, 0.4),
    0 0 18px rgba(120, 60, 20, 0.3)
  `,
};

const silverStyle = {
  textShadow: `
    0 0 4px rgba(255, 255, 255, 0.6),
    0 0 10px rgba(210, 210, 210, 0.5),
    0 0 18px rgba(160, 160, 160, 0.4)
  `,
};

const goldStyle = {
  textShadow: `
    0 0 4px rgba(255, 220, 120, 0.7),
    0 0 10px rgba(255, 200, 80, 0.6),
    0 0 18px rgba(200, 140, 40, 0.5)
  `,
};

const portalStyle = {
  position: 'relative',
  display: 'inline-block',

  // diagonal color split
  backgroundImage: `linear-gradient(135deg, #4db9ff 0%, #4db9ff 45%, #ff934d 55%, #ff934d 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',

  // subtle dual-hue glow
  textShadow: `
    0 0 6px rgba(77, 185, 255, 0.5),
    0 0 12px rgba(255, 147, 77, 0.5),
    0 0 20px rgba(255, 147, 77, 0.4)
  `,
};

const electricStyle = {
  position: 'relative',
  display: 'inline-block',

  // glowing halo around the text
  textShadow: `
    0 0 6px rgba(0, 175, 163, 0.8),
    0 0 12px rgba(0, 220, 205, 0.7),
    0 0 20px rgba(0, 255, 245, 0.6),
    0 0 36px rgba(0, 255, 255, 0.4)
  `,

  // metallic gradient to add depth
  backgroundImage: 'linear-gradient(180deg, #bafff7 0%, #5ff5e7 40%, #00afa3 70%, #00786e 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',

  // short, sharp energy surges instead of continuous flicker
  animation: 'electricSurge 2.6s infinite ease-in-out',

  '@keyframes electricSurge': {
    '0%': {
      filter: 'brightness(1)',
      textShadow: `
        0 0 6px rgba(0, 175, 163, 0.8),
        0 0 12px rgba(0, 220, 205, 0.7),
        0 0 20px rgba(0, 255, 245, 0.6)
      `,
      transform: 'translate(0, 0)',
    },
    '8%': {
      filter: 'brightness(1.35)',
      transform: 'translate(-0.6px, 0.3px) skewX(-2deg)',
    },
    '10%': {
      filter: 'brightness(1.6)',
      transform: 'translate(0.7px, -0.4px) skewX(2deg)',
      textShadow: `
        0 0 10px rgba(0, 255, 230, 0.9),
        0 0 22px rgba(0, 255, 255, 0.8),
        0 0 40px rgba(0, 255, 255, 0.7)
      `,
    },
    '12%': {
      filter: 'brightness(1)',
      transform: 'translate(0, 0)',
    },
    '50%': {
      filter: 'brightness(1.15)',
    },
    '100%': {
      filter: 'brightness(1)',
    },
  },
} as const;

type Props = Readonly<{ text: string; textStyle?: TITLES | null; sx?: SxProps<Theme> }>;

const TitleCosmetic: React.FC<Props> = ({ text, textStyle = TITLES.DEFAULT, sx }) => {
  const getStyle = () => {
    if (textStyle === TITLES.DEFAULT) {
      return {};
    } else if (textStyle === TITLES.FIRE) {
      return fireStyle;
    } else if (textStyle === TITLES.ICE) {
      return iceStyle;
    } else if (textStyle === TITLES.SHADOW) {
      return shadowStyle;
    } else if (textStyle === TITLES.RAINBOW) {
      return rainbowStyle;
    } else if (textStyle === TITLES.VOID) {
      return voidStyle;
    } else if (textStyle === TITLES.HACKER) {
      return hackerStyle;
    } else if (textStyle === TITLES.BRONZE) {
      return bronzeStyle;
    } else if (textStyle === TITLES.SILVER) {
      return silverStyle;
    } else if (textStyle === TITLES.GOLD) {
      return goldStyle;
    } else if (textStyle === TITLES.PORTAL) {
      return portalStyle;
    } else if (textStyle === TITLES.ELECTRIC) {
      return electricStyle;
    }
    return {};
  };

  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        // fontWeight: 800,
        // letterSpacing: 1,
        // fontSize: 48,
        ...getStyle(),
        ...sx,
      }}
    >
      {text}
    </Box>
  );
};

export default TitleCosmetic;
