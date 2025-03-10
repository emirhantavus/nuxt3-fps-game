<template>
      <div class="w-full min-h-screen bg-valorantDark text-white">
        <!-- Navbar -->
        <Navbar class="fixed top-0 left-0 w-full z-50" />
    
        <!-- Sayfa Başlığı -->
        <div class="container mx-auto pt-24 text-center">
          <h1 class="text-4xl font-bold text-valorantRed">Mağaza</h1>
          <p class="text-lg text-gray-300">Oyun içi aksesuarları ve ekipmanları satın al!</p>
        </div>
    
        <!-- Kategoriler -->
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
    
        <!-- Ürün Listesi -->
        <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 p-6">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
          >
            <img :src="product.image" alt="Ürün Resmi" class="w-full h-40 object-cover rounded-lg" />
            <h2 class="text-xl font-bold mt-4">{{ product.name }}</h2>
            <p class="text-gray-400">{{ product.description }}</p>
            <p class="text-lg font-bold text-valorantRed mt-2">{{ product.price }} ₺</p>
          </div>
        </div>
      </div>
    </template>
    
<script setup lang="ts">
import Navbar from "@/components/navbar.vue";
import { ref, computed } from "vue";
import { useProducts } from "~/composables/useProducts";

const { products } = useProducts();


const categories = ref(["Tümü", "Silahlar", "Aksesuarlar", "Zırhlar", "Ekipman"]);
const selectedCategory = ref("Tümü");


const filteredProducts = computed(() => {
  if (selectedCategory.value === "Tümü") return products.value;
  return products.value.filter(product => product.category === selectedCategory.value);
});
</script>