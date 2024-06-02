import { Box, Button, IconButton, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import CubePlayButton from '../../components/CubePlayButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { AppDispatch, RootState } from '../../redux/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import DefaultIcon from '@mui/icons-material/Description';
import clsx from 'clsx';
import { Level } from '../../Models/level.ts';
import UnlockLevelModal from '../../components/UnlockLevelModal/UnlockLevelModal.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Selection.module.scss';
import { relics } from '../../game/engine/relics/relics_collection.ts';
import ChaosPlayButton from '../../components/ChaosPlayButton';
import { unlockLevel } from '../../redux/slices/authSlice.ts';
import ShopButton from '../../components/ShopButton';
import LeaderboardButton from '../../components/LeaderboardButton';
import { API_LEVEL } from '../../Models/enum/API_LEVEL.ts';
import CustomButton from '../../components/CustomButton';

const Selection: React.FC<unknown> = () => {
  const MAX_PAGE_SIZE = 12;
  const MAX_CHAOS_SIZE = 3;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { search } = useLocation();
  const [page, setPage] = useState<number>(1);
  const [buyLevel, setBuyLevel] = useState<null | Level>(null);

  const levels = useSelector((state: RootState) => state.gameSlice.levels);
  const { selectedRelic, completeLevels } = useSelector((state: RootState) => state.authSlice.user);
  const { levelIsLoading } = useSelector((state: RootState) => state.authSlice.meta);

  const query = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  useEffect(() => {
    const queryPage = query.get('queryPage');
    if (queryPage) {
      const newPage = Number(queryPage);
      if (newPage >= 1 && newPage <= 3) {
        setPage(newPage);
      }
    }
  }, [query]);

  const getPageLevels = () => {
    // return levels.slice((page - 1) * MAX_PAGE_SIZE, page * MAX_PAGE_SIZE);
    if (page <= 2) {
      return levels.slice((page - 1) * MAX_PAGE_SIZE, page * MAX_PAGE_SIZE);
    } else {
      const previousNormalLevels = MAX_PAGE_SIZE * 2;
      return levels.slice(previousNormalLevels, previousNormalLevels + (page - 2) * MAX_CHAOS_SIZE);
    }
  };

  const isFirstPage = () => {
    return page === 1;
  };

  const isLastPage = () => {
    // return levels.length <= page * MAX_PAGE_SIZE;
    return page === 3;
  };

  const nextPage = () => {
    if (!isLastPage()) {
      const newPage = page + 1;
      setPage(newPage);
      navigate(`?queryPage=${newPage}`);
    }
  };

  const previousPage = () => {
    if (!isFirstPage()) {
      const newPage = page - 1;
      setPage(newPage);
      navigate(`?queryPage=${newPage}`);
    }
  };

  const getRelic = () => {
    let Icon = DefaultIcon;
    const foundRelic = relics.find((r) => r.id === selectedRelic);
    if (foundRelic) {
      Icon = foundRelic.Icon;
    }
    return (
      <>
        <Icon className={styles.relicIcon} />
        <Typography variant={'h6'}>{'AUGMENTS'}</Typography>
      </>
    );
  };

  return (
    <Box className={styles.root}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <Box sx={{ position: 'absolute', display: 'flex', justifyContent: 'center', width: '100%', left: 0 }}>
          <Button className={styles.journalBtn} onClick={() => navigate('/Wiki')}>
            <ImportContactsIcon style={{ marginRight: 8 }} />
            <Typography variant={'h5'}>READ ME</Typography>
          </Button>
        </Box>
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <Box>
            <Button className={clsx(styles.relicBtn)} onClick={() => navigate('/Relics')}>
              {getRelic()}
            </Button>
          </Box>
          <Box sx={{ width: 250, height: 35, display: 'flex', wrap: 'nowrap', gap: 1, justifyContent: 'flex-end' }}>
            {page === 3 && <LeaderboardButton />}
            <ShopButton />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: page === 3 ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
            rowGap: '32px',
          }}
          className={styles.container}
        >
          {getPageLevels().map((item, key) => (
            <Box sx={{ display: 'flex', justifyContent: 'center' }} key={'level' + key + item.level}>
              {item.level <= 24 ? (
                <CubePlayButton
                  level={item}
                  clickBuy={() => setBuyLevel(item)}
                  complete={completeLevels.includes(item.levelId as API_LEVEL)}
                />
              ) : (
                <ChaosPlayButton level={item} clickBuy={() => setBuyLevel(item)} />
              )}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box mr={2}>
            <IconButton color={'primary'} onClick={previousPage} disabled={isFirstPage()}>
              <ArrowBackIosIcon className={styles.paginatorBtn} />
            </IconButton>
            <IconButton color={'primary'} onClick={nextPage} disabled={isLastPage()}>
              <ArrowForwardIosIcon className={styles.paginatorBtn} />
            </IconButton>
          </Box>
          <CustomButton text={'BACK'} onClick={() => navigate('/home')} loading={levelIsLoading} />
        </Box>
      </Box>

      {buyLevel !== null && (
        <UnlockLevelModal
          cost={buyLevel.cost}
          description={`To unlock level ${buyLevel.level}`}
          onBuy={() => dispatch(unlockLevel({ unlockLevel: buyLevel.levelId, cost: buyLevel.cost }))}
          onClose={() => setBuyLevel(null)}
        />
      )}
    </Box>
  );
};

export default Selection;
