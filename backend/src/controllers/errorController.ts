import { AppError } from '../utils/appError';

const handleCastErrorDB = (err) => {
  const message = ` Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// const handleDuplicateFieldsDB = err => {
//     const value
// }

const handleValidationErrorDB = (err) => {
  // @ts-ignore
  const errors = Object.values(err.errors).map((el) => el.messages);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again', 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message
    // stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.log('ERROR ', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  sendErrorDev(err, res);

  // if (process.env.NODE_ENV === "development") {
  //   sendErrorDev(err, res);
  // } else if (process.env.NODE_ENV === "production") {
  //   let error = { ...err };
  //
  //   if (error.name === "CastError") error = handleCastErrorDB(error);
  //   // if(error.code === 11000) error = handleDuplicateFieldsDB(error);
  //   if (error.name === "ValidationError")
  //     error = handleValidationErrorDB(error);
  //   if (error.name === "JsonWebTokenError") error = handleJWTError(error);
  //   if (error.name === "TokenExpiredError")
  //     error = handleJWTExpiredError(error);
  //
  //   sendErrorProd(error, res);
  // }
};
