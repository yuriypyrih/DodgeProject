// Database connection
import connectDB from '../database';
import { User } from '../models/userModel';

const migrationScript = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('Connected to the database');

    // Migration: add title & achievement fields if missing
    const result = await User.updateMany(
      {
        $or: [
          { unlockedTitles: { $exists: false } },
          { unlockedAchievements: { $exists: false } },
          { harvestedLevels: { $exists: false } },
          { selectedTitle: { $exists: false } },
          { paidTransactions: { $exists: false } }
        ]
      },
      {
        $set: {
          unlockedTitles: ['DEFAULT'],
          unlockedAchievements: [],
          harvestedLevels: [],
          selectedTitle: 'DEFAULT',
          paidTransactions: []
        }
      },
      {
        runValidators: false // migrations should bypass validators
      }
    );

    console.log('Migration Script Completed');
    console.log(`Matched: ${result.matchedCount}`);
    console.log(`Modified: ${result.modifiedCount}`);
  } catch (error) {
    console.error('Migration Script Error:', error);
  } finally {
    process.exit(0);
  }
};

// Run the migration
migrationScript();
