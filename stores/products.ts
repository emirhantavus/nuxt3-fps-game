// stores/products.ts
import { defineStore } from "pinia";
import { db } from "@/composables/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export interface Product {
  id: string;
  price: number;
  category: string;
  image: string;
  itemId: string;
  item: {
    name: string;
    type: string;
    damage: number;
    ammo: number;
  };
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

        const productsWithItems = await Promise.all(
          querySnapshot.docs.map(async (docSnap) => {
            const data = docSnap.data();

            console.log("📦 Product doc:", docSnap.id, data);

            const itemRef = doc(db, "items", data.itemId);
            const itemSnap = await getDoc(itemRef);

            let item = {
              name: "Bilinmiyor",
              type: "",
              damage: 0,
              ammo: 0,
            };

            if (itemSnap.exists()) {
              const itemData = itemSnap.data();
              console.log("✅ Item found for product:", data.itemId, itemData);

              item = {
                name: itemData.name ?? "Bilinmiyor",
                type: itemData.type ?? "",
                damage: itemData.damage ?? 0,
                ammo: itemData.ammo ?? 0,
              };
            } else {
              console.warn("❌ Item not found for product:", data.itemId);
            }

            return {
              id: docSnap.id,
              price: data.price,
              category: data.category,
              image: data.image,
              itemId: data.itemId,
              item,
            };
          })
        );

        this.products = productsWithItems;

        console.log("🎯 Final product list:", this.products);
      } catch (error) {
        console.error("🛑 Ürünleri çekerken hata oluştu:", error);
      }
    },
  },
});
