<template>
  <div class="min-h-screen bg-valorantDark text-white p-10">
    <Navbar />

    <div class="max-w-md mx-auto mt-20 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 class="text-2xl font-bold mb-4">Bakiye Yükle</h1>

      <!-- 🟢 Mevcut Bakiye -->
      <p class="text-lg mb-4">
        Mevcut Bakiye:
        <span v-if="balance !== null" class="text-green-400 font-bold">{{ balance }} ₺</span>
        <span v-else class="text-yellow-400 font-bold">Yükleniyor...</span>
      </p>

      <input
        v-model.number="amount"
        type="number"
        placeholder="Yüklenecek miktar"
        class="w-full px-4 py-2 rounded text-black mb-4"
      />

      <button
        @click="handleDeposit"
        :disabled="!authLoaded || !currentUser || amount <= 0"
        class="bg-valorantRed text-white px-4 py-2 rounded font-bold hover:opacity-80 w-full disabled:opacity-50"
      >
        Yükle
      </button>

      <p v-if="message" class="text-green-400 mt-4">{{ message }}</p>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useWallet } from "@/composables/useWallet";
import Navbar from "@/components/navbar.vue";
import { useAuthRedirect } from "@/composables/useAuthRedirect";
import { useAuth } from "@/composables/auth";

useAuthRedirect();

const amount = ref(0);
const message = ref("");
const { deposit, balance, fetchBalance } = useWallet();
const { currentUser, authLoaded } = useAuth();

onMounted(() => {
  fetchBalance(); 
});

const handleDeposit = async () => {
  if (amount.value <= 0) return;

  await deposit(amount.value);
  message.value = `${amount.value}₺ başarıyla yüklendi!`;
  amount.value = 0;
};
</script>

