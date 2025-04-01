<template>
      <div class="min-h-screen bg-gray-900 text-white px-4 py-20">
        <Navbar />
    
        <div v-if="loading" class="text-center text-yellow-400 py-20">Yükleniyor...</div>
    
        <div v-else class="max-w-5xl mx-auto space-y-20">
          <div v-for="map in maps" :key="map.id" class="space-y-6">
            <!-- Başlık -->
            <h2 class="text-4xl font-bold text-valorantRed">{{ map.title }}</h2>
    
            <!-- Açıklama -->
            <p class="text-gray-300 text-lg">{{ map.description }}</p>
    
            <!-- Ana Büyük Görsel -->
            <img :src="map.images[0]" class="w-full rounded-lg object-cover max-h-[600px]" />
    
            <!-- Küçük Tıklanabilir Görseller -->
            <div class="flex flex-wrap gap-4 mt-4">
              <img
                v-for="(image, idx) in map.images"
                :key="idx"
                :src="image"
                @click="openModal(image)"
                class="w-32 h-20 object-cover rounded-lg cursor-pointer border-2 border-gray-700 hover:border-valorantRed transition-all"
              />
            </div>
          </div>
        </div>
    
        <!-- Modal -->
        <div v-if="selectedImage" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div class="relative max-w-4xl w-full px-4">
            <img :src="selectedImage" class="rounded-lg w-full max-h-[80vh] object-contain" />
            <button
              @click="selectedImage = null"
              class="absolute top-2 right-2 text-white text-3xl font-bold hover:text-valorantRed"
            >
              &times;
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </template>
    
    <script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { db } from '@/composables/firebase'
    import { collection, getDocs, orderBy, query } from 'firebase/firestore'
    import Navbar from '@/components/navbar.vue'
    
    interface MapItem {
      id: string
      title: string
      description: string
      images: string[]
    }
    
    const maps = ref<MapItem[]>([])
    const loading = ref(true)
    const selectedImage = ref<string | null>(null)
    
    const openModal = (image: string) => {
      selectedImage.value = image
    }
    
    const fetchMaps = async () => {
      const q = query(collection(db, 'maps'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      maps.value = snap.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<MapItem, 'id'>),
      }))
      loading.value = false
    }
    
    onMounted(fetchMaps)
    </script>
    