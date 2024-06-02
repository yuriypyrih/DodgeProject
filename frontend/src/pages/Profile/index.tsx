import React, { useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';

import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store.ts';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyIcon from '@mui/icons-material/Key';
import { logout } from '../../redux/slices/authSlice.ts';
import ChangeNameModal from '../../components/ChangeNameModal';

const ProfilePage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [changeNameModal, setChangeNameModal] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.authSlice);
  const handleLogout = () => {
    dispatch(logout());
  };

  const handleChangePassword = () => {
    navigate('/changePassword');
  };

  return (
    <Box className={styles.root}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
          <Box>
            <Box>
              <Typography variant={'h5'} color={'primary'} sx={{ textAlign: 'center' }}>
                Profile
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              pt: 8,
              gap: 4,
            }}
          >
            <Box sx={{ width: 400, display: 'flex', wrap: 'nowrap', gap: 2, alignItems: 'center' }}>
              <AccountCircleIcon color={'primary'} sx={{ width: 64, height: 64 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', wrap: 'nowrap' }}>
                  <Typography sx={{ color: '#ffffffDD' }}>{user.name}</Typography>
                  <IconButton
                    aria-label="edit-name"
                    size={'small'}
                    color={'primary'}
                    onClick={() => setChangeNameModal(true)}
                  >
                    <EditIcon fontSize={'small'} />
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', wrap: 'nowrap' }}>
                  <Typography sx={{ color: '#ffffffDD' }}>{user.email}</Typography>
                  <IconButton aria-label="edit-email" size={'small'} disabled color={'primary'}>
                    <EditIcon fontSize={'small'} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button className={styles.btn} onClick={handleChangePassword} sx={{ display: 'flex', gap: 1 }}>
                  <KeyIcon />
                  {'CHANGE PASSWORD'}
                </Button>
                <Button className={styles.btn} onClick={handleLogout} sx={{ display: 'flex', gap: 1 }}>
                  <LogoutIcon />
                  {'LOGOUT'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button className={styles.btn} onClick={() => navigate('/Home')}>
            <Typography variant={'h6'}>BACK</Typography>
          </Button>
        </Box>
      </Box>
      {changeNameModal && <ChangeNameModal onClose={() => setChangeNameModal(false)} />}
    </Box>
  );
};

export default ProfilePage;
