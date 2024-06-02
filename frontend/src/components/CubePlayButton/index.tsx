import { Button, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEVEL_STATUS } from '../../Models/enum/LEVEL_STATUS.ts';
import clsx from 'clsx';
import { Level } from '../../Models/level.ts';
import styles from './styles.module.scss';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import StarCost from '../StarCost';

type CubePlayButtonProps = {
  level: Level;
  complete?: boolean;
  clickBuy: () => void;
  tooltipBot?: boolean;
};

const CubePlayButton: React.FC<CubePlayButtonProps> = ({ level, complete, clickBuy, tooltipBot = false }) => {
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
    <Tooltip
      enterDelay={500}
      id={level.description}
      title={level.description}
      placement={tooltipBot ? 'bottom' : 'top'}
      sx={{
        backgroundColor: '#2dd5c4',
        color: 'white',
        fontSize: 11,
      }}
    >
      <Button
        className={clsx(
          styles.root,
          (level.status === LEVEL_STATUS.LOCKED || level.status === LEVEL_STATUS.COMING_SOON) && styles.locked,
        )}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={level.status == LEVEL_STATUS.DISABLED || level.status === LEVEL_STATUS.COMING_SOON}
      >
        {complete && (
          <MilitaryTechIcon
            style={{
              position: 'absolute',
              top: -12,
              right: -12,
              width: 24,
              height: 24,
              padding: 2,
              color: '#FFFFCC',
              backgroundColor: '#676767',
              boxShadow: '0 0 3px 1px #ECCD51',
              borderRadius: '99px',
            }}
          />
        )}
        {level.status === LEVEL_STATUS.LOCKED && (
          <StarCost cost={level.cost} right={'-12px'} top={'-12px'} hovered={hovered} />
        )}
        {level.status !== LEVEL_STATUS.COMING_SOON ? (
          <Typography variant={'h6'}>{level.level}</Typography>
        ) : (
          <Typography variant={'caption'}>{level.level} Coming Soon!</Typography>
        )}
      </Button>
    </Tooltip>
  );
};

export default CubePlayButton;
