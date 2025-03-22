import { db } from "@/composables/firebase";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { useAuth } from "@/composables/auth";
import { ref, onMounted } from "vue";

const balance = ref<number>(0);

export const useWallet = () => {
  const { currentUser } = useAuth();

  // Kullanıcının cüzdan bilgilerini Firestore'dan al
  const loadWallet = async () => {
    if (!currentUser.value) return;

    const walletRef = doc(db, "wallets", currentUser.value.uid);
    const snapshot = await getDoc(walletRef);

    if (snapshot.exists()) {
      balance.value = snapshot.data().balance;
    } else {
      // İlk defa kayıt olan kullanıcı için varsayılan cüzdan oluştur
      await setDoc(walletRef, { balance: 0 });
      balance.value = 0;
    }
  };

  // Bakiye yükleme
  const deposit = async (amount: number) => {
    if (!currentUser.value) return;

    const walletRef = doc(db, "wallets", currentUser.value.uid);
    await updateDoc(walletRef, { balance: increment(amount) });
    balance.value += amount;
  };

  // Ürün satın alındığında bakiye düşürme
  const deduct = async (amount: number): Promise<boolean> => {
    if (!currentUser.value) return false;

    if (balance.value < amount) return false;

    const walletRef = doc(db, "wallets", currentUser.value.uid);
    await updateDoc(walletRef, { balance: increment(-amount) });
    balance.value -= amount;
    return true;
  };

  onMounted(loadWallet);

  return {
    balance,
    loadWallet,
    deposit,
    deduct,
  };
};
