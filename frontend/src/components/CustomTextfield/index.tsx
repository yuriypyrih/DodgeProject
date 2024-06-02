import { TextField } from '@mui/material';
import React from 'react';
import styles from './styles.module.scss';

type CustomTextfieldProps = {
  haha?: string;
  label?: string;
  type?: string;
  value: string;
  setValue: (s: string) => void;
};

const CustomTextfield: React.FC<CustomTextfieldProps> = ({ label, type, value, setValue }) => {
  return (
    <TextField
      fullWidth
      className={styles.root}
      label={label}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      variant="outlined"
      InputLabelProps={{ sx: { color: '#2dd5c4' } }}
      InputProps={{ style: { color: '#ffffffDD' } }}
      type={type}
    />
  );
};

export default CustomTextfield;
