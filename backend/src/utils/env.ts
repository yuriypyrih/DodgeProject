import dotenv from 'dotenv';

dotenv.config();

export const env = {
  // (Required) Generic
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL: process.env.FRONTEND_URL || 'NULL',
  PORT: process.env.PORT || 5000,
  MANAGER_EMAIL: process.env.MANAGER_EMAIL || '',
  SERVER_EMAIL: process.env.SERVER_EMAIL || '',
  SERVER_EMAIL_PASS: process.env.SERVER_EMAIL_PASS || '',
  API_SECRET_KEY: process.env.API_SECRET_KEY || '',
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING || '',
  JWT_KEY: process.env.JWT_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '',
  CYPHER_KEY: process.env.CYPHER_KEY || ''
};
