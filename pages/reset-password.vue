<template>
      <div class="relative w-full h-screen flex items-center justify-center">
        
        <div class="absolute top-0 left-0 w-full h-full bg-cover bg-center" style="background-image: url('/foto1.png')"></div>
        
        <div class="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
    
        <div class="relative z-10 bg-valorantGray p-8 rounded-lg shadow-lg w-96 text-white text-center">
          <h1 class="text-3xl font-bold mb-6">Şifremi Unuttum</h1>
          <form @submit.prevent="handleResetPassword">
            <div class="mb-4">
              <label class="block text-sm font-medium">E-Posta</label>
              <input v-model="email" type="email" required class="w-full p-2 bg-black text-white border border-gray-600 rounded-lg"/>
            </div>
            <button type="submit" class="bg-valorantRed px-4 py-2 rounded-lg w-full font-bold hover:opacity-80">
              Şifre Sıfırlama Linki Gönder
            </button>
            <p v-if="message" class="text-green-400 mt-2">{{ message }}</p>
            <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
          </form>
          <p class="text-center text-sm mt-4">
            <NuxtLink to="/login" class="text-valorantRed">Giriş Sayfasına Dön</NuxtLink>
          </p>
        </div>
      </div>
      <Footer />
</template>
    
<script setup lang="ts">
import { ref } from "vue";
import { resetPassword } from "@/composables/auth";

const email = ref("");
const message = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const handleResetPassword = async () => {
  try {
    message.value = await resetPassword(email.value);
  } catch (error) {
    errorMessage.value = "Şifre sıfırlama sırasında hata oluştu.";
  }
};
</script>
    