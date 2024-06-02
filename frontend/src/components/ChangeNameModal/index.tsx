import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store.ts';
import styles from './styles.module.scss';
import { changeName } from '../../redux/slices/authSlice.ts';
import CustomTextfield from '../CustomTextfield';
import StarCost from '../StarCost';
import { isValidName } from '../../utils/isValidName.ts';
import CustomButton from '../CustomButton';

type TProps = {
  onClose: () => void;
};

const STAR_COST = 20;
const ChangeNameModal: React.FC<TProps> = ({ onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const [name, setName] = useState<string>('');
  const { user } = useSelector((state: RootState) => state.authSlice);
  const { changeNameIsLoading } = useSelector((state: RootState) => state.authSlice.meta);

  const handleSetName = (newValue: string) => {
    if (newValue.length === 0) {
      setName('');
    }
    if (isValidName(newValue)) {
      setName(newValue);
    }
  };

  const handleBuy = () => {
    if (name.length) {
      dispatch(changeName({ name, callback: () => onClose() }));
    }
  };

  return (
    <Box className={styles.root}>
      <Box className={styles.mainBox}>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, my: 2, alignItems: 'center' }}>
          <Typography color={'primary'}>Renaming cost </Typography>
          <Box>
            <StarCost cost={STAR_COST} position={'relative'} right={''} top={''} withoutLock />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1 }}>
          <CustomTextfield label={'New name'} value={name} setValue={handleSetName} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, gap: 1 }}>
          <CustomButton
            disabled={user.stars < STAR_COST || name.length === 0}
            onClick={handleBuy}
            loading={changeNameIsLoading}
            text={'SUBMIT NAME'}
          />
          <CustomButton onClick={onClose} text={'CANCEL'} />
        </Box>
      </Box>
    </Box>
  );
};

export default ChangeNameModal;
