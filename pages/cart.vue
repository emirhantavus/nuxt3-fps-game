<template>
  <div class="w-full min-h-screen bg-valorantDark text-white pb-20">
    <Navbar class="fixed top-0 left-0 w-full z-50" />

    <div class="container mx-auto pt-28 px-6">
      <h1 class="text-4xl font-bold text-valorantRed mb-6">Sepetim</h1>

      <div v-if="cart.items.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="item in cart.items"
          :key="item.id"
          class="bg-gray-800 p-4 rounded-lg shadow flex items-center space-x-4"
        >
          <img :src="item.image" class="w-24 h-24 object-cover rounded" />
          <div class="flex-1">
            <h2 class="text-xl font-bold">{{ item.name }}</h2>
            <p>Miktar: {{ item.quantity }}</p>
            <p class="text-valorantRed font-bold">{{ item.price * item.quantity }} ₺</p>
          </div>
          <button @click="cart.removeFromCart(item.id)" class="text-red-500 hover:text-red-700 font-bold text-sm">
            Sil
          </button>
        </div>
      </div>

      <div v-else class="text-gray-400">Sepetiniz boş.</div>

      <div v-if="cart.items.length" class="mt-10 text-right">
        <p class="text-xl font-bold">Toplam: <span class="text-valorantRed">{{ cart.totalPrice }} ₺</span></p>
        <button @click="cart.clearCart()" class="mt-4 bg-red-600 px-6 py-2 rounded font-bold hover:opacity-80">
          Sepeti Temizle
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Navbar from "@/components/navbar.vue";
import { useCartStore } from "@/stores/cart";
import { onMounted } from 'vue';

const cart = useCartStore();

onMounted(() => {
  cart.loadCart();
});
</script>
