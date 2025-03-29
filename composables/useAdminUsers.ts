// composables/useAdminUsers.ts
import { ref, onMounted } from "vue";
import { db } from "@/composables/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

export const useAdminUsers = () => {
  const users = ref<any[]>([]);
  const loading = ref(false);

  const fetchUsers = async () => {
    loading.value = true;
    const snap = await getDocs(collection(db, "users"));
    users.value = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    loading.value = false;
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { role: newRole });
    const user = users.value.find((u) => u.id === userId);
    if (user) user.role = newRole;
  };

  onMounted(fetchUsers);

  return { users, loading, updateUserRole };
};
