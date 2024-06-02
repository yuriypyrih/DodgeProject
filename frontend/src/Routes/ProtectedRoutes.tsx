import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Game from '../pages/Game';
import Victory from '../pages/Victory/Victory.tsx';
import Selection from '../pages/Selection/Selection.tsx';
import Home from '../pages/Home/Home.tsx';
import Defeat from '../pages/Defeat/Defeat.tsx';
import Wiki from '../pages/Wiki/Wiki.tsx';
import Patches from '../pages/Patches/index.tsx';
import { getMe, logout } from '../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import Relics from '../pages/Relics/Relics.tsx';
import { AppDispatch, RootState } from '../redux/store.ts';
import LeaderboardsPage from '../pages/Leaderboards/index.tsx';
import ShopPage from '../pages/Shop';
import ProfilePage from '../pages/Profile';
import SettingsPage from '../pages/Settings';
import ChangePasswordPage from '../pages/ChangePassword';
import FeedbackPage from '../pages/Feedback';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import styles from '../pages/Profile/styles.module.scss';
import LogoutIcon from '@mui/icons-material/Logout';

const ProtectedRoutes: React.FC<unknown> = () => {
  const dispatch: AppDispatch = useDispatch();
  const { _id } = useSelector((state: RootState) => state.authSlice.user);
  const { loading } = useSelector((state: RootState) => state.authSlice.meta);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  if (loading) {
    return (
      <Routes>
        <Route
          path="/*"
          element={
            <Box
              sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <CircularProgress color={'primary'} />
            </Box>
          }
        />
      </Routes>
    );
  } else if (!_id) {
    return (
      <Routes>
        <Route
          path="/*"
          element={
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Typography color={'primary'}>{'Something went wrong, user not found'}</Typography>
              <Button className={styles.btn} onClick={handleLogout} sx={{ display: 'flex', gap: 1 }}>
                <LogoutIcon />
                {'LOGOUT'}
              </Button>
            </Box>
          }
        />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/Home" element={<Home />} />
      <Route path="/Selection" element={<Selection />} />
      <Route path="/Relics" element={<Relics />} />
      <Route path="/Game/:level" element={<Game />} />
      <Route path="/Victory/:level" element={<Victory />} />
      <Route path="/Defeat/:level" element={<Defeat />} />
      <Route path="/Patches" element={<Patches />} />
      <Route path="/Feedback" element={<FeedbackPage />} />
      <Route path="/Wiki" element={<Wiki />} />
      <Route path="/Shop" element={<ShopPage />} />
      <Route path="/Profile" element={<ProfilePage />} />
      <Route path="/Settings" element={<SettingsPage />} />
      <Route path="/Leaderboards" element={<LeaderboardsPage />} />
      <Route path="/changePassword" element={<ChangePasswordPage />} />
      <Route path="/" element={<Navigate to="/Home" replace />} />
      <Route path="*" element={<Navigate to="/Home" replace />} />
    </Routes>
  );
};

export default ProtectedRoutes;
