<template>
      <div class="relative w-full h-screen flex items-center justify-center">
       
        <div class="absolute top-0 left-0 w-full h-full bg-cover bg-center" style="background-image: url('/foto1.png')"></div>
        
        <div class="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
    
        <div class="relative z-10 bg-valorantGray p-8 rounded-lg shadow-lg w-96 text-white">
          <h1 class="text-3xl font-bold mb-6 text-center">Kayıt Ol</h1>
          <form @submit.prevent="handleRegister">
            <div class="mb-4">
              <label class="block text-sm font-medium">E-Posta</label>
              <input v-model="email" type="email" required class="w-full p-2 bg-black text-white border border-gray-600 rounded-lg"/>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium">Şifre</label>
              <input v-model="password" type="password" required class="w-full p-2 bg-black text-white border border-gray-600 rounded-lg"/>
            </div>
            <button type="submit" class="bg-valorantRed px-4 py-2 rounded-lg w-full font-bold hover:opacity-80">
              Kayıt Ol
            </button>
            <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
          </form>
          <p class="text-center text-sm mt-4">
            Zaten bir hesabın var mı?
            <NuxtLink to="/login" class="text-valorantRed">Giriş Yap</NuxtLink>
          </p>
        </div>
      </div>
      <Footer />
    </template>
    
    <script setup lang="ts">
    import { ref } from "vue";
    import { useRouter } from "vue-router";
    import { registerUser } from "@/composables/auth";
    
    const email = ref("");
    const password = ref("");
    const errorMessage = ref<string | null>(null);
    const router = useRouter();
    
    const handleRegister = async () => {
      try {
        await registerUser(email.value, password.value);
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        router.push("/login");
      } catch (error) {
        errorMessage.value = "Kayıt sırasında hata oluştu.";
      }
    };
    </script>
    