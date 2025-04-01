<template>
      <div class="p-6 max-w-2xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold">Harita Düzenle</h2>
          <button @click="deleteMap" class="text-red-400 hover:text-red-600">🗑️ Sil</button>
        </div>
    
        <div v-if="loading" class="text-yellow-400">Yükleniyor...</div>
    
        <div v-else>
          <label class="block mb-2">Başlık</label>
          <input v-model="map.title" class="input mb-4" />
    
          <label class="block mb-2">Açıklama</label>
          <textarea v-model="map.description" class="input mb-4" rows="3" />
    
          <label class="block mb-2">Görsel URL'leri (birden fazla, her satıra bir URL)</label>
          <textarea v-model="imageText" class="input mb-4" rows="4" />
    
          <button @click="updateMap" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Kaydet
          </button>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    definePageMeta({
      layout: 'admin',
      middleware: 'admin',
    })
    
    import { ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
    import { db } from '@/composables/firebase'
    
    const route = useRoute()
    const router = useRouter()
    const id = route.params.id as string
    
    const map = ref<any>({})
    const imageText = ref('')
    const loading = ref(true)
    
    onMounted(async () => {
      const docSnap = await getDoc(doc(db, 'maps', id))
      if (docSnap.exists()) {
        map.value = docSnap.data()
        imageText.value = (map.value.images || []).join('\n')
      }
      loading.value = false
    })
    
    const updateMap = async () => {
      map.value.images = imageText.value.split('\n').map(url => url.trim()).filter(Boolean)
      await updateDoc(doc(db, 'maps', id), map.value)
      alert('Harita güncellendi.')
    }
    
    const deleteMap = async () => {
      if (confirm('Bu harita silinsin mi?')) {
        await deleteDoc(doc(db, 'maps', id))
        router.push('/admin/maps')
      }
    }
    </script>
    
    <style scoped>
    .input {
      width: 100%;
      background-color: #1f2937;
      color: white;
      border: 1px solid #4b5563;
      padding: 8px 12px;
      border-radius: 6px;
    }
    </style>
    