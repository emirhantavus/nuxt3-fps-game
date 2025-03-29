<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import "./assets/main.css";
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useWalletStore } from "@/stores/wallet";

onMounted(() => {
  const cart = useCartStore()
  cart.loadCart()

  const wallet = useWalletStore()
  wallet.loadBalance()
})
</script>