import { defineStore } from "pinia";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + item.quantity * item.price, 0),
  },

  actions: {
    addToCart(product: CartItem) {
      const existingItem = this.items.find((item) => item.id === product.id);
      if (existingItem) {
        return;
      } else {
        this.items.push(product);
      }
      this.saveCart();
    },

    removeFromCart(productId: string) {
      this.items = this.items.filter((item) => item.id !== productId);
      this.saveCart();
    },

    clearCart() {
      this.items = [];
      localStorage.removeItem("cart");
    },

    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.items));
    },

    loadCart() {
      const saved = localStorage.getItem("cart");
      if (saved) {
        this.items = JSON.parse(saved);
      }
    },
  },
});
