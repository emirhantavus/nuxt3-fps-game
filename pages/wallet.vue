<template>
      <div class="text-white p-10 bg-valorantDark min-h-screen">
        <h1 class="text-3xl font-bold mb-4">Cüzdan</h1>
        <p>Mevcut Bakiye: <span class="text-valorantRed font-bold">{{ balance }} ₺</span></p>
    
        <button
          @click="deposit(500)"
          class="mt-4 bg-valorantRed px-4 py-2 rounded hover:opacity-80"
        >
          500 ₺ Yükle
        </button>
      </div>
      <Footer />
    </template>
    
    <script setup lang="ts">
    import { useWallet } from "@/composables/useWallet";
    
    const { balance, deposit } = useWallet();
    </script>
    