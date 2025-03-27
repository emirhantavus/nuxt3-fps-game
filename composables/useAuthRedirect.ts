import { useAuth } from "@/composables/auth";
import { useRouter } from "vue-router";
import { watchEffect } from "vue";

export const useAuthRedirect = () => {
  const { currentUser } = useAuth();
  const router = useRouter();

  watchEffect(() => {
    if (process.client) {
      if (currentUser.value === null) {
        router.push("/login");
      }
    }
  });
};
