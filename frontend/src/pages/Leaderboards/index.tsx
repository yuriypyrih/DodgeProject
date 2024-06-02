import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Tab, Tabs, Typography } from '@mui/material';
import LeaderboardItem from './LeaderboardItem.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store.ts';
import styles from './styles.module.scss';
import { getLeaderboards } from '../../redux/slices/chaosSlice.ts';
import CustomButton from '../../components/CustomButton';
import useNavigateBack from '../../utils/hooks/useNavigateBack.ts';

const LeaderboardsPage: React.FC<unknown> = () => {
  const { navigateBack } = useNavigateBack();
  const dispatch: AppDispatch = useDispatch();
  const [tab, setTab] = useState(0);
  const leaderboards = useSelector((state: RootState) => state.chaosSlice.leaderboards);
  const loading = useSelector((state: RootState) => state.chaosSlice.meta.leaderboardsLoading);
  const userId = useSelector((state: RootState) => state.authSlice.user._id);

  useEffect(() => {
    dispatch(getLeaderboards());
  }, [dispatch]);

  const handleChange = (_event: React.ChangeEvent<unknown>, newValue: number) => {
    setTab(newValue);
  };

  const getContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      );
    } else {
      let currentLevel = '';
      if (tab === 0) {
        currentLevel = 'LVL_25';
      } else if (tab === 1) {
        currentLevel = 'LVL_26';
      } else if (tab === 2) {
        currentLevel = 'LVL_27';
      }
      const tabLeaderboard = leaderboards.find((l) => l.levelId === currentLevel);
      if (!tabLeaderboard || tabLeaderboard.records.length === 0) {
        return <Box sx={{ color: 'grey', textAlign: 'center' }}>No records for this level</Box>;
      } else {
        return tabLeaderboard.records.map((record, index) => (
          <LeaderboardItem
            key={record._id + index}
            scoreRecord={record}
            index={index}
            highlighted={record.userId === userId}
            lastPlaced={index === 10}
          />
        ));
      }
    }
  };

  return (
    <Box className={styles.root}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
          <Box>
            <Box>
              <Typography variant={'h5'} color={'primary'} sx={{ textAlign: 'center' }}>
                Global Leaderboards
              </Typography>
            </Box>
          </Box>
          <Tabs value={tab} onChange={handleChange} indicatorColor="primary">
            <Tab label="Clown Fiesta" className={styles.tabs} />
            <Tab label="Vipers Pit" className={styles.tabs} />
            <Tab label="Anubis Catacomb" className={styles.tabs} />
          </Tabs>
          <Box className={styles.list}>{getContent()}</Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomButton text={'BACK'} onClick={() => navigateBack('/Home')} />
        </Box>
      </Box>
    </Box>
  );
};

export default LeaderboardsPage;
