<template>
  <div class="w-full min-h-screen bg-valorantDark text-white">
    <Navbar class="fixed top-0 left-0 w-full z-50" />

    <div class="container mx-auto pt-24 text-center">
      <h1 class="text-4xl font-bold text-valorantRed">Mağaza</h1>
      <p class="text-lg text-gray-300">Oyun içi aksesuarları ve ekipmanları satın al!</p>
    </div>

    <div class="container mx-auto mt-8">
      <div class="flex space-x-4 justify-center">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 rounded-lg font-bold text-lg',
            selectedCategory === category ? 'bg-valorantRed' : 'bg-gray-700 hover:bg-gray-600'
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 p-6">
      <NuxtLink
        v-for="product in filteredProducts"
        :key="product.id"
        :to="`/product/${product.id}`"
        class="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer block"
      >
        <img :src="product.image" alt="Ürün Resmi" class="w-full h-40 object-cover rounded-lg" />
        <h2 class="text-xl font-bold mt-4">{{ product.name }}</h2>
        <p class="text-lg font-bold text-valorantRed mt-2">{{ product.price }} ₺</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/navbar.vue";
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "@/stores/products";
import { useProducts } from "@/composables/useProducts";

const categories = ref(["Tümü", "Silahlar", "Aksesuarlar", "Zırhlar", "Ekipman"]);
const selectedCategory = ref("Tümü");

const store = useProductStore();
const { fetchProducts } = useProducts();

onMounted(() => {
  store.fetchProducts();
});

const filteredProducts = computed(() => store.getByCategory(selectedCategory.value));
</script>
