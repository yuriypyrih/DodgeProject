import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import CustomButton from '../../components/CustomButton';

const AchievementsPage: React.FC<unknown> = () => {
  const navigate = useNavigate();

  return (
    <Box className={styles.root}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>OK</Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomButton onClick={() => navigate('/Home')} text={'BACK'} />
        </Box>
      </Box>
    </Box>
  );
};

export default AchievementsPage;
