import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEVEL_STATUS } from 'Models/enum/LEVEL_STATUS';
import clsx from 'clsx';
import { Level } from 'Models/level';
import Skull from 'assets/img/skull.png';
import styles from './styles.module.scss';
import StarCost from '../StarCost';

type ChaosPlayButtonProps = {
  level: Level;
  clickBuy: () => void;
};

const ChaosPlayButton: React.FC<ChaosPlayButtonProps> = ({ level, clickBuy }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<boolean>(false);

  const handleClick = () => {
    if (level.status === LEVEL_STATUS.UNLOCKED) {
      navigate(`/Game/${level.level}`);
    } else if (level.status === LEVEL_STATUS.LOCKED) {
      clickBuy();
    }
  };

  return (
    <Button
      className={clsx(
        styles.root,
        (level.status === LEVEL_STATUS.LOCKED || level.status === LEVEL_STATUS.COMING_SOON) && styles.locked,
      )}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={level.status !== LEVEL_STATUS.UNLOCKED && level.status !== LEVEL_STATUS.LOCKED}
    >
      <img
        alt={'skull'}
        src={Skull}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.1,
        }}
      />
      {level.status === LEVEL_STATUS.LOCKED && (
        <StarCost cost={level.cost} right={'-12px'} top={'-12px'} hovered={hovered} />
      )}
      {level.status !== LEVEL_STATUS.COMING_SOON ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', textShadow: '0 0 5px #00000050' }}>
          <Box>
            <Typography variant={'h6'}>{level.level}</Typography>
          </Box>
          <Box>
            <Typography variant={'h6'}>{'Chaos Dungeon '}</Typography>
          </Box>
          <Box>
            <Typography variant={'h6'}>{level.description}</Typography>
          </Box>
        </Box>
      ) : (
        <Typography variant={'h5'}>{level.level} Coming Soon!</Typography>
      )}
    </Button>
  );
};

export default ChaosPlayButton;
