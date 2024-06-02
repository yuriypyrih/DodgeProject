import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store.ts';
import { VFX } from '../../game/enum/vfx.ts';
import { finishedTextAnimation, setNightVision } from '../../redux/slices/vfxSlice.ts';
import { setPoisoned } from '../../redux/slices/gameSlice.ts';
import Game from '../../game/engine/game.ts';
import HealIcon from '@mui/icons-material/Favorite';
import styles from './styles.module.scss';
import { COLOR } from '../../game/enum/colors.ts';
import { relics } from '../../game/engine/relics/relics_collection.ts';
import { RELIC_TYPE } from '../../game/enum/relic_type.ts';
import { CircularProgress } from '@mui/material';
import { isChaosDungeon } from '../../utils/isChaosDungeon.ts';
import clsx from 'clsx';

type HudProps = {
  game: Game | null;
  reset: boolean;
};

const Hud: React.FC<HudProps> = ({ game, reset }) => {
  const dispatch = useDispatch();
  const [localReset, setLocalReset] = useState<boolean>(reset);
  const level = useSelector((state: RootState) => state.gameSlice.level);
  const { max_stars, total_stars_collected, star_timers } = useSelector((state: RootState) => state.gameSlice.progress);
  const [reloadProgress, setReloadProgress] = useState<boolean>(true);
  const [prevCollectedStars, setPrevCollectedStars] = useState<number>(0);
  const hp = useSelector((state: RootState) => state.gameSlice.hp);
  const [hpClass, setHpClass] = useState<string>('');
  const vfxObject = useSelector((state: RootState) => state.vfxSlice);
  const poisoned = useSelector((state: RootState) => state.gameSlice.poisoned);
  const selectedRelic = useSelector((state: RootState) => state.gameSlice.selectedRelic);
  const currentTimer = useSelector((state: RootState) => state.gameSlice.currentTimer);
  const chaosTimer = useSelector((state: RootState) => state.gameSlice.chaosTimer);

  const { text_message, play_text } = useSelector((state: RootState) => state.vfxSlice);
  const isChaos = isChaosDungeon(level.level);

  const getChaosTimer = () => {
    if (chaosTimer !== 0) {
      const seconds = Math.floor(chaosTimer);
      const milliseconds = Math.round((chaosTimer - seconds) * 10);
      return (
        <div className={styles.chaosTimer}>
          <span className={styles.sec}>{seconds}</span>
          <span className={styles.milSec}>.{milliseconds}</span>
        </div>
      );
    }
  };

  const getCalculatedProgress = () => {
    if (isChaos && total_stars_collected === star_timers.length - 1) return 100;
    const startTimer =
      total_stars_collected === 0 ? currentTimer : currentTimer - star_timers[total_stars_collected - 1];
    const goalTimer =
      total_stars_collected === 0
        ? star_timers[0]
        : star_timers[total_stars_collected] - star_timers[total_stars_collected - 1];
    if (startTimer >= goalTimer) return 100;
    return Math.trunc((startTimer * 100) / goalTimer);
  };
  const calculatedProgress = getCalculatedProgress();

  const getHPMeter = () => {
    if (hp <= 4) return 4;
    else if (hp > 100) return 100;
    else return hp;
  };

  useEffect(() => {
    //Remove Darkness oon reset
    if (vfxObject.darkness !== 0) {
      dispatch(setNightVision(false));
      console.log('HUD: DARKNESS/VISION RESET');
    }
    // eslint-disable-next-line
  }, [reset]);

  useEffect(() => {
    // Remove poison on reset
    dispatch(setPoisoned(false));
    // console.log("HUD: POISONED");
  }, [dispatch, reset]);

  useEffect(() => {
    if (total_stars_collected !== prevCollectedStars || localReset !== reset) {
      setLocalReset(reset);
      setPrevCollectedStars(total_stars_collected);
      setReloadProgress(!reloadProgress);
    }
    // eslint-disable-next-line
  }, [total_stars_collected, max_stars, star_timers, reset]);

  useEffect(() => {
    if (vfxObject.run_animation === VFX.PULSE_GREEN) {
      setHpClass(styles.healed);
      setTimeout(() => {
        setHpClass('');
      }, 700);
    }
    console.log('HUD: VFX');
  }, [vfxObject]);

  useEffect(() => {
    if (play_text) {
      setTimeout(() => {
        dispatch(finishedTextAnimation());
      }, 4000);
    }
    console.log('HUD: TEXT');
  }, [dispatch, play_text]);

  const getRelic = () => {
    let Icon = HealIcon;
    let wasted = true;
    let variant: 'indeterminate' | 'static' | 'determinate' = 'indeterminate';
    let value = 100;
    if (selectedRelic) {
      wasted = selectedRelic.relic_available_uses <= 0;
      const foundRelic = relics.find((r) => r.id === selectedRelic.relic);
      if (foundRelic) {
        Icon = foundRelic.Icon;
        if (foundRelic.type === RELIC_TYPE.ACTIVE) {
          variant = 'determinate';
          if (selectedRelic.relic_available_uses !== Infinity) {
            value = Math.min(100, (selectedRelic.relic_available_uses / foundRelic.max_uses) * 100);
          }
        } else {
          // IT's PASSIVE and it' already perfect
        }
      } else {
        variant = 'determinate';
        value = 100;
      }
    }

    return (
      <>
        {!wasted && (
          <CircularProgress
            variant={variant}
            disableShrink={variant === 'indeterminate'}
            size={38}
            thickness={2}
            value={value}
            style={{ position: 'absolute' }}
          />
        )}
        <Icon style={{ opacity: wasted ? 0.2 : 1, width: 25, height: 25 }} />
      </>
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.power}>{getRelic()}</div>
        <div>
          <div className={`${styles.health} ${poisoned ? styles.healthPoisoned : null}`}>
            <div className={styles.healthRed} style={{ width: `${getHPMeter()}%` }} />
            <div
              className={`${styles.healthInner} ${hpClass}`}
              style={{
                width: `${getHPMeter()}%`,
                backgroundColor: game && game.player.relicManager.berserkIsActive ? COLOR.ORANGE : undefined,
              }}
            />
          </div>
          {reloadProgress ? (
            <div
              className={clsx(styles.progress, calculatedProgress === 100 ? styles.ready : null)}
              key="progress-default"
            >
              <div
                className={styles.progressInner}
                style={{ width: `${calculatedProgress}%` }}
                // style={{
                //   animationDuration: `${localDuration}s`,
                //   animationPlayState: paused ? 'paused' : 'running',
                // }}
              />
            </div>
          ) : (
            <div
              className={clsx(styles.progress, calculatedProgress === 100 ? styles.ready : null)}
              key="progress-reload"
            >
              <div
                className={styles.progressInner}
                style={{ width: `${calculatedProgress}%` }}
                // style={{
                //   animationDuration: `${localDuration}s`,
                //   animationPlayState: paused ? 'paused' : 'running',
                // }}
              />
            </div>
          )}
        </div>
        {getChaosTimer()}
      </div>
      <div className={styles.dotContainer}>
        {[...Array(max_stars - (isChaos ? 1 : 0))].map((_dummy, index) => (
          <div key={index} className={`${styles.dot} ${total_stars_collected > index ? ' ' + styles.dotStar : ''}`} />
        ))}
      </div>
      {play_text && (
        <div className={styles.textAnimation}>
          {text_message.map((text, index) => (
            <div key={index}>
              {text}
              <br />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hud;
