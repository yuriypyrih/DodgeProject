import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store.ts';
import { VFX } from 'game/enum/vfx.ts';
import clsx from 'clsx';
import styles from './styles.module.scss';
import { AUGMENTS } from '../../lib/api/specs/api.ts';

type VfxAnimationProps = { children: React.ReactNode };

const VfxAnimation: React.FC<VfxAnimationProps> = ({ children }) => {
  const vfxObject = useSelector((state: RootState) => state.vfxSlice);
  const selectedRelic = useSelector((state: RootState) => state.gameSlice.selectedRelic);
  const [containerClass, setContainerClass] = useState<string>('');
  const [innercontainerClassA, setInnercontainerClassA] = useState<string>('');
  const [innercontainerClassB, setInnercontainerClassB] = useState<string>('');

  useEffect(() => {
    console.log('------ VFX: ', vfxObject.run_animation);
    if (vfxObject.run_animation === VFX.PULSE_LIGHT_BLUE) {
      setContainerClass(styles.PULSE_LIGHT_BLUE_ANIMATION);
      setTimeout(() => {
        setContainerClass('');
      }, 3000);
    }
    if (vfxObject.run_animation === VFX.PULSE_RED) {
      setContainerClass(styles.PULSE_RED_ANIMATION);
      setTimeout(() => {
        setContainerClass((prev) => (prev !== styles.PULSE_RED_ANIMATION ? prev : ''));
      }, 700);
    }
    if (vfxObject.run_animation === VFX.PULSE_GREEN) {
      setContainerClass(styles.PULSE_GREEN_ANIMATION);
      setTimeout(() => {
        setContainerClass('');
      }, 700);
    }
    if (vfxObject.run_animation === VFX.PULSE_HACKED) {
      setContainerClass(styles.PULSE_HACKED_ANIMATION);
      setTimeout(() => {
        setContainerClass('');
      }, 700);
    }
    if (vfxObject.run_animation === VFX.PULSE_GOLD) {
      setContainerClass(styles.PULSE_GOLD_ANIMATION);
      setTimeout(() => {
        setContainerClass('');
      }, 700);
    }
    if (vfxObject.run_animation === VFX.PULSE_IMMUNITY) {
      setContainerClass(styles.PULSE_IMMUNITY_ANIMATION);
      setTimeout(() => {
        setContainerClass('');
      }, 2000);
    }
    if (vfxObject.run_animation === VFX.PULSE_PURPLE) {
      setContainerClass(styles.PULSE_PURPLE_ANIMATION);
      setTimeout(() => {
        setContainerClass('');
      }, 3000);
    }
    if (vfxObject.run_animation === VFX.PULSE_PORTAL) {
      setInnercontainerClassA(styles.PULSE_PORTAL_ORANGE);
      setInnercontainerClassB(styles.PULSE_PORTAL_BLUE);
      setTimeout(() => {
        setInnercontainerClassA('');
        setInnercontainerClassB('');
      }, 500);
    }
    if (vfxObject.run_animation === VFX.PULSE_DEATHMARK) {
      setContainerClass(styles.PULSE_DEATHMARK);
      setTimeout(() => {
        setContainerClass('');
      }, 3000);
    }
    // eslint-disable-next-line
  }, [vfxObject.animation_counter]);

  return (
    <div className={clsx(styles.root, containerClass)}>
      <div
        style={{ width: '100%', height: '100%' }}
        className={clsx(selectedRelic?.relic === AUGMENTS.NIGHT_VISION && styles.nightVisionEffect)}
      >
        <div className={clsx(styles.innerContainer, innercontainerClassA)}>
          <div className={clsx(styles.innerContainer, innercontainerClassB)}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default VfxAnimation;
