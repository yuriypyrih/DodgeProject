import React from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import styles from './styles.module.scss';
import CustomButton from '../../components/CustomButton';

const ShopPage: React.FC<unknown> = () => {
  const navigate = useNavigate();

  return (
    <Box className={styles.root}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', gap: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
          <Box>
            <Box>
              <Typography variant={'h5'} color={'primary'} sx={{ textAlign: 'center' }}>
                Shop
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'grey',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', wrap: 'nowrap', alignItems: 'center', gap: 1 }}>
              <EngineeringIcon color={'primary'} /> WIP
            </Box>
            {'{{ Shop }} coming soon!'}
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
