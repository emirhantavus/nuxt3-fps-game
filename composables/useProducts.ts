import { ref, onMounted } from "vue";
import { db } from "@/composables/firebase";
import { collection, getDocs } from "firebase/firestore";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}


const products = ref<Product[]>([]);

export const useProducts = () => {
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      products.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
            ...doc.data(),
        
      })) as any;
    } catch (error) {
      console.error("Ürünler çekilirken hata oluştu:", error);
        }
  };

  onMounted(fetchProducts);

  return { products, fetchProducts };
};
