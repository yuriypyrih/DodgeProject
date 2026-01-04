import { AUGMENTS } from '../data/AUGMENTS';
import {
  BASIC_LEVELS_ARRAY,
  CHAOS_DUNGEON_LEVELS,
  LEVELS
} from '../data/LEVELS';
import { IUser, User } from '../models/userModel';
import { AppError } from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { ScoreRecord } from '../models/scoreRecordModel';
import mongoose from 'mongoose';
import { decryptObject } from '../utils/decryptObject';
import { env } from '../utils/env';
import { ACHIEVEMENTS, ACHIEVEMENTS_OBJECT } from '../data/ACHIEVEMENTS';
import { LocalTitles, TITLES } from '../data/TITLES';

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
  const { level, stars, unlockNext, score, newAchievements } = decrypted;

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
  // if no bestRecord provided then current score is the highest
  const lastRun: any = { lastRecord: null, score };

  // Create ScoreRecord if score is provided
  if (score) {
    const lastRecord = await ScoreRecord.findOne({
      userId: foundUser._id,
      level
    }).lean();
    lastRun.lastRecord = lastRecord || null;
    // New high score?
    if (!lastRecord || lastRecord.score <= score) {
      lastRun.lastRecord = await ScoreRecord.findOneAndUpdate(
        { userId: foundUser, level },
        {
          score,
          augment: foundUser.selectedRelic
        },
        { new: true, upsert: true }
      );
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

    if (
      foundUser.selectedRelic === AUGMENTS.HARVESTER &&
      !foundUser.harvestedLevels.includes(level)
    ) {
      foundUser.stars += 100;
      foundUser.harvestedLevels = [...foundUser.harvestedLevels, String(level)];
    }
  }
  // Achievement handling
  if (Array.isArray(newAchievements) && newAchievements.length > 0) {
    const validAchievements = Object.values(ACHIEVEMENTS);

    const achievementsToAdd = newAchievements.filter((achievement) => {
      return (
        validAchievements.includes(achievement) &&
        !foundUser.unlockedAchievements.includes(achievement)
      );
    });

    if (achievementsToAdd.length > 0) {
      foundUser.unlockedAchievements = [
        ...foundUser.unlockedAchievements,
        ...achievementsToAdd
      ];
    }
  }

  // Check for BACKEND achievements
  const backendUnlocked = await checkForAchievements(foundUser);

  // Combine and deduplicate Achievements
  const newUnlockedAchievements = Array.from(
    new Set([...newAchievements, ...backendUnlocked])
  );

  // Add the stars of the Achievements to the user
  newUnlockedAchievements.forEach((achievement) => {
    const stars = ACHIEVEMENTS_OBJECT[achievement]?.reward;
    if (stars) {
      foundUser.stars += stars;
    }
  });

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, foundUser, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    documents: { user: updatedUser, lastRun, newUnlockedAchievements }
  });
});
export async function checkForAchievements(foundUser: any): Promise<string[]> {
  if (!foundUser) return [];

  const previouslyUnlocked = new Set(foundUser.unlockedAchievements || []);
  const unlocked = new Set(previouslyUnlocked);
  const completed = new Set(foundUser.completeLevels || []);
  const userId = foundUser._id.toString();

  // BRONZE_COMPETENT
  const hasCompletedAllBasicLevels = BASIC_LEVELS_ARRAY.every((lvl) =>
    completed.has(lvl)
  );

  if (
    hasCompletedAllBasicLevels &&
    !unlocked.has(ACHIEVEMENTS.BRONZE_COMPETENT)
  ) {
    unlocked.add(ACHIEVEMENTS.BRONZE_COMPETENT);
  }

  // Chaos dungeon shared data
  const needsChaosCheck =
    !unlocked.has(ACHIEVEMENTS.SILVER_TALENTED) ||
    !unlocked.has(ACHIEVEMENTS.GOLD_CMAMPION) ||
    !unlocked.has(ACHIEVEMENTS.LEADER);

  const chaosResults: Record<string, { isTop10: boolean; isFirst: boolean }> =
    {};

  if (needsChaosCheck) {
    for (const level of CHAOS_DUNGEON_LEVELS) {
      const records = await ScoreRecord.find({ level })
        .sort({ score: -1 })
        .limit(10)
        .select('userId')
        .lean();

      const isTop10 = records.some((r) => r.userId.toString() === userId);

      const isFirst =
        records.length > 0 && records[0].userId.toString() === userId;

      chaosResults[level] = { isTop10, isFirst };
    }
  }

  // SILVER_TALENTED
  if (
    !unlocked.has(ACHIEVEMENTS.SILVER_TALENTED) &&
    Object.values(chaosResults).some((r) => r.isTop10)
  ) {
    unlocked.add(ACHIEVEMENTS.SILVER_TALENTED);
  }

  // GOLD_CMAMPION
  if (
    !unlocked.has(ACHIEVEMENTS.GOLD_CMAMPION) &&
    CHAOS_DUNGEON_LEVELS.every((lvl) => chaosResults[lvl]?.isTop10 === true)
  ) {
    unlocked.add(ACHIEVEMENTS.GOLD_CMAMPION);
  }

  // LEADER
  if (
    !unlocked.has(ACHIEVEMENTS.LEADER) &&
    Object.values(chaosResults).some((r) => r.isFirst)
  ) {
    unlocked.add(ACHIEVEMENTS.LEADER);
  }

  // OVERACHIEVER (must be last)
  if (!unlocked.has(ACHIEVEMENTS.OVERACHIEVER)) {
    const countExcludingSelf = Array.from(unlocked).filter(
      (a) => a !== ACHIEVEMENTS.OVERACHIEVER
    ).length;

    if (countExcludingSelf >= 10) {
      unlocked.add(ACHIEVEMENTS.OVERACHIEVER);
    }
  }

  // Compute newly unlocked achievements
  const newlyUnlocked: string[] = Array.from(unlocked).filter(
    (a) => !previouslyUnlocked.has(a)
  ) as string[];

  foundUser.unlockedAchievements = Array.from(unlocked);

  return newlyUnlocked;
}

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
    userTitle: (record.userId as unknown as { selectedTitle: string })
      .selectedTitle,
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
  const [
    recordsLvl25,
    recordsLvl26,
    recordsLvl27,
    recordsLvl40,
    recordsLvl41,
    recordsLvl42
  ] = await Promise.all([
    getTopRecords(foundUser, LEVELS.LVL_25),
    getTopRecords(foundUser, LEVELS.LVL_26),
    getTopRecords(foundUser, LEVELS.LVL_27),
    getTopRecords(foundUser, LEVELS.LVL_40),
    getTopRecords(foundUser, LEVELS.LVL_41),
    getTopRecords(foundUser, LEVELS.LVL_42)
  ]);

  const leaderboard25 = { levelId: LEVELS.LVL_25, records: recordsLvl25 };
  const leaderboard26 = { levelId: LEVELS.LVL_26, records: recordsLvl26 };
  const leaderboard27 = { levelId: LEVELS.LVL_27, records: recordsLvl27 };

  const leaderboard40 = { levelId: LEVELS.LVL_40, records: recordsLvl40 };
  const leaderboard41 = { levelId: LEVELS.LVL_41, records: recordsLvl41 };
  const leaderboard42 = { levelId: LEVELS.LVL_42, records: recordsLvl42 };

  // 3) Return leaderboards
  res.status(200).json({
    status: 'success',
    documents: [
      leaderboard25,
      leaderboard26,
      leaderboard27,
      leaderboard40,
      leaderboard41,
      leaderboard42
    ]
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

export const unlockTitle = catchAsync(async (req, res, next) => {
  // 1) Fetch all params
  const { title } = req.body;

  if (!title) {
    return next(new AppError('You have to provide which title to unlock', 500));
  }

  // 2) Find the user
  const foundUser = await User.findById(req.user.id);

  if (!foundUser) {
    return next(new AppError('No user found', 500));
  }
  const foundTitle = LocalTitles.find((t) => t.textStyle === title);
  if (!Object.keys(TITLES).includes(title) || !foundTitle) {
    return next(new AppError('Invalid TITLE name', 500));
  }

  if (foundUser.unlockedTitles.includes(title)) {
    return next(new AppError('User already has this title', 500));
  }

  if (foundUser.stars < foundTitle.cost) {
    return next(new AppError('Insufficient stars', 500));
  } else foundUser.stars -= foundTitle.cost;

  foundUser.unlockedTitles = [...foundUser.unlockedTitles, String(title)];
  foundUser.selectedTitle = String(title);

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

export const selectTitle = catchAsync(async (req, res, next) => {
  // 1) Fetch all params
  const { title } = req.body;

  if (!title) {
    return next(new AppError('You have to provide which title to select', 500));
  }

  // 2) Find the user
  const foundUser = await User.findById(req.user.id);

  if (!foundUser) {
    return next(new AppError('No user found', 500));
  }

  if (!Object.keys(TITLES).includes(title)) {
    return next(new AppError('Invalid TITLE name', 500));
  }

  if (!foundUser.unlockedTitles.includes(title)) {
    return next(new AppError("User hasn't unlocked this title yet", 500));
  }

  foundUser.selectedTitle = title;

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
