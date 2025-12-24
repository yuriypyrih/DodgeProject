import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store.ts';
import styles from './styles.module.scss';
import StarCost from '../StarCost';
import clsx from 'clsx';
import TitleCosmetic from 'components/TitleCosmetic';

type TProps = {
  title?: string;
  background?: string;
  content?: any;
  stars?: number;
  isBought?: boolean;
  requirement?: string;
  onBuy?: () => void;
};

const StoreOption: React.FC<TProps> = ({ title = 'Tittle', content, stars = 0, isBought, requirement, background }) => {
  const dispatch: AppDispatch = useDispatch();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.authSlice);

  // const handleBuy = () => {
  //   if (name.length) {
  //     dispatch(changeName({ name, callback: () => onClose() }));
  //   }
  // };

  return (
    <Box
      className={clsx(styles.root, isBought && styles.disabled, !isBought && isHovered && styles.hovered)}
      onMouseEnter={() => {
        if (isBought) return;
        setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {background && <div className={styles.background} />}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, zIndex: 1, position: 'relative' }}>
        <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography color={'primary'} sx={{ textAlign: 'center', fontSize: 16 }}>
              {title}
            </Typography>
          </Box>
          <Box style={{ minHeight: '26px', display: 'flex', justifyContent: 'center' }}>{content}</Box>
          <Box style={{ minHeight: '26px', display: 'flex', fontSize: 14, opacity: 0.4, justifyContent: 'center' }}>
            {requirement}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'flex-end' }}>
          <StarCost cost={stars} position={'absolute'} hovered={isHovered} />
        </Box>
      </Box>
    </Box>
  );
};

export default StoreOption;
