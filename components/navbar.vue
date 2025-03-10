<template>
  <nav class="absolute top-0 left-0 w-full bg-valorantDark/90 backdrop-blur-md p-4 shadow-md z-50">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold text-valorantRed tracking-wider">FPS Oyun</h1>
      
      <!-- Dinamik Navbar Butonları -->
      <ul class="flex space-x-6">
        <li v-for="(item, index) in navbarItems" :key="index">
          <NuxtLink v-if="item.link" :to="item.link" class="text-white hover:text-valorantRed transition-all">
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>

      <!-- Giriş / Çıkış Butonları -->
      <div class="flex items-center space-x-4">
        <NuxtLink v-if="currentUser" to="/profile">
          <img :src="currentUser.photoURL || '/default-avatar.png'" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-white"/>
        </NuxtLink>
        
        <button v-if="currentUser" @click="handleLogout" class="bg-red-600 px-4 py-2 rounded-lg text-white font-bold hover:opacity-80 transition-all">
          Çıkış Yap
        </button>

        <NuxtLink v-else to="/login">
          <button class="bg-valorantRed px-4 py-2 rounded-lg text-white font-bold hover:opacity-80 transition-all">
            Giriş Yap
          </button>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuth } from "@/composables/auth";
import { useNavbar } from "@/composables/navbar";
import { onMounted } from "vue";

const { currentUser, logoutUser } = useAuth();
const { navbarItems } = useNavbar(); 

onMounted(() => {
  
});

const handleLogout = async () => {
  await logoutUser();
};
</script>
