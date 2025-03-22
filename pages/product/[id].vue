<template>
  <div class="w-full min-h-screen bg-valorantDark text-white pb-20">
    <Navbar class="fixed top-0 left-0 w-full z-50" />

    <div class="container mx-auto pt-28 px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <!-- Ürün Görseli -->
        <div class="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
          <img :src="product?.image" alt="Ürün Görseli" class="w-full h-72 object-cover rounded-lg" />
        </div>

        <!-- Detay Kartı -->
        <div class="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-xl border border-valorantRed">
          <h1 class="text-4xl font-extrabold text-valorantRed mb-4">{{ product?.name }}</h1>
          <p class="text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap break-words max-h-[240px] overflow-y-auto">
            {{ product?.description }}
          </p>

          <div class="flex items-center space-x-4 mb-6">
            <p class="text-3xl font-bold text-white">{{ product?.price }} ₺</p>
            <button
              @click="handleAddToCart"
              class="bg-valorantRed px-6 py-2 rounded-lg font-bold hover:opacity-80 transition"
              :disabled="!product"
            >
              Sepete Ekle
            </button>
          </div>

          <p class="text-sm text-gray-500">Kategori: <span class="text-white">{{ product?.category }}</span></p>
          <p class="text-sm text-gray-500">Ürün ID: <span class="text-white">{{ product?.id }}</span></p>
        </div>
      </div>

      <!-- Benzer Ürünler -->
      <div v-if="similarProducts.length" class="mt-16">
        <h2 class="text-2xl font-bold text-white mb-4">Benzer Ürünler</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <NuxtLink
            v-for="item in similarProducts"
            :key="item.id"
            :to="`/product/${item.id}`"
            class="bg-gray-800 p-4 rounded-lg shadow hover:scale-105 transition block"
          >
            <img :src="item.image" alt="" class="w-full h-32 object-cover rounded mb-2" />
            <h3 class="text-lg font-bold text-white">{{ item.name }}</h3>
            <p class="text-valorantRed font-bold">{{ item.price }} ₺</p>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
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
    name: product.value.name,
    price: product.value.price,
    image: product.value.image,
    quantity: 1,
  });
};
</script>
