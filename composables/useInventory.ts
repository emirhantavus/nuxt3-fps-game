import { ref } from "vue";
import { db } from "@/composables/firebase";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/composables/auth";

interface InventoryItem {
  id: string;
  productId: string;
  addedAt: Date;
  name: string;
  price: number;
  image: string;
}

const inventory = ref<InventoryItem[]>([]);

export const useInventory = () => {
  const { currentUser } = useAuth();

  const loadInventory = async () => {
    if (!currentUser.value) return;

    const querySnapshot = await getDocs(collection(db, `inventory/${currentUser.value.uid}/items`));

    const itemPromises = querySnapshot.docs.map(async (docSnapshot) => {
      const itemData = docSnapshot.data();
      const productRef = doc(db, "products", itemData.productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) return null;

      const productData = productSnap.data();

      return {
        id: docSnapshot.id,
        productId: itemData.productId,
        addedAt: itemData.addedAt?.toDate?.() || new Date(),
        name: productData.name,
        price: productData.price,
        image: productData.image,
      };
    });

    const results = await Promise.all(itemPromises);
    inventory.value = results.filter((item) => item !== null) as InventoryItem[];
  };

  const addItemToInventory = async (productId: string) => {
    if (!currentUser.value) return;

    await addDoc(collection(db, `inventory/${currentUser.value.uid}/items`), {
      productId,
      addedAt: new Date(),
    });
  };

  return {
    inventory,
    loadInventory,
    addItemToInventory,
  };
};
