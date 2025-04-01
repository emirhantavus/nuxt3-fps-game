<template>
      <div class="p-6 max-w-2xl mx-auto">
        <h2 class="text-3xl font-bold mb-6">Yeni Harita Ekle</h2>
    
        <label class="block mb-2">Başlık</label>
        <input v-model="title" class="input mb-4" />
    
        <label class="block mb-2">Açıklama</label>
        <textarea v-model="description" class="input mb-4" rows="3" />
    
        <label class="block mb-2">Görsel URL'leri (birden fazla, her satıra bir URL)</label>
        <textarea v-model="imagesText" class="input mb-4" rows="4" />
    
        <button @click="addMap" class="bg-valorantRed hover:bg-red-600 text-white px-4 py-2 rounded">
          Kaydet
        </button>
      </div>
    </template>
    
    <script setup lang="ts">
    definePageMeta({
      layout: 'admin',
      middleware: 'admin',
    })
    
    import { ref } from 'vue'
    import { db } from '@/composables/firebase'
    import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
    import { useRouter } from 'vue-router'
    
    const title = ref('')
    const description = ref('')
    const imagesText = ref('')
    const router = useRouter()
    
    const addMap = async () => {
      const images = imagesText.value.split('\n').map(url => url.trim()).filter(Boolean)
      await addDoc(collection(db, 'maps'), {
        title: title.value,
        description: description.value,
        images,
        createdAt: serverTimestamp()
      })
      router.push('/admin/maps')
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
    