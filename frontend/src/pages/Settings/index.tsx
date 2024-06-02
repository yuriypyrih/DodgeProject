import React, { useState } from 'react';
import { Box, FormControlLabel, IconButton, Radio, RadioGroup, styled, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store.ts';
import { setZoom } from '../../redux/slices/layoutSlice.ts';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { isKeyBindingsAWSD, KEY_BINDINGS } from '../../game/engine/input.ts';
import CustomButton from '../../components/CustomButton';
const zoomLevels = [0.6, 0.8, 1, 1.2, 1.5];

const CustomFormControlLabel = styled(FormControlLabel)(({}) => ({
  '.MuiRadio-root': {
    color: '#ffffffAA', // Default (not selected) color for the radio button
  },
  '.Mui-checked': {
    color: '#2dd5c4', // Selected color for the radio button
  },
  '.MuiFormControlLabel-label': {
    color: '#ffffffAA', // Default (not selected) color for the label
  },
  '& .Mui-checked + .MuiFormControlLabel-label': {
    color: '#ffffff', // Selected color for the label
  },
}));
const SettingsPage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [bindings, setBindings] = useState<KEY_BINDINGS>(isKeyBindingsAWSD() ? KEY_BINDINGS.AWSD : KEY_BINDINGS.ARROWS);
  const zoom = useSelector((state: RootState) => state.layoutSlice.zoom);

  const isZoomMax = zoom >= zoomLevels[zoomLevels.length - 1];
  const isZoomMin = zoom <= zoomLevels[0];
  const handleZoomIn = () => {
    if (!isZoomMax) {
      const foundIndex = zoomLevels.findIndex((z) => z === zoom);
      if (foundIndex !== -1) {
        const newZoom = zoomLevels[foundIndex + 1];
        dispatch(setZoom(newZoom));
        localStorage.setItem('zoomLevel', String(newZoom));
      }
    }
  };

  const handleZoomOut = () => {
    if (!isZoomMin) {
      const foundIndex = zoomLevels.findIndex((z) => z === zoom);
      if (foundIndex !== -1) {
        const newZoom = zoomLevels[foundIndex - 1];
        dispatch(setZoom(newZoom));
        localStorage.setItem('zoomLevel', String(newZoom));
      }
    }
  };

  const handleChangeBindings = (newBindings: KEY_BINDINGS) => {
    setBindings(newBindings);
    localStorage.setItem('keyBindings', newBindings);
  };

  return (
    <Box className={styles.root}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, alignItems: 'center' }}>
          <Box>
            <Box>
              <Typography variant={'h5'} color={'primary'} sx={{ textAlign: 'center' }}>
                Settings
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              width: 600,
              flex: 1,
              gap: 3,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', wrap: 'nowrap', alignItems: 'center', gap: 1 }}>
                <Typography color={'primary'} variant={'h5'} sx={{ mr: 1 }}>
                  {`Zoom level `}
                  <span style={{ color: '#ffffffDD' }}>
                    <span style={{ fontSize: 16, marginLeft: 16 }}>x</span>
                    {zoom}
                  </span>
                </Typography>
                <IconButton
                  aria-label="edit-name"
                  size={'small'}
                  color={'primary'}
                  onClick={handleZoomIn}
                  disabled={isZoomMax}
                  sx={{ border: 1 }}
                >
                  <AddIcon fontSize={'small'} />
                </IconButton>
                <IconButton
                  aria-label="edit-name"
                  size={'small'}
                  color={'primary'}
                  onClick={handleZoomOut}
                  disabled={isZoomMin}
                  sx={{ border: 1 }}
                >
                  <RemoveIcon fontSize={'small'} />
                </IconButton>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 16, color: '#ffffffAA' }}>
                  Optionally, you can change the zoom level with Ctrl + Scroll
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', wrap: 'nowrap', alignItems: 'center', gap: 1 }}>
                <Typography color={'primary'} variant={'h5'} sx={{ mr: 1 }}>
                  {`Key Bindings`}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flex: 0 }}>
                <RadioGroup value={bindings} onChange={(e) => handleChangeBindings(e.target.value as KEY_BINDINGS)}>
                  <CustomFormControlLabel
                    value={KEY_BINDINGS.ARROWS}
                    control={<Radio />}
                    label="Arrows for movement and Q to activate augment"
                  />
                  <CustomFormControlLabel
                    value={KEY_BINDINGS.AWSD}
                    control={<Radio />}
                    label="AWSD for movement and L to activate augment"
                  />
                </RadioGroup>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', wrap: 'nowrap', alignItems: 'center', gap: 1 }}>
                <Typography color={'primary'} variant={'h5'} sx={{ mr: 1 }}>
                  {`Music and SFX`}
                </Typography>
                <IconButton aria-label="adjust-music" color={'primary'} disabled={true}>
                  <MusicNoteIcon />
                </IconButton>
                <IconButton aria-label="adjust-volume" color={'primary'} disabled={true}>
                  <VolumeUpIcon />
                </IconButton>
              </Box>
              <Box>
                <Typography sx={{ fontSize: 16, color: '#ffffffAA' }}>Coming Soon!</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomButton onClick={() => navigate('/Home')} text={'BACK'} />
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
