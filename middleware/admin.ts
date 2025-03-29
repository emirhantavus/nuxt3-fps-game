import { useAuth } from "@/composables/auth";
import { db } from "@/composables/firebase";
import { doc, getDoc } from "firebase/firestore";
import { navigateTo } from "nuxt/app";

export default defineNuxtRouteMiddleware(async () => {
  const { currentUser } = useAuth();

  if (!currentUser.value) {
    return navigateTo("/login");
  }

  const userRef = doc(db, "users", currentUser.value.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists() || userSnap.data().role !== "admin") {
    return navigateTo("/");
  }
});
