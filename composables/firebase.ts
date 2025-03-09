import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyC5xHB8P3xpkHz1BED1PrRZpCFgkyRm_hg",
  authDomain: "fps-game-1ff14.firebaseapp.com",
  projectId: "fps-game-1ff14",
  storageBucket: "fps-game-1ff14.firebasestorage.app",
  messagingSenderId: "338169875583",
  appId: "1:338169875583:web:b60de270a43f4cab0dc34a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };