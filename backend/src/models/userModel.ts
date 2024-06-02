import crypto from 'crypto';
import mongoose, { Document, Schema, Query } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { AUGMENTS } from '../data/AUGMENTS';
import { LEVELS } from '../data/LEVELS';

export interface IUser extends Document {
  name: string;
  email: string;
  photo?: string;
  role: string;
  password: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active: boolean;
  stars: number;
  unlockedLevels: string[];
  completeLevels: string[];
  unlockedRelics: string[];
  selectedRelic: string;
  feedbackSentAt: Date | null;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  role: {
    type: String,
    enum: ['user'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 letters long'],
    select: false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  feedbackSentAt: {
    type: Date,
    default: null
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  stars: {
    type: Number,
    default: 0,
    select: true
  },
  unlockedLevels: {
    type: [String],
    default: [LEVELS.LVL_1],
    select: true
  },
  completeLevels: {
    type: [String],
    default: [],
    select: true
  },
  unlockedRelics: {
    type: [String],
    default: [AUGMENTS.HEAL, AUGMENTS.HACKED],
    select: true
  },
  selectedRelic: {
    type: String,
    default: AUGMENTS.HEAL,
    select: true
  }
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = (Date.now() - 1000) as unknown as Date;
  next();
});

userSchema.pre<Query<any, Document>>(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      String(this.passwordChangedAt.getTime() / 1000),
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model<IUser>('User', userSchema);
