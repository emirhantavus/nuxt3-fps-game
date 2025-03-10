import { db } from "@/composables/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { ref } from "vue";

const navbarItems = ref<{ name: string; link: string }[]>([]);

export const useNavbar = () => {
  const q = query(collection(db, "navbar"), orderBy("order")); 

  onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((doc) => ({
      name: doc.data().name, 
      link: doc.data().link, 
    }));

    navbarItems.value = [...items]; 
  });

  return { navbarItems };
};
