import { Box, Button, IconButton, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import CubePlayButton from '../../components/CubePlayButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { AppDispatch, RootState } from 'redux/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import DefaultIcon from '@mui/icons-material/Description';
import clsx from 'clsx';
import { Level } from 'Models/level.ts';
import UnlockLevelModal from '../../components/UnlockLevelModal/UnlockLevelModal.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Selection.module.scss';
import { relics } from 'game/engine/relics/relics_collection.tsx';
import ChaosPlayButton from '../../components/ChaosPlayButton';
import { unlockLevel } from 'redux/slices/authSlice.ts';
import ShopButton from '../../components/ShopButton';
import LeaderboardButton from '../../components/LeaderboardButton';
import { API_LEVEL } from 'Models/enum/API_LEVEL.ts';
import CustomButton from '../../components/CustomButton';
import WikiButton from 'components/WikiButton';

const Selection: React.FC<unknown> = () => {
  const NORMAL_PAGE_SIZE = 12;
  const CHAOS_PAGE_SIZE = 3;

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

  const pages = useMemo<Level[][]>(() => {
    const out: Level[][] = [];
    for (let i = 0; i < levels.length; ) {
      const isChaos = Boolean(levels[i].chaosDungeon);
      const size = isChaos ? CHAOS_PAGE_SIZE : NORMAL_PAGE_SIZE;
      out.push(levels.slice(i, i + size));
      i += size;
    }
    return out;
  }, [levels]);

  const currentLevels = pages[page - 1] ?? []; // page is 1-based
  const chaosPage = currentLevels.every((l) => l.chaosDungeon);

  const isFirstPage = () => {
    return page === 1;
  };

  const isLastPage = () => {
    // return levels.length <= page * MAX_PAGE_SIZE;
    return page === 5;
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
          <Typography variant={'h5'} className={styles.journalBtn}>
            Level Selection
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <Box>
            <Button className={clsx(styles.relicBtn)} onClick={() => navigate('/Relics')}>
              {getRelic()}
            </Button>
          </Box>
          <Box sx={{ height: 44, display: 'flex', wrap: 'nowrap', gap: 1, justifyContent: 'flex-end' }}>
            {(page === 3 || page === 5) && <LeaderboardButton />}
            <WikiButton />
            <ShopButton />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: chaosPage ? 'repeat(3, 1fr)' : 'repeat(6, 1fr)',
            rowGap: '32px',
          }}
          className={styles.container}
        >
          {currentLevels.map((level) => (
            <Box sx={{ display: 'flex', justifyContent: 'center' }} key={`level-${level.levelId}`}>
              {level.chaosDungeon ? (
                <ChaosPlayButton level={level} clickBuy={() => setBuyLevel(level)} />
              ) : (
                <CubePlayButton
                  level={level}
                  clickBuy={() => setBuyLevel(level)}
                  complete={completeLevels.includes(level.levelId as API_LEVEL)}
                />
              )}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box mr={2} sx={{ position: 'relative', display: 'flex', flexWrap: 'nowrap', alignItems: 'center' }}>
            <IconButton color={'primary'} onClick={previousPage} disabled={isFirstPage()}>
              <ArrowBackIosIcon className={styles.paginatorBtn} />
            </IconButton>
            <Box sx={{ position: 'relative', display: 'flex', gap: '4px', alignContent: 'center' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    backgroundColor: page === i + 1 ? 'primary.main' : 'rgba(255,255,255,0.35)',
                    transition: 'background-color 0.2s ease',
                    display: 'flex',
                    flexDir: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              ))}
            </Box>
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
