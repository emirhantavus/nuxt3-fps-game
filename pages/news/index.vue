<template>
      <div class="min-h-screen bg-gray-900 text-white">
        <Navbar />
    
        <div class="px-4 py-20">
          <h1 class="text-4xl font-bold mb-12 text-center">📰 Son Haberler</h1>
    
          <div v-if="loading" class="text-center text-yellow-400">Yükleniyor...</div>
    
          <div v-else class="space-y-10 max-w-5xl mx-auto">
            <NuxtLink
              v-for="news in newsList"
              :key="news.id"
              :to="`/news/${news.id}`"
              class="flex flex-col md:flex-row bg-gray-800 rounded-lg overflow-hidden shadow-md hover:scale-[1.01] transition-all"
            >
              <img
                :src="news.image"
                class="w-full md:w-1/3 h-64 object-cover"
                alt="Haber görseli"
              />
              <div class="p-6 flex flex-col justify-center md:w-2/3">
                <h2 class="text-2xl font-bold mb-2">{{ news.title }}</h2>
                <p class="text-gray-300 mb-2">{{ news.description }}</p>
                <p class="text-gray-500 text-sm">🕒 {{ formatDate(news.createdAt) }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { db } from '@/composables/firebase'
    import { collection, getDocs, orderBy, query } from 'firebase/firestore'
    import Navbar from '@/components/navbar.vue'
    
    interface NewsItem {
      id: string
      title: string
      description: string
      content: string
      image: string
      createdAt: { seconds: number }
    }
    
    const newsList = ref<NewsItem[]>([])
    const loading = ref(true)
    
    const formatDate = (timestamp: { seconds: number }) => {
      const date = new Date(timestamp.seconds * 1000)
      return date.toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
    
    const fetchNews = async () => {
      const newsRef = query(collection(db, 'news'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(newsRef)
      newsList.value = snap.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<NewsItem, 'id'>),
      }))
      loading.value = false
    }
    
    onMounted(fetchNews)
    </script>
    