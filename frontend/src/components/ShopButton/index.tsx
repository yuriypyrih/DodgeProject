import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import StarIcon from 'assets/svg/diamond.svg?react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store.ts';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import styles from './styles.module.scss';

const StarButton: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { stars } = useSelector((state: RootState) => state.authSlice.user);

  return (
    <Button className={styles.starsBtn} onClick={() => navigate('/Shop')}>
      <Box sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <ShoppingCartIcon sx={{ width: '24px' }} />
          <Box sx={{ height: 16, width: 4, borderRight: '1px solid #ffffff50' }} />
        </Box>
        <Typography variant={'h6'}>{stars}</Typography>
        <StarIcon
          style={{
            width: 18,
            height: 18,
            position: 'absolute',
            right: '-10px',
            top: '-10px',
            background: '#2b2b2c',
            padding: '4px',
            borderRadius: 99,
            fill: 'yellow',
          }}
        />
      </Box>
    </Button>
  );
};

export default StarButton;
