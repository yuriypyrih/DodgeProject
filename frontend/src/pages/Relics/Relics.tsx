import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'redux/store.ts';
import CubeRelicButton from 'components/CubeRelicButton';
import styles from './Relics.module.scss';
import { relics } from 'game/engine/relics/relics_collection.tsx';
import UnlockLevelModal from '../../components/UnlockLevelModal/UnlockLevelModal.tsx';
import { unlockAugment } from 'redux/slices/authSlice.ts';
import { Relic } from 'game/types/Relic.ts';
import ShopButton from '../../components/ShopButton';
import useNavigateBack from '../../utils/hooks/useNavigateBack.ts';
import CustomButton from '../../components/CustomButton';
import WikiButton from 'components/WikiButton';

const Relics: React.FC = () => {
  const { navigateBack } = useNavigateBack();
  const dispatch: AppDispatch = useDispatch();
  const { selectedRelic } = useSelector((state: RootState) => state.authSlice.user);
  const { augmentIsLoading } = useSelector((state: RootState) => state.authSlice.meta);

  const [buyAugment, setBuyAugment] = useState<null | Relic>(null);

  return (
    <Box className={styles.root}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          position: 'relative',
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ width: '160px' }}>{/*<ProfileButton />*/}</Box>
            <Box>
              <Typography variant={'h5'} color={'primary'}>
                Augment Selection
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 1 }}>
              <WikiButton tab={2} />
              <ShopButton />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              width: '100%',
              gap: 2,
              height: 360,
              pt: 3,
              mt: 1,
            }}
          >
            {relics.map((item, key) => (
              <Box key={'level' + key}>
                <CubeRelicButton
                  relic={item}
                  selected={selectedRelic === item.id}
                  onUnlock={() => setBuyAugment(item)}
                />
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomButton text={'BACK'} onClick={() => navigateBack('/Selection')} loading={augmentIsLoading} />
        </Box>
      </Box>
      {buyAugment !== null && (
        <UnlockLevelModal
          cost={buyAugment.cost}
          description={`To unlock ${buyAugment.name} augment`}
          onBuy={() => dispatch(unlockAugment({ augment: buyAugment.id, cost: buyAugment.cost }))}
          onClose={() => setBuyAugment(null)}
        />
      )}
    </Box>
  );
};

export default Relics;
