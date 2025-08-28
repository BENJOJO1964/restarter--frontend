import { db } from '../src/firebaseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

async function clearCollection(collName: string) {
  const colRef = collection(db, collName);
  const snapshot = await getDocs(colRef);
  for (const d of snapshot.docs) {
    await deleteDoc(doc(db, collName, d.id));
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