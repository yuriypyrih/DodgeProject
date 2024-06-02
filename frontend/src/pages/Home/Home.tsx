import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from './Home.module.scss';
import { useNavigate } from 'react-router-dom';
import { PATCH_NOTES } from '../../Models/data/PatchNotes.ts';
import ProfileButton from '../../components/ProfileButton';
import CustomButton from '../../components/CustomButton';
const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleGoPatches = () => {
    navigate('/Patches');
  };
  const handleGoSelection = () => {
    navigate('/Selection');
  };

  const handleGoLeaderboards = () => {
    navigate('/Leaderboards');
  };

  const handleGoAchievements = () => {
    // history.push("/Achievements")
  };
  const handleGoSettings = () => {
    navigate('/Settings');
  };

  return (
    <Box className={styles.root}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', position: 'relative', width: '100%' }}>
          <Box sx={{ width: 150 }}>
            <ProfileButton />
          </Box>
          <Box sx={{ display: 'flex', textAlign: 'center' }}>
            <Typography variant={'h1'} className={styles.title}>
              DODGE
            </Typography>
          </Box>
          <Box sx={{ width: 150, display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <Box>
              <Typography
                onClick={handleGoPatches}
                sx={{
                  fontSize: 14,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
                color={'primary'}
              >
                {`Patch Notes ${PATCH_NOTES[0].tag}`}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '350px', gap: 3, mt: 4 }}>
          <CustomButton onClick={handleGoSelection} text={'PLAY'} fullWidth />
          <CustomButton onClick={handleGoLeaderboards} text={'LEADERBOARDS'} fullWidth />
          <CustomButton onClick={handleGoAchievements} text={'ACHIEVEMENTS'} fullWidth disabled />
          <CustomButton onClick={handleGoSettings} text={'SETTINGS'} fullWidth />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
