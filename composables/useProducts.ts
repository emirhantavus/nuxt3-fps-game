import { onMounted } from "vue";
import { db } from "@/composables/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useProductStore } from "@/stores/products";

export const useProducts = () => {
  const store = useProductStore();

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          image: data.image,
        };
      });

      store.setProducts(products);
    } catch (error) {
      console.error("Ürünler çekilirken hata oluştu:", error);
    }
  };

  onMounted(fetchProducts);

  return { fetchProducts };
};
