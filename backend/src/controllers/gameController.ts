import { AUGMENTS } from '../data/AUGMENTS';
import { LEVELS } from '../data/LEVELS';
import { IUser, User } from '../models/userModel';
import { AppError } from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { ScoreRecord } from '../models/scoreRecordModel';
import mongoose from 'mongoose';
import { decryptObject } from '../utils/decryptObject';
import { env } from '../utils/env';

export const unlockLevel = catchAsync(async (req, res, next) => {
  // 1) Fetch all params
  const { unlockLevel, cost } = req.body;
  if (!unlockLevel) {
    return next(new AppError('You have to provide which level to unlock', 500));
  }

  // 2) Find the user
  const foundUser = await User.findById(req.user.id);

  if (!foundUser) {
    return next(new AppError('No user found', 500));
  }

  if (!Object.keys(LEVELS).includes(unlockLevel)) {
    return next(new AppError('Invalid level name', 500));
  }

  if (foundUser.unlockedLevels.includes(unlockLevel)) {
    return next(new AppError('You already unlocked this level', 500));
  }

  foundUser.unlockedLevels = [...foundUser.unlockedLevels, String(unlockLevel)];

  // Update his stars
  if (cost) {
    if (foundUser.stars < cost) {
      return next(new AppError("You don't have enough stars", 500));
    }
    foundUser.stars -= cost;
  }

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

export const beatLevel = catchAsync(async (req, res, next) => {
  //  Fetch all params
  const { cypher } = req.body;
  if (!cypher) {
    return next(new AppError('No cypher provided', 500));
  }

  const decrypted = decryptObject(cypher, env.CYPHER_KEY);
  const { level, stars, unlockNext, score } = decrypted;

  if (!level) {
    return next(new AppError('You have to provide which level', 500));
  }

  //  Find the user
  const foundUser = await User.findById(req.user.id);

  if (!foundUser) {
    return next(new AppError('No user found', 500));
  }

  //  Add the Stars to the User
  if (stars) foundUser.stars += stars;

  const foundIndex = Object.keys(LEVELS).findIndex((lvl) => lvl === level);
  if (foundIndex === -1) return next(new AppError('Invalid level name', 500));
  const lastRun: any = { lastRecord: null, newRecord: null, score };

  // Create ScoreRecord if score is provided
  if (score) {
    const lastRecord = await ScoreRecord.findOne({
      userId: foundUser._id,
      level
    }).lean();
    lastRun.lastRecord = lastRecord || null;
    if (!lastRecord || lastRecord.score < score) {
      const newRecord = await ScoreRecord.findOneAndUpdate(
        { userId: foundUser, level },
        {
          score,
          augment: foundUser.selectedRelic
        },
        { new: true, upsert: true }
      );
      lastRun.newRecord = newRecord;
    }
  }

  //  Find the next level to unlock
  if (unlockNext) {
    const getCurrentLvlNumber = Number(level.split('_')[1]);
    const nextLevel = `LVL_${getCurrentLvlNumber + 1}`;
    if (
      Object.keys(LEVELS).includes(nextLevel) &&
      !foundUser.unlockedLevels.includes(nextLevel)
    ) {
      foundUser.unlockedLevels = [
        ...foundUser.unlockedLevels,
        String(nextLevel)
      ];
    }
    if (!foundUser.completeLevels.includes(level)) {
      foundUser.stars += 1;
      foundUser.completeLevels = [...foundUser.completeLevels, String(level)];
    }
  }

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, foundUser, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    documents: { user: updatedUser, lastRun }
  });
});

const getTopRecords = async (user: IUser, level: LEVELS) => {
  // Find the top 10 records for the given level
  const topRecords = await ScoreRecord.find({ level })
    .sort({ score: -1 })
    .limit(10)
    .populate('userId')
    .lean();

  // Check if the user's record is in leaderboard
  const userRecord = await ScoreRecord.findOne({
    userId: user._id,
    level
  })
    .populate('userId')
    .lean();

  if (userRecord) {
    const userInTop10 = topRecords.some((record) =>
      new mongoose.Types.ObjectId(record.userId._id).equals(
        userRecord.userId._id
      )
    );

    if (!userInTop10) {
      // Find the user's rank
      const userRank =
        (await ScoreRecord.countDocuments({
          level,
          score: { $gt: userRecord.score }
        })) + 1;
      // Include the user's record as the 11th item
      topRecords.push({ ...userRecord, userRank });
    }
  }

  return topRecords.map((record) => ({
    ...record,
    userName: (record.userId as unknown as { name: string }).name,
    userId: record.userId._id
  }));
};

export const getLeaderBoards = catchAsync(async (req, res, next) => {
  // 1) Find the user
  const foundUser = await User.findById(req.user.id);

  if (!foundUser) {
    return next(new AppError('No user found', 500));
  }
  // 2) Get records
  const [recordsLvl25, recordsLvl26, recordsLvl27] = await Promise.all([
    getTopRecords(foundUser, LEVELS.LVL_25),
    getTopRecords(foundUser, LEVELS.LVL_26),
    getTopRecords(foundUser, LEVELS.LVL_27)
  ]);

  const leaderboard25 = { levelId: LEVELS.LVL_25, records: recordsLvl25 };
  const leaderboard26 = { levelId: LEVELS.LVL_26, records: recordsLvl26 };
  const leaderboard27 = { levelId: LEVELS.LVL_27, records: recordsLvl27 };

  // 3) Return leaderboards
  res.status(200).json({
    status: 'success',
    documents: [leaderboard25, leaderboard26, leaderboard27]
  });
});

export const unlockAugment = catchAsync(async (req, res, next) => {
  // 1) Fetch all params
  const { augment, cost } = req.body;

  if (!augment || !cost) {
    return next(
      new AppError('You have to provide which relic and cost to unlock', 500)
    );
  }

  // 2) Find the user
  const foundUser = await User.findById(req.user.id);

  if (!foundUser) {
    return next(new AppError('No user found', 500));
  }

  if (!Object.keys(AUGMENTS).includes(augment)) {
    return next(new AppError('Invalid AUGMENT name', 500));
  }

  if (foundUser.unlockedRelics.includes(augment)) {
    return next(new AppError('User already has this relic', 500));
  }

  if (foundUser.stars < cost) {
    return next(new AppError('Insufficient stars', 500));
  } else foundUser.stars -= cost;

  foundUser.unlockedRelics = [...foundUser.unlockedRelics, String(augment)];
  foundUser.selectedRelic = String(augment);

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

export const selectAugment = catchAsync(async (req, res, next) => {
  // 1) Fetch all params
  const { augment } = req.body;

  if (!augment) {
    return next(new AppError('You have to provide which relic to unlock', 500));
  }

  // 2) Find the user
  const foundUser = await User.findById(req.user.id);

  if (!foundUser) {
    return next(new AppError('No user found', 500));
  }

  if (!Object.keys(AUGMENTS).includes(augment)) {
    return next(new AppError('Invalid AUGMENT name', 500));
  }

  if (!foundUser.unlockedRelics.includes(augment)) {
    return next(new AppError("User hasn't unlocked this relic yet", 500));
  }

  foundUser.selectedRelic = augment;

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
