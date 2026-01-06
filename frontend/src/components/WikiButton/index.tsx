import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './styles.module.scss';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import clsx from 'clsx';

type TProps = {
  tab?: number;
  isSpecial?: boolean;
};
const WikiButon: React.FC<TProps> = ({ tab = 0, isSpecial }) => {
  const navigate = useNavigate();

  return (
    <Button
      className={clsx(styles.journalBtn, isSpecial && styles.isSpecial)}
      onClick={() => navigate(`/Wiki?queryTab=${tab}`)}
    >
      <ImportContactsIcon />
    </Button>
  );
};

export default WikiButon;
