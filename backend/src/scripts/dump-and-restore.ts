// import { execSync } from 'child_process';
// import path from 'path';
// import fs from 'fs';
//
// const { DB_CONNECTION_STRING, DB_CONNECTION_STRING_LOCAL } = process.env;
//
// if (!DB_CONNECTION_STRING || !DB_CONNECTION_STRING_LOCAL) {
//   console.error('❌ Missing required env variables');
//   process.exit(1);
// }
//
// const BACKUP_DIR = path.resolve('mongo-backup');
//
// function run(cmd: string) {
//   console.log(`\n▶ ${cmd}\n`);
//   execSync(cmd, { stdio: 'inherit' });
// }
//
// function assertBackupExists() {
//   const dbPath = DB_CONNECTION_STRING as string;
//   if (!fs.existsSync(dbPath)) {
//     console.error(`❌ Backup folder not found: ${dbPath}`);
//     process.exit(1);
//   }
// }
//
// console.log('🟢 MongoDB Dump & Restore Script');
// console.log('--------------------------------');
// console.log(`📁 BACKUP DIR: ${BACKUP_DIR}`);
//
// /* 1️⃣ Dump */
// run(`mongodump --uri="${MONGO_PROD_URI}" --db=${DB_NAME} --out=${BACKUP_DIR}`);
//
// /* 2️⃣ Verify dump */
// assertBackupExists();
//
// /* 3️⃣ Restore */
// run(
//   `mongorestore \
//     --uri="${MONGO_LOCAL_URI}" \
//     --nsFrom="${DB_NAME}.*" \
//     --nsTo="${LOCAL_DB_NAME}.*" \
//     ${BACKUP_DIR}`
// );
//
// console.log('\n✅ Done. Local database is ready.');
