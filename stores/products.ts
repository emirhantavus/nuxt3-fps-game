import { defineStore } from "pinia";
import { db } from "@/composables/firebase";
import { collection, getDocs } from "firebase/firestore";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export const useProductStore = defineStore("products", {
  state: () => ({
    products: [] as Product[],
  }),

  getters: {
    getByCategory: (state) => (category: string) => {
      if (category === "Tümü") return state.products;
      return state.products.filter((p) => p.category === category);
    },
    getById: (state) => (id: string) => {
      return state.products.find((p) => p.id === id);
    },
  },

  actions: {
    async fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        this.products = querySnapshot.docs.map((doc) => {
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
      } catch (error) {
        console.error("Ürünleri çekerken hata oluştu:", error);
      }
    },
  },
});
