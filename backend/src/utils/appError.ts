import { ERROR_CODE } from '../data/ERROR_CODE';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  errorCode?: ERROR_CODE;

  constructor(message: string, statusCode: number, errorCode?: ERROR_CODE) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    if (errorCode) {
      this.errorCode = errorCode;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}
