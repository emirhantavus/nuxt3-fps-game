import { useAuth } from "@/composables/auth";
import { db } from "@/composables/firebase";
import { doc, getDoc } from "firebase/firestore";

export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return;

  const { currentUser, authLoaded } = useAuth();

  if (!authLoaded.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(authLoaded, (loaded) => {
        if (loaded) {
          stop();
          resolve();
        }
      });
    });
  }

  if (!currentUser.value) {
    return navigateTo("/login");
  }

  const snap = await getDoc(doc(db, "users", currentUser.value.uid));
  const data = snap.exists() ? snap.data() : null;

  if (!data || data.role !== "admin") {
    return navigateTo("/login");
  }

  // 👇 Layout'u middleware içinde ayarlıyoruz
  setPageLayout("admin");
});
