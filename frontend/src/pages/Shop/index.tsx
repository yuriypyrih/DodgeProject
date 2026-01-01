import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import CustomButton from '../../components/CustomButton';
import StoreOption from 'components/StoreOption';
import { LocalTitles, TitleType } from 'Models/data/LocalCosmetics.ts';
import TitleCosmetic from 'components/TitleCosmetic';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'redux/store.ts';
import ShopButton from 'components/ShopButton';
import clsx from 'clsx';
import { TITLES } from '../../lib/api/specs/api.ts';
import UnlockLevelModal from 'components/UnlockLevelModal/UnlockLevelModal.tsx';
import { unlockTitle } from 'redux/slices/authSlice.ts';
import ProfileButton from 'components/ProfileButton';

const ShopPage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authSlice);
  const [activeFilter, setActiveFilter] = useState<'titles' | 'stars'>('titles');
  const [buyCosmetic, setBuyCosmetic] = useState<TitleType | null>(null);

  const titles = useMemo(
    () =>
      LocalTitles.filter((title) => {
        return !user?.unlockedTitles?.includes(title.textStyle as TITLES);
      }),
    [user.unlockedTitles],
  );

  const handleBuy = () => {
    dispatch(unlockTitle({ title: buyCosmetic?.textStyle as TITLES }));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const _getArenas = () => {
  //   return (
  //     <Box className={styles.mainContainerArena}>
  //       {LocalArenas.map((arena) => (
  //         <StoreOption
  //           title={arena.name + ' Arena'}
  //           key={arena.name}
  //           background={arena.url}
  //           requirement={arena.requiremnt}
  //           stars={arena.cost}
  //         />
  //       ))}
  //     </Box>
  //   );
  // };

  const getTitles = () => {
    return (
      <Box className={styles.mainContainer}>
        {titles.length > 0 ? (
          titles.map((title) => (
            <StoreOption
              id={title.name}
              title={title.name + ' Title'}
              key={title.name}
              content={<TitleCosmetic text={user.name} textStyle={title.textStyle} sx={{ fontSize: 18 }} />}
              requirement={title.requiremnt}
              achievements={title.achievements}
              stars={title.cost}
              onBuy={() => setBuyCosmetic(title)}
            />
          ))
        ) : (
          <Typography sx={{ color: '#ccc' }}>No cosmetics available for purchase.</Typography>
        )}
      </Box>
    );
  };

  const getContent = () => {
    // if (activeFilter === 'arenas') return getArenas();
    if (activeFilter === 'titles') return getTitles();
    else return <div>No Content</div>;
  };

  return (
    <Box className={styles.root}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <ProfileButton />
            <Box sx={{ position: 'absolute', left: 'calc(50% - 16px)' }}>
              <Typography variant={'h5'} color={'primary'} sx={{ textAlign: 'center' }}>
                Shop
              </Typography>
            </Box>
            <Box>
              <ShopButton />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              justifyContent: 'space-between',
              gap: 1,
              paddingTop: 2,
            }}
          >
            <Box className={styles.filters}>
              {[
                { key: 'titles', label: 'TITLES', color: '#00afa3' },
                // { key: 'wip', label: 'WIP', color: '#00afa3', disabled: true },
                { key: 'stars', label: 'STARS', color: '#00afa3', disabled: true },
              ].map(({ key, label, color, disabled }) => (
                <label
                  key={key}
                  className={clsx(styles.filterOption, { [styles.active]: activeFilter === key })}
                  style={{ ['--accent' as string]: color, opacity: disabled ? 0.4 : 1 }}
                >
                  <input
                    type="radio"
                    name="shopFilter"
                    value={key}
                    checked={activeFilter === key}
                    disabled={disabled}
                    onChange={() => setActiveFilter(key as typeof activeFilter)}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </Box>
            {getContent()}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomButton text={'BACK'} onClick={() => navigate('/Selection')} />
        </Box>
      </Box>
      {buyCosmetic !== null && (
        <UnlockLevelModal
          cost={buyCosmetic.cost}
          description={`To unlock the ${buyCosmetic.name} Title`}
          onBuy={handleBuy}
          onClose={() => setBuyCosmetic(null)}
        />
      )}
    </Box>
  );
};

export default ShopPage;
