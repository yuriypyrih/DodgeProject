import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { game } from '../../App.tsx';
import { MUSIC_HIGH, MUSIC_LOW, SOUND_HIGH, SOUND_LOW } from 'game/engine/audio.ts';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import styles from './styles.module.scss';
import clsx from 'clsx';

type TProps = {
  showLabel?: boolean;
  showBackground?: boolean;
};
const VolumeControls: React.FC<TProps> = ({ showLabel, showBackground }) => {
  const [soundVolume, setSoundVolume] = useState('High');
  const [musicVolume, setMusicVolume] = useState('Low');

  useEffect(() => {
    const localStorageMusicVolume = localStorage.getItem('musicVolume');
    setMusicVolume(localStorageMusicVolume || 'Low');
    const localStorageSoundVolume = localStorage.getItem('soundVolume');
    setSoundVolume(localStorageSoundVolume || 'High');
  }, []);

  const handleChangeMusicVolume = () => {
    if (musicVolume === 'High') {
      setMusicVolume('Low');
      localStorage.setItem('musicVolume', 'Low');
      game.audioHandler.theme.volume(MUSIC_LOW);
    } else if (musicVolume === 'Low') {
      setMusicVolume('Off');
      localStorage.setItem('musicVolume', 'Off');
      game.audioHandler.theme.volume(0);
    } else {
      setMusicVolume('High');
      localStorage.setItem('musicVolume', 'High');
      game.audioHandler.theme.volume(MUSIC_HIGH);
    }
  };

  const handleChangeSoundVolume = () => {
    if (soundVolume === 'High') {
      setSoundVolume('Low');
      localStorage.setItem('soundVolume', 'Low');
      game.audioHandler.changeSoundVolume(SOUND_LOW);
    } else if (soundVolume === 'Low') {
      setSoundVolume('Off');
      localStorage.setItem('soundVolume', 'Off');
      game.audioHandler.changeSoundVolume(0);
    } else {
      setSoundVolume('High');
      localStorage.setItem('soundVolume', 'High');
      game.audioHandler.changeSoundVolume(SOUND_HIGH);
    }
  };

  return (
    <Box
      sx={{ display: 'flex', wrap: 'nowrap', alignItems: 'center', gap: 1 }}
      className={clsx(showBackground && styles.background)}
    >
      {showLabel && (
        <Typography color={'primary'} variant={'h5'} sx={{ mr: 1 }}>
          {`Music and SFX`}
        </Typography>
      )}
      <Tooltip title={'Music'} placement={'top'}>
        <IconButton
          aria-label="adjust-music"
          color={'primary'}
          sx={{ gap: 1, borderRadius: 2 }}
          onClick={handleChangeMusicVolume}
        >
          <MusicNoteIcon />
          <Typography sx={{ fontSize: 16, color: '#ffffffAA' }}>{musicVolume}</Typography>
        </IconButton>
      </Tooltip>
      <Tooltip title={'SFX'} placement={'top'}>
        <IconButton
          aria-label="adjust-sound"
          color={'primary'}
          sx={{ gap: 1, borderRadius: 2 }}
          onClick={handleChangeSoundVolume}
        >
          <VolumeUpIcon />
          <Typography sx={{ fontSize: 16, color: '#ffffffAA' }}>{soundVolume}</Typography>
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default VolumeControls;
