import { Box, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
import BugReportIcon from '@mui/icons-material/BugReport';
import { sendFeedback } from '../../redux/slices/authSlice.ts';
import { AppDispatch, RootState } from '../../redux/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { isBefore, subHours } from 'date-fns';
import CustomButton from '../../components/CustomButton';

const FeedbackPage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [content, setContent] = useState<string>('');
  const { feedbackSentAt } = useSelector((state: RootState) => state.authSlice.user);
  const isSubmittable = content.length <= 1000 && content.length > 0;
  const oneHourAgo = subHours(new Date(), 1);
  const alreadySubmitted = Boolean(feedbackSentAt && isBefore(oneHourAgo, feedbackSentAt));
  const handleSetContent = (newValue: string) => {
    if (newValue.length <= 1000) {
      setContent(newValue);
    }
  };

  const handleSubmit = () => {
    if (isSubmittable) {
      dispatch(sendFeedback({ content }));
    }
  };
  return (
    <Box className={styles.root}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ padding: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant={'h4'} color={'primary'}>
              Feedback / Bug Report
            </Typography>
            <BugReportIcon sx={{ ml: 0.5, fontSize: 40 }} color={'primary'} />
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
            <TextField
              className={styles.textarea}
              label={alreadySubmitted ? 'Already submitted recently' : 'Drop it like it is hot'}
              placeholder={
                'Have something to share with YURIV? Well now you can! \n(max 1000 characters and one submission per hour)'
              }
              disabled={alreadySubmitted}
              value={content}
              onChange={(e) => handleSetContent(e.target.value)}
              multiline
              rows={7}
              fullWidth={true}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ style: { color: '#ffffffDD' } }}
              sx={{
                '& .MuiInputLabel-root': {
                  color: '#2dd5c4',
                },
                '& .MuiInputLabel-root.Mui-disabled': {
                  color: '#2dd5c4',
                },
              }}
            />
            {alreadySubmitted && (
              <Typography sx={{ textAlign: 'right' }} color={'primary'}>
                Thanks for the feedback!
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <CustomButton text={'SUBMIT'} disabled={!isSubmittable || alreadySubmitted} onClick={handleSubmit} />
          <CustomButton text={'BACK'} onClick={() => navigate('/Patches')} />
        </Box>
      </Box>
    </Box>
  );
};

export default FeedbackPage;
