import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store.ts';
import { LEVEL_STATUS } from '../../Models/enum/LEVEL_STATUS.ts';
import { Level } from '../../Models/level.ts';
import { setGameState } from '../../redux/slices/gameSlice.ts';
import { dispatch } from '../../main.tsx';
import styles from './Victory.module.scss';
import { game } from '../../App.tsx';
import { GAME_STATE } from '../../game/enum/game_state.ts';
import CustomButton from '../../components/CustomButton';
import { VICTORY_QUOTES } from '../../modules/quotes/VICTORY_QUOTES.ts';
import { getRandomNumber } from '../../utils/random.ts';
const Victory: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const levels = useSelector((state: RootState) => state.gameSlice.levels);
  const [nextLevel, setNextLevel] = useState<Level | null>(null);
  const [tip] = useState<string>(VICTORY_QUOTES[getRandomNumber(0, VICTORY_QUOTES.length)]);
  const [displayedTip, setDisplayedTip] = useState<string>('...');

  useEffect(() => {
    const lvl = window.location.pathname.split('/')[2];
    const tempNextLevel = Number(lvl) + 1;
    const foundLevel = levels.find((level) => level.level === tempNextLevel);
    if (foundLevel && foundLevel.status !== LEVEL_STATUS.DISABLED && foundLevel.status !== LEVEL_STATUS.COMING_SOON) {
      setNextLevel(foundLevel);
    }
  }, [levels]);

  useEffect(() => {
    if (tip && displayedTip.length < tip.length) {
      if (displayedTip === '...') {
        const timeout = setTimeout(() => setDisplayedTip(''), 700);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setDisplayedTip(displayedTip + tip[displayedTip.length]), 40);
        return () => clearTimeout(timeout);
      }
    }
  }, [tip, displayedTip]);

  const handleNext = () => {
    if (nextLevel && game) {
      game.gameState = GAME_STATE.PLAYING;
      dispatch(setGameState(GAME_STATE.PLAYING));
      navigate(`/Game/${nextLevel.level}`, { replace: true });
    }
  };

  const handleQuit = () => {
    if (game) game.close();
    const lvl = Number(window.location.pathname.split('/')[2]);
    let page = 1;
    if (!lvl) {
      page = 1;
    }
    if (lvl <= 12) {
      page = 1;
    } else if (lvl <= 24) {
      page = 2;
    } else if (lvl <= 27) {
      page = 3;
    }
    navigate(`/Selection?queryPage=${page}`, { replace: true });
  };

  return (
    <Box className={styles.root}>
      <Box className={styles.container}>
        <Typography variant="h2" style={{ color: 'white', textShadow: '5px 5px #222', marginBottom: '24px' }}>
          VICTORY
        </Typography>
        {tip && (
          <Typography
            style={{
              color: '#D4D4D4',
              marginBottom: '24px',
            }}
          >
            {displayedTip} <span style={{ marginLeft: '8px' }}>- YURIV</span>
          </Typography>
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '24px',
            gap: '8px',
          }}
        >
          {nextLevel && <CustomButton text={'NEXT'} onClick={handleNext} sx={{ minWidth: 200 }} />}
          <CustomButton text={'EXIT'} onClick={handleQuit} sx={{ minWidth: 200 }} />
        </Box>
      </Box>
    </Box>
  );
};

export default Victory;
