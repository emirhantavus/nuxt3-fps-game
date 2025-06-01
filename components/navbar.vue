<template>
  <nav class="fixed top-0 left-0 w-full bg-valorantDark/90 backdrop-blur-md shadow-md z-50">
    <div class="container mx-auto flex justify-between items-center py-3 px-4">
      <!-- Logo -->
      <NuxtLink to="/">
        <h1 class="text-xl sm:text-2xl font-bold text-valorantRed tracking-wider select-none">FPS Oyun</h1>
      </NuxtLink>

      <!-- Hamburger Menü (Mobil) -->
      <button
        @click="mobileMenu = !mobileMenu"
        class="sm:hidden text-white focus:outline-none focus:ring-2 focus:ring-valorantRed rounded p-1"
      >
        <svg v-if="!mobileMenu" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Menü (Büyük Ekran) -->
      <ul class="hidden sm:flex items-center space-x-5">
        <li
          v-for="(item, index) in filteredNavbarItems"
          :key="index"
        >
          <NuxtLink
            :to="item.link"
            class="text-white hover:text-valorantRed transition-all px-2 py-1"
          >
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>

      <!-- Sağ Alan (Sepet, Profil, Giriş/Çıkış) -->
      <div class="hidden sm:flex items-center space-x-4">
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
          <img :src="currentUser.photoURL || '/avatar.png'" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-white object-cover" />
        </NuxtLink>
        <button
          v-if="currentUser"
          @click="handleLogout"
          class="bg-red-600 px-4 py-2 rounded-lg text-white font-bold hover:opacity-80 transition-all"
        >
          Çıkış Yap
        </button>
        <NuxtLink v-else to="/login">
          <button class="bg-valorantRed px-4 py-2 rounded-lg text-white font-bold hover:opacity-80 transition-all">
            Giriş Yap
          </button>
        </NuxtLink>
      </div>
    </div>

    <!-- Mobil Menü -->
    <transition name="fade">
      <div v-if="mobileMenu" class="sm:hidden bg-valorantDark/95 backdrop-blur-xl absolute top-full left-0 w-full shadow-lg">
        <ul class="flex flex-col gap-2 py-4 px-4">
          <li
            v-for="(item, index) in filteredNavbarItems"
            :key="'m'+index"
          >
            <NuxtLink
              :to="item.link"
              class="block w-full text-left text-white hover:text-valorantRed px-2 py-2 rounded transition-all"
              @click="mobileMenu = false"
            >
              {{ item.name }}
            </NuxtLink>
          </li>
          <li class="flex items-center gap-3 mt-3">
            <NuxtLink to="/cart" class="relative group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white group-hover:text-valorantRed transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.293 2.293a1 1 0 00.293 1.414l1 1M7 13l1 1m0 0l-1 1m1-1h9m-5 5a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              <span v-if="cart.items.length" class="absolute -top-2 -right-2 bg-valorantRed text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {{ cart.items.length }}
              </span>
            </NuxtLink>
            <NuxtLink v-if="currentUser" to="/profile" @click="mobileMenu = false">
              <img :src="currentUser.photoURL || '/avatar.png'" alt="Avatar" class="w-10 h-10 rounded-full border-2 border-white object-cover" />
            </NuxtLink>
            <button
              v-if="currentUser"
              @click="handleLogout"
              class="bg-red-600 px-4 py-2 rounded-lg text-white font-bold hover:opacity-80 transition-all"
            >
              Çıkış Yap
            </button>
            <NuxtLink v-else to="/login" @click="mobileMenu = false">
              <button class="bg-valorantRed px-4 py-2 rounded-lg text-white font-bold hover:opacity-80 transition-all">
                Giriş Yap
              </button>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuth } from "@/composables/auth";
import { useNavbar } from "@/composables/useNavbar";
import type { NavbarItem } from "@/composables/useNavbar";
import { useCartStore } from "@/stores/cart";

const mobileMenu = ref(false);

const { currentUser, logoutUser } = useAuth();
const { navbarItems } = useNavbar();
const cart = useCartStore();

const filteredNavbarItems = computed(() =>
  navbarItems.value.filter((item: NavbarItem) => !item.authOnly || !!currentUser.value)
);

const handleLogout = async () => {
  await logoutUser();
  mobileMenu.value = false;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .25s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
