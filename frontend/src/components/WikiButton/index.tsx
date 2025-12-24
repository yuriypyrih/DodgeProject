import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';

type TProps = {
  tab?: number;
};
const WikiButon: React.FC<TProps> = ({ tab = 0 }) => {
  const navigate = useNavigate();

  return (
    <Button className={styles.journalBtn} onClick={() => navigate(`/Wiki?queryTab=${tab}`)}>
      <ImportContactsIcon />
    </Button>
  );
};

export default WikiButon;
