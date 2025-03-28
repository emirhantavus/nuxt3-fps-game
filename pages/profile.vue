<template>
  <div class="relative w-full min-h-screen bg-valorantGray">
    <Navbar class="fixed top-0 left-0 w-full z-50" />

    <div class="w-full flex flex-col items-center justify-center pt-24"> 
      <div class="absolute top-0 left-0 w-full h-full bg-cover bg-center" style="background-image: url('/foto1.png')"></div>
      <div class="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>

      <div
        v-if="authLoaded && currentUser"
        class="relative z-10 bg-valorantGray p-8 rounded-lg shadow-lg w-96 text-white text-center"
      >
        <h1 class="text-3xl font-bold mb-6">Profil Bilgileri</h1>
        
        <div class="relative inline-block">
          <img :src="userProfile.photoURL || '/avatar.png'" alt="Avatar" class="w-24 h-24 rounded-full mx-auto border-4 border-white mb-4"/>
          <input type="file" @change="handleAvatarSelect" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"/>
        </div>

        <p class="text-sm text-gray-400">Yeni avatar seçmek için fotoğrafa tıklayın.</p>
        <p class="text-lg mt-4"><strong>E-Posta:</strong> {{ currentUser.email }}</p>
        <p class="text-lg"><strong>UID:</strong> {{ currentUser.uid }}</p>

        <button @click="handleAvatarUpload" class="mt-4 bg-valorantRed px-4 py-2 rounded-lg w-full font-bold hover:opacity-80">
          Profili Güncelle
        </button>

        <p v-if="message" class="text-green-400 mt-2">{{ message }}</p>
        <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>

        <NuxtLink to="/update-password" class="block mt-4 text-valorantRed">Şifreni Güncelle</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth, uploadAvatar } from "@/composables/auth";
import { useRouter } from "vue-router";
import { watchEffect, ref, reactive } from "vue";
import Navbar from "@/components/navbar.vue";
import { useAuthRedirect } from "@/composables/useAuthRedirect";
useAuthRedirect();

const { currentUser, authLoaded } = useAuth();
const router = useRouter();

const message = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const userProfile = reactive({
  photoURL: currentUser.value?.photoURL || "/avatar.png",
  selectedFile: null as File | null,
});

watchEffect(() => {
  if (authLoaded.value && !currentUser.value) {
    router.push("/login");
  }

  if (currentUser.value) {
    userProfile.photoURL = currentUser.value.photoURL || "/avatar.png";
  }
});

const handleAvatarSelect = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  userProfile.selectedFile = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    userProfile.photoURL = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const handleAvatarUpload = async () => {
  if (!userProfile.selectedFile) {
    errorMessage.value = "Lütfen bir resim seçin.";
    return;
  }

  try {
    const photoURL = await uploadAvatar(userProfile.selectedFile);
    userProfile.photoURL = photoURL;
    message.value = "Avatar başarıyla güncellendi!";
    userProfile.selectedFile = null;
  } catch (error) {
    errorMessage.value = "Avatar yüklenirken hata oluştu.";
  }
};
</script>
