import { Box, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATCH_NOTES } from '../../Models/data/PatchNotes.ts';
import styles from './index.module.scss';
import FeedbackButton from '../../components/FeedbackButton';
import CustomButton from '../../components/CustomButton';

const Patches: React.FC<unknown> = () => {
  const navigate = useNavigate();

  return (
    <Box className={styles.root}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ padding: '8px' }}>
            <Typography variant={'h4'} color={'primary'}>
              Patch Notes
            </Typography>
          </Box>
          <Box sx={{ position: 'absolute', right: 16 }}>
            <FeedbackButton />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
            padding: '8px',
            maxHeight: 320,
            overflow: 'auto',
          }}
        >
          {PATCH_NOTES.map((patch, index) => (
            <Box key={index} sx={{ display: 'grid', gridTemplateColumns: '160px 1fr', columnGap: '32px' }}>
              <Box>
                <Typography sx={{ color: '#ffffffDD' }}>{patch.title}</Typography>
              </Box>
              <Box sx={{ marginTop: '4px', marginLeft: '8px' }}>
                {patch.content.map((line, index) => (
                  <Typography key={index} color={'primary'} style={{ fontSize: 16 }}>
                    {line}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CustomButton text={'BACK'} onClick={() => navigate('/Home')} />
        </Box>
      </Box>
    </Box>
  );
};

export default Patches;
