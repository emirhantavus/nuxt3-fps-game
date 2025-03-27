import { db } from "@/composables/firebase";
import { collection, getDocs, doc, getDoc, addDoc, Timestamp } from "firebase/firestore";
import { ref } from "vue";
import { useAuth } from "@/composables/auth";

const inventory = ref<any[]>([]);

export const useInventory = () => {
  const { currentUser } = useAuth();

  const loadInventory = async () => {
    if (!currentUser.value) return;

    const inventoryRef = collection(db, `inventory/${currentUser.value.uid}/items`);
    const snapshot = await getDocs(inventoryRef);

    const items = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    inventory.value = items;
  };

  const addItemToInventory = async (productId: string) => {
    if (!currentUser.value) return;

    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      console.error("Ürün bulunamadı.");
      return;
    }

    const productData = productSnap.data();
    const itemRef = doc(db, "items", productData.itemId);
    const itemSnap = await getDoc(itemRef);

    if (!itemSnap.exists()) {
      console.error("Item bilgisi bulunamadı.");
      return;
    }

    const itemData = itemSnap.data();

    await addDoc(collection(db, `inventory/${currentUser.value.uid}/items`), {
      productId,
      addedAt: Timestamp.now(),
      ...itemData,
    });
  };

  return {
    inventory,
    loadInventory,
    addItemToInventory,
  };
};
