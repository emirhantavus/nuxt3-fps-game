import { db } from "@/composables/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  Timestamp,
  query,
  where,
} from "firebase/firestore";
import { ref } from "vue";
import { useAuth } from "@/composables/auth";

const inventory = ref<any[]>([]);

export const useInventory = () => {
  const { currentUser } = useAuth();

  const loadInventory = async () => {
    if (!currentUser.value) return;

    const inventoryRef = collection(db, `inventory/${currentUser.value.uid}/items`);
    const snapshot = await getDocs(inventoryRef);

    const items: any[] = [];

    for (const docSnap of snapshot.docs) {
      const invData = docSnap.data();

      const productRef = doc(db, "products", invData.productId);
      const productSnap = await getDoc(productRef);

      let image = "";
      if (productSnap.exists()) {
        const productData = productSnap.data();
        image = productData.image;
      }

      items.push({
        id: docSnap.id,
        ...invData,
        image,
      });
    }

    inventory.value = items;
  };

  const addItemToInventory = async (productId: string) => {
    if (!currentUser.value) return false;

    const inventoryRef = collection(db, `inventory/${currentUser.value.uid}/items`);
    const existingQuery = query(inventoryRef, where("productId", "==", productId));
    const existingSnapshot = await getDocs(existingQuery);

    if (!existingSnapshot.empty) {
      console.warn("Bu ürün zaten envanterde var.");
      return false;
    }

    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      console.error("Ürün bulunamadı.");
      return false;
    }

    const productData = productSnap.data();
    const itemRef = doc(db, "items", productData.itemId);
    const itemSnap = await getDoc(itemRef);

    if (!itemSnap.exists()) {
      console.error("Item bilgisi bulunamadı.");
      return false;
    }

    const itemData = itemSnap.data();

    await addDoc(inventoryRef, {
      productId,
      addedAt: Timestamp.now(),
      ...itemData,
    });

    return true;
  };

  return {
    inventory,
    loadInventory,
    addItemToInventory,
  };
};
