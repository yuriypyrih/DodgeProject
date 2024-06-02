import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { RootState } from '../../redux/store.ts';
import styles from './styles.module.scss';
import StarIcon from 'assets/svg/diamond.svg?react';

type UnlockLevelModalProps = {
  description: string;
  onBuy: () => void;
  cost: number;
  onClose: () => void;
};

const UnlockLevelModal: React.FC<UnlockLevelModalProps> = ({ description, onBuy, cost, onClose }) => {
  const { stars } = useSelector((state: RootState) => state.authSlice.user);

  const handleBuy = () => {
    onBuy();
    onClose();
  };

  return (
    <Box className={styles.root}>
      <Box className={styles.mainBox}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box>
            <Typography>{description}</Typography>
          </Box>
          <Box
            sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}
          >
            <Typography sx={{ marginRight: 1 }}>{`Costs`}</Typography>
            <Typography>{cost}</Typography>
            <StarIcon
              style={{
                width: 8,
                height: 8,
                marginLeft: '2px',
                fill: 'yellow',
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <Button
              disabled={stars < cost}
              onClick={handleBuy}
              className={clsx(styles.btn, stars < cost && styles.locked)}
            >
              UNLOCK
            </Button>
            <Button onClick={onClose} className={styles.btn}>
              CANCEL
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UnlockLevelModal;
