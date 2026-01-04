import ProtectedRoutes from './ProtectedRoutes';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { BrowserRouter } from 'react-router-dom';
import React, { useEffect } from 'react';
import AuthRoutes from './AuthRoutes';
import { game } from '../App.tsx';

const Routes: React.FC<unknown> = () => {
  const accessToken = useSelector((state: RootState) => state.authSlice.accessToken);

  useEffect(() => {
    if (accessToken) {
      game.audioHandler.initAudio();
    }
  }, [accessToken]);
  return <BrowserRouter>{accessToken ? <ProtectedRoutes /> : <AuthRoutes />}</BrowserRouter>;
};

export default Routes;
