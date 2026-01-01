import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store.ts';
import { clearUnlockedAchievements } from 'redux/slices/gameSlice.ts';

const AUTO_HIDE_MS = 7000;

const AchievementsBanner: React.FC = () => {
  const dispatch = useDispatch();
  const unlockedAchievements = useSelector((state: RootState) => state.gameSlice.showUnlockedAchievements);

  const [visible, setVisible] = useState(false);

  // Show banner when new achievements arrive
  useEffect(() => {
    if (unlockedAchievements.length > 0) {
      setVisible(true);

      const timer = setTimeout(() => {
        handleClose();
      }, AUTO_HIDE_MS);

      return () => clearTimeout(timer);
    }
  }, [unlockedAchievements]);

  const handleClose = () => {
    setVisible(false);
    dispatch(clearUnlockedAchievements());
  };

  if (!visible) return null;

  return (
    <Box className={styles.main}>
      <Box className={styles.header}>
        <Typography variant="subtitle1" className={styles.title}>
          Achievement Unlocked
        </Typography>

        <IconButton size="small" onClick={handleClose} sx={{ color: '#2dd5c4' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box className={styles.list}>
        {unlockedAchievements.map((achievement) => (
          <Box key={achievement.name} className={styles.item}>
            <Typography variant="body2">{achievement.name.replace(/_/g, ' ')}</Typography>
            <Typography variant="caption" className={styles.reward}>
              +{achievement.reward} ⭐
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AchievementsBanner;
