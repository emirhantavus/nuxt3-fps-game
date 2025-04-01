<template>
      <div>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl font-bold">🛠 Haber Düzenle</h2>
          <button @click="router.back()" class="bg-valorantRed text-white px-4 py-2 rounded">
            Geri Dön
          </button>
        </div>
    
        <div v-if="loading" class="text-yellow-400">Yükleniyor...</div>
    
        <div v-else class="bg-gray-800 p-6 rounded-lg space-y-4">
          <label class="block">Başlık</label>
          <input v-model="news.title" class="input" />
    
          <label class="block">Açıklama</label>
          <input v-model="news.description" class="input" />
    
          <label class="block">İçerik</label>
          <textarea v-model="news.content" class="input h-40" />
    
          <label class="block">Görsel URL</label>
          <input v-model="news.image" class="input" />
    
          <button @click="updateNews" class="bg-green-600 text-white px-4 py-2 rounded">
            Kaydet
          </button>
          <button @click="deleteNews" class="bg-red-600 text-white px-4 py-2 rounded ml-2">
            Sil
          </button>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    definePageMeta({
      layout: 'admin',
      middleware: 'admin'
    })
    
    import { ref, onMounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { db } from '@/composables/firebase'
    import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
    
    const route = useRoute()
    const router = useRouter()
    const newsId = route.params.id as string
    
    const loading = ref(true)
    const news = ref<any>({
      title: '',
      description: '',
      content: '',
      image: ''
    })
    
    const fetchNews = async () => {
      const snap = await getDoc(doc(db, 'news', newsId))
      if (snap.exists()) {
        news.value = snap.data()
      }
      loading.value = false
    }
    
    const updateNews = async () => {
      await updateDoc(doc(db, 'news', newsId), { ...news.value })
      alert('Haber güncellendi.')
    }
    
    const deleteNews = async () => {
      const confirmDelete = confirm('Bu haberi silmek istediğine emin misin?')
      if (!confirmDelete) return
      await deleteDoc(doc(db, 'news', newsId))
      router.push('/admin/news')
    }
    
    onMounted(fetchNews)
    </script>
    
    <style scoped>
    .input {
      width: 100%;
      padding: 10px 14px;
      background-color: #1f2937;
      color: white;
      border: 1px solid #4b5563;
      border-radius: 6px;
    }
    </style>
    