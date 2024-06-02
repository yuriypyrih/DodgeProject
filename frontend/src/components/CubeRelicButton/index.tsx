import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import { LEVEL_STATUS } from '../../Models/enum/LEVEL_STATUS.ts';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { COLOR } from '../../game/enum/colors.ts';
import { selectAugment } from '../../redux/slices/authSlice.ts';
import { Relic } from '../../game/types/Relic.ts';
import { AppDispatch, RootState } from '../../redux/store.ts';
import StarCost from '../StarCost';

type CubeRelicButtonProps = {
  relic: Relic;
  selected: boolean;
  onUnlock: () => void;
};

const CubeRelicButton: React.FC<CubeRelicButtonProps> = ({ relic, selected, onUnlock }) => {
  const dispatch: AppDispatch = useDispatch();
  const { unlockedRelics } = useSelector((state: RootState) => state.authSlice.user);
  const [hovered, setHovered] = useState<boolean>(false);
  const isLocked = !unlockedRelics?.includes(relic.id);

  const handleClick = () => {
    if (isLocked) {
      onUnlock();
    } else {
      dispatch(selectAugment({ augment: relic.id }));
    }
  };

  const getTopLabel = () => {
    if (isLocked) {
      return <StarCost cost={relic.cost} hovered={hovered} right={'-8px'} top={'-8px'} />;
    } else if (selected) {
      return (
        <Box
          style={{
            backgroundColor: COLOR.YELLOW,
            borderRadius: '4px 4px 0 0',
            overflow: 'hidden',
            position: 'absolute',
            height: '26px',
            paddingInline: '4px',
            left: '4px',
            top: '-26px',
          }}
        >
          <Typography style={{ textAlign: 'center', color: '#1a1a1d' }}>{`Selected`}</Typography>
        </Box>
      );
    }
  };

  return (
    <Box>
      <Button
        className={clsx(styles.root, isLocked && styles.locked, selected && styles.selected)}
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={relic.state !== LEVEL_STATUS.UNLOCKED && relic.state !== LEVEL_STATUS.LOCKED}
      >
        {getTopLabel()}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <relic.Icon style={{ width: 30, height: 30 }} />
          </Box>
          {relic.state !== LEVEL_STATUS.COMING_SOON ? (
            <Typography variant={'h6'}>{relic.name}</Typography>
          ) : (
            <Typography variant={'caption'}>{relic.name} Coming Soon!</Typography>
          )}
        </Box>
      </Button>
    </Box>
  );
};

export default CubeRelicButton;
