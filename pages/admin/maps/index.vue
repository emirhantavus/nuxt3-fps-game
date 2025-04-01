<template>
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold">Haritalar</h2>
          <NuxtLink to="/admin/maps/new" class="bg-valorantRed text-white px-4 py-2 rounded">
            ➕ Harita Ekle
          </NuxtLink>
        </div>
    
        <div v-if="loading" class="text-yellow-400">Yükleniyor...</div>
    
        <div v-else class="grid md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="map in maps"
            :key="map.id"
            :to="`/admin/maps/${map.id}`"
            class="bg-gray-800 rounded-lg overflow-hidden shadow hover:scale-105 transition-all"
          >
            <img :src="map.images[0]" alt="Harita" class="w-full h-48 object-cover" />
            <div class="p-4">
              <h3 class="text-xl font-bold">{{ map.title }}</h3>
              <p class="text-gray-400 text-sm truncate">{{ map.description }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    definePageMeta({
      layout: 'admin',
      middleware: 'admin',
    })
    
    import { ref, onMounted } from 'vue'
    import { db } from '@/composables/firebase'
    import { collection, getDocs, orderBy, query } from 'firebase/firestore'
    
    const maps = ref<any[]>([])
    const loading = ref(true)
    
    onMounted(async () => {
      const q = query(collection(db, 'maps'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      maps.value = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      loading.value = false
    })
    </script>
    