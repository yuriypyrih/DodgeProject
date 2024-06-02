import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BugReportIcon from '@mui/icons-material/BugReport';
import styles from './styles.module.scss';

const FeedbackButton: React.FC<unknown> = () => {
  const navigate = useNavigate();

  return (
    <Button onClick={() => navigate('/Feedback')} className={styles.root} size={'small'}>
      Feedback / Bug Report <BugReportIcon sx={{ ml: 0.5 }} />
    </Button>
  );
};

export default FeedbackButton;
