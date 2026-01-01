import React, { useMemo, useState } from 'react';
import { Box, Button, FormControl, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';

import styles from './styles.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'redux/store.ts';
import LogoutIcon from '@mui/icons-material/Logout';
import KeyIcon from '@mui/icons-material/Key';
import { logout, selectTitle } from 'redux/slices/authSlice.ts';
import ChangeNameModal from 'components/ChangeNameModal';
import { TITLES } from '../../lib/api/specs/api.ts';
import { LocalTitles, TitleType } from 'Models/data/LocalCosmetics.ts';
import TitleCosmetic from 'components/TitleCosmetic';

const ProfilePage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [changeNameModal, setChangeNameModal] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.authSlice);

  const titles: TitleType[] = useMemo(() => {
    if (user?.unlockedTitles?.length) {
      const validTitles: TitleType[] = [];
      validTitles.push({
        textStyle: TITLES.DEFAULT,
        name: 'Basic',
        cost: 0,
        requiremnt: '-',
        achievements: [],
      });

      LocalTitles.forEach((localT) => {
        if (user.unlockedTitles.includes(localT.textStyle as TITLES)) validTitles.push(localT);
      });
      return validTitles;
    }
    return [];
  }, [user.unlockedTitles]);

  const handleTitleChange = (value: string) => {
    dispatch(selectTitle({ title: value as TITLES }));
  };

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
            <Box sx={{ width: 400, display: 'flex', wrap: 'nowrap', gap: 2 }}>
              <AccountCircleIcon color={'primary'} sx={{ width: 64, height: 64 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', flex: 1, gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', wrap: 'nowrap' }}>
                  <Box sx={{ color: 'white' }}>
                    <TitleCosmetic sx={{ fontSize: 20 }} text={user.name} textStyle={user.selectedTitle as TITLES} />
                  </Box>
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
                <FormControl size="small" fullWidth>
                  <Select
                    labelId="title-select-label"
                    value={user.selectedTitle || TITLES.DEFAULT}
                    label="Title"
                    onChange={(e) => handleTitleChange(e.target.value as string)}
                    variant={'standard'}
                    sx={{
                      color: '#ffffffDD', // selected value text
                      '& .MuiSelect-icon': {
                        color: '#ffffffAA', // dropdown arrow
                      },
                      '&:before, &:after': {
                        borderBottomColor: '#ffffff44', // underline
                      },
                      '&:hover:not(.Mui-disabled):before': {
                        borderBottomColor: '#ffffffAA',
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          backgroundColor: '#2b2b2c', // dropdown bg
                          color: '#ffffffDD',
                        },
                      },
                    }}
                  >
                    {titles.map((t) => (
                      <MenuItem key={t.textStyle} value={t.textStyle}>
                        The {t.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
