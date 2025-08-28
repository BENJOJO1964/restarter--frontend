const admin = require('firebase-admin');
const path = require('path');

// 使用絕對路徑取得 serviceAccountKey.json
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

console.log('載入 service account 檔案:', serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function clearCollection(collName) {
  try {
    const snapshot = await db.collection(collName).get();
    console.log(`找到 ${snapshot.docs.length} 個文件在 ${collName} collection`);
    
    for (const doc of snapshot.docs) {
      await doc.ref.delete();
    }
    console.log(`已清除 ${collName} collection`);
  } catch (error) {
    console.error(`清除 ${collName} 時發生錯誤:`, error.message);
  }
}

async function main() {
  try {
    console.log('開始清除測試資料...');
    await clearCollection('profiles');
    await clearCollection('invites');
    await clearCollection('links');
    await clearCollection('messages');
    // 其他功能的 collection 也可加在這裡
    console.log('所有測試資料已清除完成');
  } catch (error) {
    console.error('清除資料時發生錯誤:', error);
  } finally {
    process.exit(0);
  }
}

main(); 