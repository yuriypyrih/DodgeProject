import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store.ts';
import CubeRelicButton from 'components/CubeRelicButton';
import styles from './Relics.module.scss';
import { relics } from '../../game/engine/relics/relics_collection.ts';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import UnlockLevelModal from '../../components/UnlockLevelModal/UnlockLevelModal.tsx';
import { unlockAugment } from '../../redux/slices/authSlice.ts';
import { Relic } from '../../game/types/Relic.ts';
import ShopButton from '../../components/ShopButton';
import useNavigateBack from '../../utils/hooks/useNavigateBack.ts';
import CustomButton from '../../components/CustomButton';

const Relics: React.FC = () => {
  const navigate = useNavigate();
  const { navigateBack } = useNavigateBack();
  const dispatch: AppDispatch = useDispatch();
  const { selectedRelic } = useSelector((state: RootState) => state.authSlice.user);
  const { augmentIsLoading } = useSelector((state: RootState) => state.authSlice.meta);

  const [buyAugment, setBuyAugment] = useState<null | Relic>(null);

  return (
    <Box className={styles.root}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ width: '160px' }}>{/*<Button className={classes.relicBtn}>{getRelic()}</Button>*/}</Box>
          <Box>
            <Typography variant={'h5'} color={'primary'}>
              Augment Selection
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 1 }}>
            <Button className={styles.journalBtn} onClick={() => navigate('/Wiki?queryTab=2')}>
              <ImportContactsIcon />
            </Button>
            <ShopButton />
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', rowGap: 4, pl: 4 }}>
          {relics.map((item, key) => (
            <Box key={'level' + key}>
              <CubeRelicButton relic={item} selected={selectedRelic === item.id} onUnlock={() => setBuyAugment(item)} />
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomButton text={'BACK'} onClick={() => navigateBack('/Selection')} loading={augmentIsLoading} />
        </Box>
      </Box>
      {buyAugment !== null && (
        <UnlockLevelModal
          cost={buyAugment.cost}
          description={`To unlock ${buyAugment.name}`}
          onBuy={() => dispatch(unlockAugment({ augment: buyAugment.id, cost: buyAugment.cost }))}
          onClose={() => setBuyAugment(null)}
        />
      )}
    </Box>
  );
};

export default Relics;
