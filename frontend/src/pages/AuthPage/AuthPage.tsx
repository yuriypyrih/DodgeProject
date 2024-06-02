import React, { useCallback, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, login, register, setStatusMsg } from '../../redux/slices/authSlice.ts';
import { AppDispatch, RootState } from '../../redux/store.ts';
import CustomTextfield from '../../components/CustomTextfield';
import CustomButton from '../../components/CustomButton';
import styles from './AuthPage.module.scss';
import { isValidName } from '../../utils/isValidName.ts';

const AuthPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [state, setState] = useState<'login' | 'register' | 'forgot'>('login');

  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPass, setLoginPass] = useState<string>('');

  const [regEmail, setRegEmail] = useState<string>('');
  const [regPass, setRegPass] = useState<string>('');
  const [regConfPass, setRegConfPass] = useState<string>('');
  const [regName, setRegName] = useState<string>('');

  const [forgotEmail, setForgotEmail] = useState<string>('');

  const { msgIsError, statusMsg, loading } = useSelector((state: RootState) => state.authSlice.meta);
  const handleSetName = (newValue: string) => {
    if (newValue.length === 0) {
      setRegName('');
    }
    if (isValidName(newValue)) {
      setRegName(newValue);
    }
  };

  useEffect(() => {
    dispatch(setStatusMsg({ statusMsg: '', msgIsError: true }));
  }, [loginEmail, loginPass, regEmail, regPass, regConfPass, regName, forgotEmail, dispatch]);

  const handleForgotPassword = useCallback(() => {
    if (!forgotEmail) {
      dispatch(setStatusMsg({ statusMsg: 'Fill all the fields!', msgIsError: true }));
    } else {
      dispatch(forgotPassword({ email: forgotEmail }));
    }
  }, [dispatch, forgotEmail]);

  const handleLogin = useCallback(() => {
    if (!loginEmail || !loginEmail) {
      dispatch(setStatusMsg({ statusMsg: 'Fill all the fields!', msgIsError: true }));
    } else {
      dispatch(login({ email: loginEmail, password: loginPass }));
    }
  }, [dispatch, loginEmail, loginPass]);

  const handleRegister = useCallback(() => {
    if (!regEmail || !regPass || !regConfPass || !regName) {
      dispatch(setStatusMsg({ statusMsg: 'Fill all the fields!', msgIsError: true }));
    } else {
      dispatch(
        register({
          body: {
            name: regName,
            email: regEmail,
            password: regPass,
            passwordConfirm: regConfPass,
          },
          successCallback: () => {
            dispatch(
              setStatusMsg({
                statusMsg: 'Your account has been created!',
                msgIsError: false,
              }),
            );
            setState('login');
          },
        }),
      );
    }
  }, [dispatch, regConfPass, regEmail, regName, regPass]);

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === 'Enter') {
        event.preventDefault();
        if (state === 'login') handleLogin();
        else if (state === 'forgot') handleForgotPassword();
        else if (state === 'register') handleRegister();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [handleForgotPassword, handleLogin, handleRegister, state]);

  const getStatusMsg = () => {
    return (
      statusMsg && (
        <Box sx={{ position: 'relative', width: '100%', top: '8px' }}>
          {statusMsg && (
            <Typography
              style={{
                color: msgIsError ? '#EC5151' : '#63EC51',
                fontSize: 16,
                position: 'absolute',
                top: 0,
                textAlign: 'center',
              }}
            >
              {statusMsg}
            </Typography>
          )}
        </Box>
      )
    );
  };

  const getLogin = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '360px',
          maxWidth: '360px',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography color={'primary'} style={{ fontSize: 24 }}>
            Welcome Dodger
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '24px',
          }}
        >
          <CustomTextfield label={'Email'} value={loginEmail} setValue={setLoginEmail} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '16px',
          }}
        >
          <CustomTextfield label={'Password'} type={'password'} value={loginPass} setValue={setLoginPass} />
        </Box>
        <Box sx={{ display: 'flex', wrap: 'nowrap', justifyContent: 'space-between', pt: 0.5 }}>
          <Box>
            <Typography
              color={'primary'}
              style={{
                fontSize: 12,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() => setState('register')}
            >
              Create Account?
            </Typography>
          </Box>
          <Box>
            <Typography
              color={'primary'}
              style={{
                fontSize: 12,
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
              onClick={() => setState('forgot')}
            >
              Forgot Password?
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 2 }}>
          <CustomButton fullWidth onClick={handleLogin} text={'LOGIN'} loading={loading} />
        </Box>
        {getStatusMsg()}
      </Box>
    );
  };

  const getRegister = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '460px',
          position: 'relative',
          marginBottom: '8px',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography color={'primary'} style={{ fontSize: 24 }}>
            Welcome Dodger
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', wrap: 'nowrap', gap: 2, mt: 1, flex: 1, width: '100%' }}>
          <CustomTextfield label={'Name'} value={regName} setValue={handleSetName} />
          <CustomTextfield label={'Email'} value={regEmail} setValue={setRegEmail} />
        </Box>
        <Box>
          <Box sx={{ display: 'flex', wrap: 'nowrap', gap: 2, width: '100%' }}>
            <CustomTextfield label={'Password'} type={'password'} value={regPass} setValue={setRegPass} />
            <CustomTextfield
              label={'Confirm Password'}
              type={'password'}
              value={regConfPass}
              setValue={setRegConfPass}
            />
          </Box>
          <Box>
            <Typography
              color={'primary'}
              style={{
                fontSize: 12,
                textDecoration: 'underline',
                cursor: 'pointer',
                marginTop: '4px',
              }}
              onClick={() => setState('login')}
            >
              Already have an account?
            </Typography>
          </Box>
        </Box>
        <CustomButton onClick={handleRegister} fullWidth text={'REGISTER'} loading={loading} sx={{ mt: 1 }} />
        {getStatusMsg()}
      </Box>
    );
  };

  const getForgotPassword = () => {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '360px',
          maxWidth: '360px',
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Typography color={'primary'} style={{ fontSize: 24 }}>
            Request Password Reset
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            my: 3,
          }}
        >
          <CustomTextfield label={'Email'} value={forgotEmail} setValue={setForgotEmail} />
        </Box>
        <Box sx={{ width: '100%', display: 'flex', gap: 1 }}>
          <CustomButton onClick={handleForgotPassword} text={'SUBMIT'} loading={loading} sx={{ flex: 1 }} />
          <CustomButton onClick={() => setState('login')} text={'CANCEL'} sx={{ flex: 1 }} />
        </Box>
        {getStatusMsg()}
      </Box>
    );
  };

  const getState = () => {
    if (state === 'register') {
      return getRegister();
    } else if (state === 'forgot') {
      return getForgotPassword();
    } else {
      return getLogin();
    }
  };

  return (
    <Box className={styles.root}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          marginTop: '16px',
          width: '100%',
          height: '100%',
        }}
      >
        <Box className={styles.title}>DODGE</Box>
        {getState()}
      </Box>
    </Box>
  );
};

export default AuthPage;
