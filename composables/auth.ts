import { auth } from "@/composables/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  updateProfile,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { ref } from "vue";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/composables/firebase";

const currentUser = ref<User | null>(null);
const authLoaded = ref(false);

onAuthStateChanged(auth, (user) => {
  console.log("👤 onAuthStateChanged çalıştı:", user?.email || "Anonim");
  currentUser.value = user;
  authLoaded.value = true;
});

export const useAuth = () => {
  return { currentUser, logoutUser, authLoaded };
};

export const registerUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "wallets", userCredential.user.uid), { balance: 0 });
  return userCredential.user;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
  currentUser.value = null;
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const updateUserPassword = async (newPassword: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Giriş yapılmamış.");
  await updatePassword(user, newPassword);
};

export const uploadAvatar = async (file: File) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Giriş yapılmamış.");

  const storage = getStorage();
  const fileRef = storageRef(storage, `avatars/${user.uid}`);
  await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);
  await updateProfile(user, { photoURL });
  return photoURL;
};
