/**
 * 月影の探偵騎士団 - クラウド保存（Firebase）雛形
 * =====================================================
 * このファイルは「動作する実装」ではなく、クラウド保存を組み込む際の
 * テンプレートです。実際に使うには:
 *
 *   1. Firebaseコンソール（https://console.firebase.google.com）でプロジェクトを作成
 *   2. Authentication → Sign-in method → 「匿名」を有効化
 *   3. Firestore Database を作成（本番モードでOK。セキュリティルールは下記参照）
 *   4. このファイルを firebase-init.js としてコピーし、
 *      下の firebaseConfig に自分のプロジェクトの値を入力
 *   5. index.html の <head> に、このファイルより「前」に以下を追加：
 *
 *      <script type="module">
 *        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-app.js";
 *        import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";
 *        import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore.js";
 *        // ここで firebase-init.js の内容を実行し、window.TsukikageCloud を組み立てる
 *      </script>
 *
 *   ※ Firebase の各SDKはCDN経由のESモジュールとして配布されています。
 *     バージョン番号（10.x.x）は公式ドキュメントで最新版をご確認ください。
 *
 * ゲーム本体（index.html）は、window.TsukikageCloud が存在する場合のみ
 * クラウド保存を試みます。存在しない場合は、これまで通り端末内保存
 * （localStorage）のみで動作します。つまり、このファイルを用意しなくても
 * ゲームは問題なく遊べます。
 *
 * 期待するインターフェース（ゲーム本体側が呼び出す関数）:
 *   window.TsukikageCloud = {
 *     save(stateObject)   -> Promise<void>  ゲームのセーブデータをクラウドへ保存
 *     load()               -> Promise<object|null>  クラウド側のセーブデータを取得
 *     signInAnon()          -> Promise<void>  匿名ログイン（初回アクセス時などに呼ぶ）
 *   }
 */

// ---- 以下はサンプル実装（実際に使う場合はFirebase SDKの読み込み後に実行してください）----

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 以下は import 済みの firebase 関数が使える前提の擬似コードです。
// 実際に使う際は、上記モジュールスクリプト内にこの内容を移してください。
/*
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let currentUid = null;

async function signInAnon() {
  const cred = await signInAnonymously(auth);
  currentUid = cred.user.uid;
}

async function cloudSave(stateObject) {
  if (!currentUid) await signInAnon();
  await setDoc(doc(db, "saves", currentUid), {
    data: JSON.stringify(stateObject),
    updatedAt: Date.now()
  });
}

async function cloudLoad() {
  if (!currentUid) await signInAnon();
  const snap = await getDoc(doc(db, "saves", currentUid));
  if (!snap.exists()) return null;
  try { return JSON.parse(snap.data().data); } catch (e) { return null; }
}

window.TsukikageCloud = {
  save: cloudSave,
  load: cloudLoad,
  signInAnon
};
*/

// ---- 推奨 Firestore セキュリティルール ----
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /saves/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
*/
