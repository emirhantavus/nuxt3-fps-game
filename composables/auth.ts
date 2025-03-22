import { auth } from "@/composables/firebase";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  sendPasswordResetEmail, updatePassword, updateProfile
} from "firebase/auth";
import { ref } from "vue";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

const currentUser = ref<User | null>(null);

onAuthStateChanged(auth, (user) => {
  currentUser.value = user;
});

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "wallets", userCredential.user.uid), {
      balance: 0,
    });
    return userCredential.user;
  } catch (error) {
    console.error("Kayıt sırasında hata oluştu:", error);
    throw error;
  }
};


export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Giriş sırasında hata oluştu:", error);
    throw error;
  }
};


export const logoutUser = async () => {
  try {
    await signOut(auth);
    currentUser.value = null;
  } catch (error) {
    console.error("Çıkış sırasında hata oluştu:", error);
    throw error;
  }
};

export const useAuth = () => {
  return { currentUser, logoutUser };
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return "Şifre sıfırlama bağlantısı e-posta adresinize iletildi.";
  } catch (error) {
    console.error("Şifre sıfırlama sırasında hata oluştu:", error);
    throw error;
  }
  
};

export const updateUserPassword = async (newPassword: string) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Giriş yapmış bir kullanıcı bulunamadı.")
    }
    await updatePassword(user, newPassword);
    return "Şifre başarıyla güncellendi.";
  } catch (error){
    console.error("Şifre güncelleme sırasında hata oluştu:", error)
    throw error;
  }
}

export const uploadAvatar = async (file: File) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Giriş yapmış bir kullanıcı bulunamadı.");

    const storage = getStorage();
    const fileRef = storageRef(storage, `avatars/${user.uid}`);
    
    await uploadBytes(fileRef, file);
    
    const photoURL = await getDownloadURL(fileRef);
    
    await updateProfile(user, { photoURL });

    return photoURL;
  } catch (error) {
    console.error("Avatar yükleme sırasında hata oluştu:", error);
    throw error;
  }
};