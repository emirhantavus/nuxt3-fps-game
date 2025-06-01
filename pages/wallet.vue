<template>
  <div class="min-h-screen bg-valorantDark text-white flex flex-col pb-20">
    <Navbar />
    <div class="flex-1 flex items-center justify-center px-4">
      <div class="w-full max-w-sm mt-20 bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h1 class="text-2xl font-bold mb-4">Cüzdan</h1>
        <p>
          Mevcut Bakiye:
          <span class="text-valorantRed font-bold">{{ balance }} ₺</span>
        </p>
        <button
          @click="deposit(500)"
          class="mt-4 bg-valorantRed px-4 py-2 rounded hover:opacity-80 font-bold"
        >
          500 ₺ Yükle
        </button>
      </div>
    </div>
  </div>
  <Footer />
</template>


    
    <script setup lang="ts">
    import { useWallet } from "@/composables/useWallet";
    
    const { balance, deposit } = useWallet();
    </script>
    