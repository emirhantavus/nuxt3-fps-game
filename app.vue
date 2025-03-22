<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import "./assets/main.css";
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'

onMounted(() => {
  const cart = useCartStore()
  cart.loadCart()
})
</script>