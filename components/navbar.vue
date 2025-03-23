<template>
  <nav class="absolute top-0 left-0 w-full bg-valorantDark/90 backdrop-blur-md p-4 shadow-md z-50">
    <div class="container mx-auto flex justify-between items-center">
      
      <NuxtLink to="/">
        <h1 class="text-2xl font-bold text-valorantRed tracking-wider">FPS Oyun</h1>
      </NuxtLink>

      <ul class="flex space-x-6">
        <li
          v-for="(item, index) in filteredNavbarItems"
          :key="index"
        >
          <NuxtLink
            :to="item.link"
            class="text-white hover:text-valorantRed transition-all"
          >
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>

      <div class="flex items-center space-x-4">
        <NuxtLink to="/cart" class="relative group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white group-hover:text-valorantRed transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.293 2.293a1 1 0 00.293 1.414l1 1M7 13l1 1m0 0l-1 1m1-1h9m-5 5a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
          <span v-if="cart.items.length" class="absolute -top-2 -right-2 bg-valorantRed text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
            {{ cart.items.length }}
          </span>
        </NuxtLink>

        <NuxtLink v-if="currentUser" to="/profile">
          <img :src="currentUser.photoURL || '/default-avatar.png'" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-white" />
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
import { computed } from "vue";
import { useAuth } from "@/composables/auth";
import { useNavbar } from "@/composables/useNavbar";
import type { NavbarItem } from "@/composables/useNavbar";
import { useCartStore } from "@/stores/cart";

const { currentUser, logoutUser } = useAuth();
const { navbarItems } = useNavbar();
const cart = useCartStore();

const filteredNavbarItems = computed(() =>
  navbarItems.value.filter((item: NavbarItem) => {
    console.log("🧪 item:", item.name, "| authOnly:", item.authOnly, "| typeof:", typeof item.authOnly);
    return !item.authOnly || !!currentUser.value;
  })
);

const handleLogout = async () => {
  await logoutUser();
};
</script>
