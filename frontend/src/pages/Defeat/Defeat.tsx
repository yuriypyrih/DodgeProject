import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Defeat.module.scss';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store.ts';
import { getRandomNumber } from 'utils/random.ts';
import { DEFEAT_QUOTES } from '../../modules/quotes/DEFEAT_QUOTES.ts';
import { CHAOS_DUNGEON_QUOTES } from '../../modules/quotes/CHAOS_QUOTES.ts';

const Defeat: React.FC<unknown> = () => {
  const { search } = useLocation();
  const [deathRecap, setDeathRecap] = useState<string>('');
  const [wasChaos, setWasChaos] = useState<boolean>(false);
  const [tip, setTip] = useState<string>(DEFEAT_QUOTES[getRandomNumber(0, DEFEAT_QUOTES.length)]);
  const [displayedTip, setDisplayedTip] = useState<string>('...');
  const lastRun = useSelector((state: RootState) => state.chaosSlice.lastRun);

  const navigate = useNavigate();
  const query = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  useEffect(() => {
    const recap = query.get('recap');
    const isChaos = query.get('isChaos');
    if (recap) {
      setDeathRecap(recap);
    }
    if (isChaos) {
      setWasChaos(true);
      if (lastRun.score) {
        setTip(CHAOS_DUNGEON_QUOTES[getRandomNumber(0, CHAOS_DUNGEON_QUOTES.length)]);
      }
    }
  }, [lastRun.score, query]);

  useEffect(() => {
    if (tip && displayedTip.length < tip.length) {
      if (displayedTip === '...') {
        const timeout = setTimeout(() => setDisplayedTip(''), 1000);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setDisplayedTip(displayedTip + tip[displayedTip.length]), 40);
        return () => clearTimeout(timeout);
      }
    }
  }, [tip, displayedTip]);

  const handleRestart = () => {
    const lvl = window.location.pathname.split('/')[2];
    navigate(`/Game/${lvl}`, { replace: true });
  };

  const handleQuit = () => {
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

  const isCurrentScoreBestScore = () => {
    if (lastRun.lastRecord && lastRun.score) {
      return lastRun.score > lastRun.lastRecord.score;
    } else {
      return true;
    }
  };

  return (
    <Box className={clsx(styles.root, wasChaos ? styles.chaos : styles.defeat)}>
      <Box className={styles.container}>
        <Typography variant="h2" style={{ color: 'white', textShadow: '5px 5px #111' }}>
          {wasChaos ? 'RUN IS OVER' : 'YOU DIED'}
        </Typography>
        {deathRecap && (
          <Typography style={{ color: '#D4D4D4', marginBottom: '24px' }}>
            <em>Killed by {deathRecap} </em>
          </Typography>
        )}
        {wasChaos && lastRun.score ? (
          <Box sx={{ mb: 2 }}>
            <div>
              <Typography style={{ color: '#D4D4D4', fontSize: '18px' }}>Current run {lastRun.score} sec</Typography>
              {isCurrentScoreBestScore() && (
                <div style={{ color: '#D4D4D4', fontSize: '18px', textShadow: '#00afa3 1px 0 10px' }}>
                  New Personal Highest!
                </div>
              )}
            </div>
            {lastRun.lastRecord && !isCurrentScoreBestScore() && (
              <div>
                <Typography style={{ color: '#D4D4D4', marginBottom: '24px', marginTop: '24px' }}>
                  Your Highest was {lastRun.lastRecord.score} sec
                </Typography>
              </div>
            )}
          </Box>
        ) : null}
        {tip && (
          <Typography style={{ color: '#D4D4D4', marginBottom: '24px' }}>
            {displayedTip} <span style={{ marginLeft: '8px' }}>- YURIV</span>
          </Typography>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '24px',
            gap: '8px',
          }}
        >
          <Box>
            <Button className={styles.button} onClick={handleRestart}>
              <Typography variant="h5">RETRY</Typography>
            </Button>
          </Box>

          <Box>
            <Button className={styles.button} onClick={handleQuit}>
              <Typography variant="h5">QUIT</Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Defeat;
