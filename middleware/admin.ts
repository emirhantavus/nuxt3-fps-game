import { useAuth } from "@/composables/auth";
import { db } from "@/composables/firebase";
import { doc, getDoc } from "firebase/firestore";

export default defineNuxtRouteMiddleware(async () => {
  const { currentUser, authLoaded } = useAuth();

  if (process.server) return;

  // 1. auth henüz yüklenmemişse, bekle!
  if (!authLoaded.value) {
    return new Promise<void>((resolve) => {
      const stop = watch(authLoaded, (loaded) => {
        if (loaded) {
          stop(); // unwatch
          resolve();
        }
      });
    });
  }

  // 2. Giriş yapılmamışsa
  if (!currentUser.value) {
    return navigateTo("/login");
  }

  // 3. Firestore'dan role bilgisini çek
  const userDoc = await getDoc(doc(db, "users", currentUser.value.uid));
  const userData = userDoc.exists() ? userDoc.data() : null;

  // 4. admin değilse
  if (!userData || userData.role !== "admin") {
    return navigateTo("/login");
  }
});
