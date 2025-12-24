import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import CustomButton from '../../components/CustomButton';
import StoreOption from 'components/StoreOption';
import { LocalArenas, LocalTitles } from 'Models/data/LocalCosmetics.ts';
import clsx from 'clsx';
import TitleCosmetic from 'components/TitleCosmetic';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store.ts';
import ShopButton from 'components/ShopButton';

const ShopPage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.authSlice);
  const [activeFilter, setActiveFilter] = useState<'arenas' | 'titles' | 'coffee'>('titles');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _getArenas = () => {
    return (
      <Box className={styles.mainContainerArena}>
        {LocalArenas.map((arena) => (
          <StoreOption
            title={arena.name + ' Arena'}
            key={arena.name}
            background={arena.url}
            requirement={arena.requiremnt}
            stars={arena.cost}
          />
        ))}
      </Box>
    );
  };

  const getTitles = () => {
    return (
      <Box className={styles.mainContainer}>
        {LocalTitles.map((title) => (
          <StoreOption
            title={title.name + ' Title'}
            key={title.name}
            content={<TitleCosmetic text={user.name} textStyle={title.textStyle} sx={{ fontSize: 18 }} />}
            requirement={title.requiremnt}
            stars={title.cost}
          />
        ))}
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
          <Box sx={{ display: 'flex', justifyContent: 'right' }}>
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
            {/*<Box className={styles.filters}>*/}
            {/*  {[*/}
            {/*    { key: 'titles', label: 'Titles', color: '#00afa3' },*/}
            {/*    { key: 'stars', label: 'Stars', color: '#00afa3', disabled: true },*/}
            {/*  ].map(({ key, label, color, disabled }) => (*/}
            {/*    <label*/}
            {/*      key={key}*/}
            {/*      className={clsx(styles.filterOption, { [styles.active]: activeFilter === key })}*/}
            {/*      style={{ ['--accent' as string]: color, opacity: disabled ? 0.4 : 1 }}*/}
            {/*    >*/}
            {/*      <input*/}
            {/*        type="radio"*/}
            {/*        name="shopFilter"*/}
            {/*        value={key}*/}
            {/*        checked={activeFilter === key}*/}
            {/*        disabled={disabled}*/}
            {/*        onChange={() => setActiveFilter(key as typeof activeFilter)}*/}
            {/*      />*/}
            {/*      <span>{label}</span>*/}
            {/*    </label>*/}
            {/*  ))}*/}
            {/*</Box>*/}
            {getContent()}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomButton text={'BACK'} onClick={() => navigate('/Selection')} />
        </Box>
      </Box>
    </Box>
  );
};

export default ShopPage;
