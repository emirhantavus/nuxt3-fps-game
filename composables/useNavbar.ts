import { ref } from "vue";
import { db } from "@/composables/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

// ✅ NavbarItem tipini dışa aktar
export interface NavbarItem {
  name: string;
  link: string;
  order: number;
  authOnly?: boolean;
}

const navbarItems = ref<NavbarItem[]>([]);

export const useNavbar = () => {
  const q = query(collection(db, "navbar"), orderBy("order"));

  onSnapshot(q, (snapshot) => {
    navbarItems.value = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        name: data.name,
        link: data.link,
        order: data.order,
        authOnly: data.authOnly ?? false,
      };
    });
  });

  return { navbarItems };
};
