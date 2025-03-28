import { db } from "@/composables/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { ref, watch } from "vue";
import { useAuth } from "@/composables/auth";

const balance = ref<number | null>(null);

export const useWallet = () => {
  const { currentUser, authLoaded } = useAuth();

  const fetchBalance = async () => {
    if (!authLoaded.value || !currentUser.value) return;

    const walletRef = doc(db, "wallets", currentUser.value.uid);
    const snap = await getDoc(walletRef);
    if (snap.exists()) {
      balance.value = snap.data().balance;
    }
  };

  const deposit = async (amount: number) => {
    if (!authLoaded.value || !currentUser.value) return;

    const walletRef = doc(db, "wallets", currentUser.value.uid);
    await updateDoc(walletRef, {
      balance: increment(amount),
    });

    balance.value = (balance.value || 0) + amount;
  };

  const deduct = async (amount: number) => {
    if (!authLoaded.value || !currentUser.value) return false;

    const walletRef = doc(db, "wallets", currentUser.value.uid);
    const snap = await getDoc(walletRef);
    const currentBalance = snap.exists() ? snap.data().balance : 0;

    if (currentBalance >= amount) {
      await updateDoc(walletRef, { balance: increment(-amount) });
      balance.value = currentBalance - amount;
      return true;
    }

    return false;
  };

  watch([authLoaded, currentUser], ([loaded, user]) => {
    if (loaded && user) {
      fetchBalance();
    }
  });

  return {
    balance,
    deposit,
    deduct,
  };
};
