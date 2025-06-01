<template>
  <div class="w-full min-h-screen bg-valorantDark text-white pb-20 overflow-x-hidden">
    <Navbar class="fixed top-0 left-0 w-full z-50" />

    <div class="container mx-auto pt-24 sm:pt-28 px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        <!-- Ürün Görseli -->
        <div class="bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-700 flex items-center justify-center">
          <img :src="product?.image" alt="Ürün Görseli" class="w-full max-w-xs sm:max-w-md h-56 sm:h-72 object-cover rounded-lg mx-auto" />
        </div>

        <!-- Ürün Bilgi Kartı -->
        <div class="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-valorantRed flex flex-col justify-between">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-valorantRed mb-2 sm:mb-4 break-words">
            {{ product?.item.name }}
          </h1>

          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <p class="text-2xl sm:text-3xl font-bold text-white">{{ product?.price }} ₺</p>
            <button
              @click="handleAddToCart"
              class="bg-valorantRed px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-bold hover:opacity-80 transition disabled:opacity-40"
              :disabled="!product"
            >
              Sepete Ekle
            </button>
          </div>

          <div class="space-y-1 mt-4">
            <p class="text-xs sm:text-sm text-gray-500">
              Kategori: <span class="text-white">{{ product?.category }}</span>
            </p>
            <p class="text-xs sm:text-sm text-gray-500">
              Ürün ID: <span class="text-white">{{ product?.id }}</span>
            </p>
          </div>
        </div>
      </div>

      <div v-if="similarProducts.length" class="mt-12 sm:mt-16">
        <h2 class="text-xl sm:text-2xl font-bold text-white mb-4">Benzer Ürünler</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          <NuxtLink
            v-for="item in similarProducts"
            :key="item.id"
            :to="`/product/${item.id}`"
            class="bg-gray-800 p-3 sm:p-4 rounded-lg shadow hover:scale-105 transition block"
          >
            <img :src="item.image" alt="" class="w-full h-24 sm:h-32 object-cover rounded mb-2" />
            <div class="flex justify-between items-center">
              <h3 class="text-xs sm:text-base font-bold text-white truncate">{{ item.item.name }}</h3>
              <p class="text-xs sm:text-sm font-bold text-valorantRed">{{ item.price }} ₺</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import Navbar from "@/components/navbar.vue";
import { useRoute } from "vue-router";
import { useProductStore } from "@/stores/products";
import { useCartStore } from "@/stores/cart";
import { computed, onMounted } from "vue";

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.fetchProducts();
  }
});

const product = computed(() =>
  productStore.products.find((p) => p.id === route.params.id)
);

const similarProducts = computed(() => {
  if (!product.value) return [];
  return productStore.products
    .filter((p) => p.category === product.value?.category && p.id !== product.value?.id)
    .slice(0, 5);
});

const handleAddToCart = () => {
  if (!product.value) return;
  cartStore.addToCart({
    id: product.value.id,
    name: product.value.item.name,
    price: product.value.price,
    image: product.value.image,
    quantity: 1,
  });
};
</script>
