<template>
  <div class="w-full min-h-screen bg-valorantDark text-white pb-20">
    <Navbar class="fixed top-0 left-0 w-full z-50" />
    <div class="container mx-auto pt-28 px-6">
      <h1 class="text-4xl font-bold text-valorantRed mb-6">Envanterim</h1>
      <div v-if="inventory.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="item in inventory" :key="item.id" class="bg-gray-800 p-4 rounded-lg shadow">
          <img :src="item.image" alt="" class="w-full h-32 object-cover rounded mb-2" />
          <h2 class="text-lg font-bold mb-1">{{ item.name }}</h2>
          <p class="text-sm text-gray-300">Tür: {{ item.type }}</p>
          <p class="text-sm text-gray-300">Hasar: {{ item.damage }}</p>
          <p class="text-sm text-gray-300">Mermi: {{ item.ammo }}</p>
        </div>
      </div>
      <div v-else class="text-gray-400">Henüz envanterinizde ürün yok.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/navbar.vue";
import { useInventory } from "@/composables/useInventory";
import { onMounted } from "vue";
import { useAuthRedirect } from "@/composables/useAuthRedirect";

useAuthRedirect();
const { inventory, loadInventory } = useInventory();

onMounted(() => {
  loadInventory();
});
</script>
