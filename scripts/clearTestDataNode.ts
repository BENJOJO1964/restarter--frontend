import admin from 'firebase-admin';
import * as path from 'path';

// 取得 serviceAccountKey.json 的絕對路徑
const serviceAccount = require(path.resolve(__dirname, 'serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function clearCollection(collName: string) {
  const snapshot = await db.collection(collName).get();
  for (const doc of snapshot.docs) {
    await doc.ref.delete();
  }
  console.log(`已清除 ${collName} collection`);
}

async function main() {
  await clearCollection('profiles');
  await clearCollection('invites');
  await clearCollection('links');
  await clearCollection('messages');
  // 其他功能的 collection 也可加在這裡
  console.log('所有測試資料已清除');
}

main();