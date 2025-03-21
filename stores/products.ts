import { defineStore } from "pinia";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export const useProductStore = defineStore("products", {
  state: () => ({
    products: [] as Product[]
  }),

  getters: {
    getByCategory: (state) => (category: string) => {
      if (category === "Tümü") return state.products;
      return state.products.filter((p) => p.category === category);
    }
  },

  actions: {
    setProducts(data: Product[]) {
      this.products = data;
    }
  }
});
