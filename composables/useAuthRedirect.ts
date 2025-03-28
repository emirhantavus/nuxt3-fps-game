import { useAuth } from "@/composables/auth";
import { useRouter } from "vue-router";
import { watch } from "vue";

export const useAuthRedirect = () => {
  const { currentUser, authLoaded } = useAuth();
  const router = useRouter();

  watch(
    [authLoaded, currentUser],
    ([loaded, user]) => {
      console.log("🔐 Yönlendirme Kontrolü:", { loaded, user });
      if (process.client && loaded && user === null) {
        router.push("/login");
      }
    },
    { immediate: true }
  );
};
