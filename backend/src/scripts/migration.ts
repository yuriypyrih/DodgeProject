// Database connection URI
import connectDB from '../database';
import { AUGMENTS } from '../data/AUGMENTS';
import { User } from '../models/userModel';

// Migration function
const migrationScript = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('Connected to the database');

    // Actual Migration
    // await User.updateMany(
    //   { unlockedRelics: { $ne: AUGMENTS.HACKED } },
    //   { $addToSet: { unlockedRelics: AUGMENTS.HACKED } },
    //   { runValidators: false } // Disable validators for this operation
    // );

    await User.updateMany(
      { completeLevels: { $exists: false } },
      { $set: { completeLevels: [] } },
      { runValidators: false } // Disable validators for this operation
    );

    console.log('Migration Script Completed');
  } catch (error) {
    console.error('Migration Script Error:', error);
  }
};

// Run the migration
migrationScript();
