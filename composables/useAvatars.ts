import { db } from "@/composables/firebase";
import { collection, getDocs } from "firebase/firestore";
import { ref } from "vue";

const avatars = ref<string[]>([]);

export const useAvatars = () => {
  const loadAvatars = async () => {
    const snapshot = await getDocs(collection(db, "avatars"));
    avatars.value = snapshot.docs.map((doc) => doc.data().url);
  };

  return { avatars, loadAvatars };
};
