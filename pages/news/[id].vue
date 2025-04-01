<template>
  <div class="min-h-screen bg-gray-900 text-white px-4 pb-20">
    <Navbar />

    <div v-if="loading" class="text-center text-yellow-400 py-20">Yükleniyor...</div>

    <div v-else class="max-w-4xl mx-auto pt-28">
      <img :src="news.image" class="w-full h-96 object-cover rounded-lg mb-6" />
      <h1 class="text-4xl font-bold mb-4">{{ news.title }}</h1>
      <p class="text-gray-400 mb-2">🕒 {{ formatDate(news.createdAt) }}</p>
      <p class="news-content">{{ news.content }}</p>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/composables/firebase'
import Navbar from '@/components/navbar.vue'

const route = useRoute()
const newsId = route.params.id as string

const loading = ref(true)
const news = ref<any>({})

const formatDate = (timestamp: { seconds: number }) => {
  const date = new Date(timestamp.seconds * 1000)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const fetchNews = async () => {
  const docSnap = await getDoc(doc(db, 'news', newsId))
  if (docSnap.exists()) {
    news.value = docSnap.data()
  }
  loading.value = false
}

onMounted(fetchNews)
</script>

<style scoped>
.news-content {
  white-space: pre-line;
  word-break: break-word;
  overflow-wrap: break-word;
  font-size: 1.125rem; /* text-lg */
  line-height: 1.75rem; /* leading-relaxed */
}
</style>
