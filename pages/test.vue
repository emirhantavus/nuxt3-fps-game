<template>
      <div class="p-10">
        <h1 class="text-2xl font-bold text-white">Firebase Test</h1>
        <button @click="fetchData" class="bg-valorantRed px-4 py-2 rounded-lg text-white font-bold hover:opacity-80">
          Veri Çek
        </button>
        <div v-if="data.length">
          <div v-for="(item, index) in data" :key="index" class="text-gray-300 mt-4">
            <p>{{ item.name }}</p>
          </div>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    import { ref } from "vue";
    import { db } from "@/composables/firebase";
    import { collection, getDocs } from "firebase/firestore";
    import type { DocumentData } from "firebase/firestore"; // 🔴 Type olarak import edildi
    
    // Firestore'dan gelen verileri bir dizi olarak tanımla
    const data = ref<DocumentData[]>([]);
    
    // Firestore'dan veri çekme fonksiyonu
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "test_collection"));
      data.value = querySnapshot.docs.map((doc) => doc.data());
    };
    </script>
    