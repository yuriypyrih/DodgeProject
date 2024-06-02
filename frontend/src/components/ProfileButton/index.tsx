import { Box, Button, Typography } from '@mui/material';
import React from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store.ts';
import { useNavigate } from 'react-router-dom';

const ProfileButton: React.FC<unknown> = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.authSlice);

  return (
    <Box sx={{ cursor: 'pointer', position: 'relative', display: 'inline-block' }} onClick={() => navigate('/Profile')}>
      <Button sx={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: 1, borderRadius: 1 }}>
        <AccountCircleIcon color={'primary'} style={{ width: 24, height: 24 }} />
        <Typography color={'primary'}>{user.name}</Typography>
      </Button>
    </Box>
  );
};

export default ProfileButton;
