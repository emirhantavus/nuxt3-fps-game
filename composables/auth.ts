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
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/composables/firebase";

// 👤 Global state
const currentUser = ref<User | null>(null);
const authLoaded = ref(false);

// 🔁 Oturum kontrolü
onAuthStateChanged(auth, (user) => {
  console.log("👤 onAuthStateChanged çalıştı:", user?.email || "Anonim");
  currentUser.value = user;
  authLoaded.value = true;
});

// 🔓 Kullanılabilir composable
export const useAuth = () => {
  return { currentUser, authLoaded, logoutUser };
};

// 🆕 Kayıt + Firestore işlemleri
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    console.log("✅ Auth başarıyla oluşturuldu:", uid);

    // Firestore > wallets
    await setDoc(doc(db, "wallets", uid), { balance: 0 });
    console.log("💰 Wallet oluşturuldu");

    // Firestore > users
    await setDoc(doc(db, "users", uid), {
      email,
      role: "user",
      photoURL: "/avatars/avatar1.png",
      createdAt: serverTimestamp(),
    });
    console.log("🗂️ Firestore > users kaydedildi");

    // Firebase Auth profilini güncelle
    await updateProfile(userCredential.user, {
      photoURL: "/avatars/avatar1.png",
    });

    return userCredential.user;
  } catch (error) {
    console.error("❌ registerUser hatası:", error);
    throw error;
  }
};

// 🔐 Giriş
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Giriş başarılı:", userCredential.user.email);
    return userCredential.user;
  } catch (error) {
    console.error("❌ loginUser hatası:", error);
    throw error;
  }
};

// 🚪 Çıkış
export const logoutUser = async () => {
  try {
    await signOut(auth);
    currentUser.value = null;
    console.log("👋 Çıkış yapıldı");
  } catch (error) {
    console.error("❌ logoutUser hatası:", error);
    throw error;
  }
};

// 🔁 Şifre sıfırlama
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("📩 Şifre sıfırlama e-postası gönderildi");
  } catch (error) {
    console.error("❌ resetPassword hatası:", error);
    throw error;
  }
};

// 🔒 Şifre güncelleme
export const updateUserPassword = async (newPassword: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Giriş yapılmamış.");
  await updatePassword(user, newPassword);
  console.log("🔐 Şifre güncellendi");
};

// 🖼️ Avatar güncelleme
export const uploadAvatar = async (file: File) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Giriş yapılmamış.");

  const storage = getStorage();
  const fileRef = storageRef(storage, `avatars/${user.uid}`);
  await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);
  await updateProfile(user, { photoURL });

  console.log("🖼️ Avatar güncellendi:", photoURL);
  return photoURL;
};
