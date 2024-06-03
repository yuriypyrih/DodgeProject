import crypto from 'crypto';
import { promisify } from 'util';

import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import catchAsync from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { sendEmail } from '../utils/email';
import { env } from '../utils/env';
import { ERROR_CODE } from '../data/ERROR_CODE';

const signToken = (id) => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError(
        'Incorrect email or password',
        401,
        ERROR_CODE.WRONG_PASSWORD
      )
    );
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError(
        'You are not logged in! Please log in to get access.',
        401,
        ERROR_CODE.MUST_LOGOUT
      )
    );
  }

  // 2) Verification token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new AppError(
          'Your token has expired! Please log in again.',
          401,
          ERROR_CODE.MUST_LOGOUT
        )
      );
    }
    return next(
      new AppError(
        'Invalid token! Please log in again.',
        401,
        ERROR_CODE.MUST_LOGOUT
      )
    );
  }

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
        ERROR_CODE.MUST_LOGOUT
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed password! Please log in again.',
        401,
        ERROR_CODE.MUST_LOGOUT
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = env.FRONTEND_URL + '/reset-password/' + resetToken;

  const message = `Forgot your password? The link to change your password: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Dodge Password Reset Request',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

export const changePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (
    !user ||
    !(await user.correctPassword(req.body.passwordCurrent, user.password))
  ) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password has been changed'
  });
});

export const changeName = catchAsync(async (req, res, next) => {
  // 1) Fetch all params
  const { name } = req.body;
  const STARS_REQUIRED = 20;

  if (!name) {
    return next(new AppError('No name found', 500));
  }

  // 2) Find the user
  const foundUser = await User.findById(req.user.id);

  if (!foundUser) {
    return next(new AppError('No user found', 500));
  }

  if (foundUser.stars < STARS_REQUIRED) {
    return next(new AppError('Not enough stars', 500));
  }

  if (!name) {
    return next(new AppError('No name found', 500));
  }

  foundUser.name = name;
  foundUser.stars -= STARS_REQUIRED;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, foundUser, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    document: updatedUser
  });
});

export const sendFeedback = catchAsync(async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return content(new AppError('No content was provided.', 404));
  }

  // 1) Get user based on POSTed email
  const foundUser = await User.findById(req.user.id);
  if (!foundUser) {
    return next(new AppError('There is no user with email address.', 404));
  }

  try {
    // 2) Send email to the manager

    await sendEmail({
      email: env.MANAGER_EMAIL,
      subject: `Dodge Feedback: ${foundUser.email}`,
      message: `User: ${foundUser.name}\nEmail: ${foundUser.email}\n\nFeedback:\n${content}`
    });

    // 3) Update the user with the timestamp of the sent feedback
    foundUser.feedbackSentAt = new Date();
    const updatedUser = await foundUser.save({ validateBeforeSave: false });

    // 4) Return the updated user object in the response
    res.status(200).json({
      status: 'success',
      document: updatedUser
    });
  } catch (err) {
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});
