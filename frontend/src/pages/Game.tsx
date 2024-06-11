import React, { useCallback, useEffect, useState } from 'react';
import Hud from '../layout/Hud';
import Pause from '../layout/Pause';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { GAME_STATE } from '../game/enum/game_state';
import { beatLevel } from '../redux/slices/authSlice';
import { dispatch } from '../main.tsx';
import { useNavigate } from 'react-router-dom';
import { resetTimers, setGameState, setLevel } from '../redux/slices/gameSlice.ts';
import { game } from '../App.tsx';
import { relics } from '../game/engine/relics/relics_collection.ts';
import { setContext } from '../game';
import { splitCamelCase } from '../utils/splitCaseWord.ts';
import { isChaosDungeon } from '../utils/isChaosDungeon.ts';
import { LEVEL_STATUS } from 'Models/enum/LEVEL_STATUS.ts';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const [resetToggle, setResetToggle] = useState<boolean>(false);
  const { total_stars_collected } = useSelector((state: RootState) => state.gameSlice.progress);
  const gameState = useSelector((state: RootState) => state.gameSlice.gameState);
  const level = useSelector((state: RootState) => state.gameSlice.level);
  const levels = useSelector((state: RootState) => state.gameSlice.levels);

  const { selectedRelic } = useSelector((state: RootState) => state.authSlice.user);

  const userIsLoading = useSelector((state: RootState) => state.authSlice.userIsLoading);
  const chaosTimer = useSelector((state: RootState) => state.gameSlice.chaosTimer);
  const isChaos = isChaosDungeon(level.level);

  useEffect(() => {
    // Get hold of the canvas context
    const canvas = document.getElementById('gameScreen-canvas');
    // @ts-ignore
    if (canvas) setContext(canvas.getContext('2d'));
    return () => {
      // @ts-ignore
      setContext(null);
    };
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetTimers());
    };
  }, []);

  const startLevel = useCallback(() => {
    console.log('RUN game.start()');
    dispatch(resetTimers());
    const lvl = Number(window.location.pathname.split('/')[2]);
    const foundLevel = levels.find((l) => l.level === lvl);
    if (foundLevel && foundLevel.status === LEVEL_STATUS.UNLOCKED) {
      dispatch(setLevel(foundLevel));
      const foundRelic = relics.find((r) => r.id === selectedRelic);
      game.start(foundLevel.level, foundRelic || null);
      handleResetToggle();
    } else {
      navigate('/Selection');
    }

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    // Start the Level
    if (!userIsLoading) {
      startLevel();
    }
  }, [userIsLoading, startLevel]);

  useEffect(() => {
    // Go to Defeat/Victory
    const lvl = window.location.pathname.split('/')[2];
    if (gameState === GAME_STATE.PAGE_DEFEAT) {
      const recap = splitCamelCase(game.player.healthManager.lastWhoDamagedMe);
      console.log('Proceed to Defeat screen');
      // Prevent from re-entering this state
      dispatch(setGameState(GAME_STATE.CLOSED));
      dispatch(beatLevel({ level: level.levelId, stars: total_stars_collected, score: chaosTimer }));
      navigate(`/Defeat/${lvl}?recap=${recap}${isChaos ? '&isChaos=true' : ''}`);
    } else if (gameState === GAME_STATE.PAGE_VICTORY) {
      console.log('Proceed to Victory screen');
      // Prevent from re-entering this state
      dispatch(setGameState(GAME_STATE.CLOSED));
      dispatch(
        beatLevel({
          level: level.levelId,
          stars: total_stars_collected,
          unlockNext: true,
        }),
      );
      navigate(`/Victory/${lvl}`);
    }
  }, [gameState, level, navigate, total_stars_collected]);

  const handleResetToggle = () => {
    setResetToggle((prev) => !prev);
  };

  return (
    <div
      style={{
        cursor: gameState === GAME_STATE.PLAYING ? 'none' : undefined,
      }}
    >
      <canvas id={'gameScreen-canvas'} width="900" height="500" />
      <Hud game={game} reset={resetToggle} />
      {gameState === GAME_STATE.PAUSED ? <Pause game={game} toggleReset={startLevel} /> : null}
    </div>
  );
};

export default Game;
