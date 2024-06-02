import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

import styles from './styles.module.scss';

const LeaderboardButton: React.FC<unknown> = () => {
  const navigate = useNavigate();

  return (
    <Button className={styles.starsBtn} onClick={() => navigate('/Leaderboards')}>
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
        <Box sx={{ mr: '8px', display: 'flex', alignItems: 'center' }}>
          <LeaderboardIcon sx={{ width: '20px' }} />
        </Box>
        <Typography>Leaderboards</Typography>
      </Box>
    </Button>
  );
};

export default LeaderboardButton;
