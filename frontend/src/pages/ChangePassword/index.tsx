import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, logout, resetPassword, setStatusMsg } from '../../redux/slices/authSlice.ts';
import { AppDispatch, RootState } from '../../redux/store.ts';
import CustomTextfield from '../../components/CustomTextfield';
import CustomButton from '../../components/CustomButton';
import styles from './styles.module.scss';
import { useNavigate, useParams } from 'react-router-dom';

type TProps = {
  tokenRequired?: boolean;
};

const ChangePasswordPage: React.FC<TProps> = ({ tokenRequired = false }) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { msgIsError, statusMsg, loading } = useSelector((state: RootState) => state.authSlice.meta);
  const { token } = useParams();

  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      dispatch(setStatusMsg({ statusMsg: 'Fill all the fields!', msgIsError: true }));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      dispatch(setStatusMsg({ statusMsg: 'Passwords do not match!', msgIsError: true }));
      return;
    }

    dispatch(changePassword({ currentPassword, newPassword })).then(() => dispatch(logout()));
  };

  const handleResetPassword = () => {
    if (!token) {
      dispatch(setStatusMsg({ statusMsg: 'Missing token!', msgIsError: true }));
      return;
    }
    if (!newPassword || !confirmNewPassword) {
      dispatch(setStatusMsg({ statusMsg: 'Fill all the fields!', msgIsError: true }));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      dispatch(setStatusMsg({ statusMsg: 'Passwords do not match!', msgIsError: true }));
      return;
    }

    dispatch(resetPassword({ token, password: newPassword })).then(() => navigate('/Auth'));
  };

  return (
    <Box className={styles.root}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          height: '100%',
          gap: 4,
        }}
      >
        <Typography variant={'h4'} color={'primary'}>
          {tokenRequired ? 'Reset Password' : 'Change Password'}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '360px',
            position: 'relative',
            marginBottom: '8px',
            gap: 2,
          }}
        >
          {!tokenRequired && (
            <CustomTextfield
              label={'Current Password'}
              type={'password'}
              value={currentPassword}
              setValue={setCurrentPassword}
            />
          )}
          <CustomTextfield label={'New Password'} type={'password'} value={newPassword} setValue={setNewPassword} />
          <CustomTextfield
            label={'Confirm New Password'}
            type={'password'}
            value={confirmNewPassword}
            setValue={setConfirmNewPassword}
          />
          <Box sx={{ display: 'flex', wrap: 'nowrap', gap: 1, width: '100%' }}>
            <CustomButton
              onClick={tokenRequired ? handleResetPassword : handleChangePassword}
              text={'CHANGE PASSWORD'}
              loading={loading}
              sx={{ flex: 2 }}
            />
            <CustomButton
              onClick={() => navigate(tokenRequired ? '/Auth' : '/Profile')}
              text={'CANCEL'}
              sx={{ flex: 1 }}
            />
          </Box>
          <Box sx={{ position: 'relative', width: '100%' }}>
            {statusMsg && (
              <Typography
                style={{ color: msgIsError ? '#EC5151' : '#63EC51', fontSize: 16, position: 'absolute', top: 0 }}
              >
                {statusMsg}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChangePasswordPage;
