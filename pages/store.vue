<template>
  <div class="w-full min-h-screen bg-valorantDark text-white pb-24 overflow-x-hidden">
    <Navbar class="fixed top-0 left-0 w-full z-50" />

    <div class="container mx-auto pt-24 text-center px-4">
      <h1 class="text-4xl font-bold text-valorantRed">Mağaza</h1>
      <p class="text-lg text-gray-300">Oyun içi aksesuarları ve ekipmanları satın al!</p>
    </div>

    <!-- Kategori Butonları -->
    <div class="container mx-auto mt-8 px-4">
      <div class="flex flex-wrap gap-2 justify-center">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="[
            'px-4 py-2 rounded-lg font-bold text-base sm:text-lg transition-all',
            selectedCategory === category ? 'bg-valorantRed' : 'bg-gray-700 hover:bg-gray-600'
          ]"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Ürün Kartları -->
    <div class="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10 px-4">
      <NuxtLink
        v-for="product in filteredProducts"
        :key="product.id"
        :to="`/product/${product.id}`"
        class="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-[1.04] transition-transform cursor-pointer flex flex-col"
      >
        <img :src="product.image" alt="Ürün Resmi" class="w-full h-40 object-cover rounded-lg" />

        <!-- İsim + Fiyat -->
        <div class="flex justify-between items-center mt-4">
          <h2 class="text-base sm:text-lg font-bold truncate">{{ product.item.name }}</h2>
          <p class="text-base sm:text-lg font-bold text-valorantRed">{{ product.price }} ₺</p>
        </div>

        <p class="text-xs sm:text-sm mt-1 text-gray-400">Tür: {{ product.item.type }}</p>
        <p class="text-xs sm:text-sm text-gray-400">Hasar: {{ product.item.damage }}</p>
        <p class="text-xs sm:text-sm text-gray-400">Mermi: {{ product.item.ammo }}</p>
      </NuxtLink>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import Navbar from "@/components/navbar.vue";
import { ref, computed, onMounted } from "vue";
import { useProductStore } from "@/stores/products";

const categories = ref(["Tümü", "Silahlar", "Aksesuarlar", "Zırhlar", "Ekipman"]);
const selectedCategory = ref("Tümü");

const store = useProductStore();
onMounted(() => {
  store.fetchProducts();
});

const filteredProducts = computed(() => store.getByCategory(selectedCategory.value));
</script>
