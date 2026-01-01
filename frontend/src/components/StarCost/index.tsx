import { Box, Typography } from '@mui/material';
import React from 'react';

import StarIcon from 'assets/svg/diamond.svg?react';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';

import styles from './styles.module.scss';

type StarCostProps = {
  cost: number;
  position?: 'relative' | 'absolute';
  right?: string;
  top?: string;
  hovered?: boolean;
  withoutLock?: boolean;
  disabled?: boolean;
};

const StarCost: React.FC<StarCostProps> = ({
  cost,
  right = '-4px',
  top = '-4px',
  position = 'absolute',
  hovered,
  withoutLock = false,
  disabled,
}) => {
  const getLock = () => {
    return hovered && !disabled ? <LockOpenIcon className={styles.locker} /> : <LockIcon className={styles.locker} />;
  };

  return (
    <Box
      style={{
        backgroundColor: disabled ? '#00AFA310' : '#00AFA3',
        border: disabled ? '2px solid #2dd5c410' : '2px solid #2dd5c4',
        borderRadius: '4px',
        overflow: 'hidden',
        position: position,
        zIndex: 2,
        color: 'white',
        right: right,
        top: top,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!withoutLock && getLock()}
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'center', px: 0.5 }}>
        <Box>
          <Typography sx={{ fontSize: 12 }}>{cost}</Typography>
        </Box>
        <StarIcon
          style={{
            width: 8,
            height: 8,
            marginLeft: '2px',
            fill: 'yellow',
          }}
        />
      </Box>
    </Box>
  );
};

export default StarCost;
