<template>
      <div>
        <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-bold">📰 Haberler</h2>
      <NuxtLink to="/admin/news/new" class="bg-valorantRed px-4 py-2 rounded text-white">
        Yeni Haber Ekle
      </NuxtLink>
    </div>
    
        <div v-if="loading" class="text-yellow-400">Yükleniyor...</div>
    
        <table v-else class="w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead class="bg-gray-700 text-valorantRed">
            <tr>
              <th class="p-4 text-left">Başlık</th>
              <th class="p-4 text-left">Tarih</th>
              <th class="p-4">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="news in newsList"
              :key="news.id"
              class="border-b border-gray-700 hover:bg-gray-700/30"
            >
              <td class="p-4">{{ news.title }}</td>
              <td class="p-4">{{ formatDate(news.createdAt) }}</td>
              <td class="p-4 text-center">
                <NuxtLink :to="`/admin/news/${news.id}`" class="text-blue-400 hover:underline">
                  Düzenle
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    
    <script setup lang="ts">
    definePageMeta({
      layout: 'admin',
      middleware: 'admin'
    })
    
    import { ref, onMounted } from 'vue'
    import { db } from '@/composables/firebase'
    import { collection, getDocs, orderBy, query } from 'firebase/firestore'
    
    const newsList = ref<any[]>([])
    const loading = ref(true)
    
    const formatDate = (timestamp: { seconds: number }) => {
      const date = new Date(timestamp.seconds * 1000)
      return date.toLocaleDateString('tr-TR')
    }
    
    const fetchNews = async () => {
      const newsRef = query(collection(db, 'news'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(newsRef)
      newsList.value = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      loading.value = false
    }
    
    onMounted(fetchNews)
    </script>
    