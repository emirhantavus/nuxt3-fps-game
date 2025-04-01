<template>
      <div class="max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold mb-6">➕ Yeni Haber Ekle</h2>
    
        <div class="space-y-4">
          <input v-model="news.title" placeholder="Başlık" class="input" />
          <input v-model="news.description" placeholder="Kısa Açıklama" class="input" />
          <input v-model="news.image" placeholder="Görsel URL" class="input" />
          <textarea v-model="news.content" rows="6" placeholder="İçerik" class="input"></textarea>
    
          <button @click="addNews" class="bg-valorantRed px-6 py-2 rounded text-white font-bold">
            Haberi Ekle
          </button>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    definePageMeta({
      layout: 'admin',
      middleware: 'admin'
    })
    
    import { ref } from 'vue'
    import { db } from '@/composables/firebase'
    import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
    import { useRouter } from 'vue-router'
    
    const router = useRouter()
    const news = ref({
      title: '',
      description: '',
      image: '',
      content: ''
    })
    
    const addNews = async () => {
      if (!news.value.title || !news.value.description) {
        alert('Başlık ve açıklama zorunludur.')
        return
      }
    
      await addDoc(collection(db, 'news'), {
        ...news.value,
        createdAt: serverTimestamp()
      })
    
      alert('Haber başarıyla eklendi!')
      router.push('/admin/news')
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
    