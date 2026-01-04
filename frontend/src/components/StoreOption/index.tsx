import { Box, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store.ts';
import styles from './styles.module.scss';
import StarCost from '../StarCost';
import clsx from 'clsx';
import { ACHIEVEMENT } from '../../lib/api/specs/api.ts';

type TProps = {
  title?: string;
  background?: string;
  id: string;
  content?: any;
  stars?: number;
  isBought?: boolean;
  requirement?: string;
  achievements?: ACHIEVEMENT[];
  onBuy?: () => void;
};

const StoreOption: React.FC<TProps> = ({
  title = 'Tittle',
  content,
  id,
  stars = 0,
  requirement,
  achievements,
  background,
  onBuy,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { unlockedAchievements } = useSelector((state: RootState) => state.authSlice.user);

  const isLocked = useMemo(() => {
    if (!achievements) return false;
    if (achievements?.length && unlockedAchievements?.length) {
      const hasAllAchievements = achievements.every((a) => unlockedAchievements.includes(a));
      if (hasAllAchievements) {
        return false;
      }
    }
    return true;
  }, [achievements, unlockedAchievements]);

  const handleBuy = () => {
    if (onBuy && !isLocked) {
      onBuy();
    }
  };

  return (
    <Box
      key={id}
      className={clsx(styles.root, isLocked && styles.disabled, !isLocked && isHovered && styles.hovered)}
      onMouseEnter={() => {
        if (isLocked) return;
        setIsHovered(true);
      }}
      onClick={handleBuy}
      onMouseLeave={() => setIsHovered(false)}
    >
      {background && <div className={styles.background} />}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, zIndex: 1, position: 'relative' }}>
        <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography color={'primary'} sx={{ textAlign: 'center', fontSize: 16 }}>
              {title}
            </Typography>
          </Box>
          <Box style={{ minHeight: '26px', display: 'flex', justifyContent: 'center' }}>{content}</Box>
          <Box
            className={styles.titleCosmetic}
            style={{ minHeight: '26px', display: 'flex', fontSize: 14, opacity: 0.4, justifyContent: 'center' }}
          >
            {isLocked ? requirement : 'Ready for you'}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'flex-end' }}>
          <StarCost cost={stars} position={'absolute'} hovered={isHovered} disabled={isLocked} />
        </Box>
      </Box>
    </Box>
  );
};

export default StoreOption;
