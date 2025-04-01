<template>
      <div class="p-8 max-w-4xl mx-auto text-white">
        <h1 class="text-3xl font-bold mb-8">🏠 Anasayfa İçeriği Düzenle</h1>
    
        <div v-if="loading" class="text-yellow-400">Yükleniyor...</div>
    
        <div v-else class="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
          <div>
            <label class="block mb-1">🎥 Video URL</label>
            <input v-model="homepage.videoUrl" class="input" />
          </div>
    
          <div>
            <label class="block mb-1">🏆 Hero Başlık</label>
            <input v-model="homepage.heroTitle" class="input" />
          </div>
    
          <div>
            <label class="block mb-1">📄 Hero Açıklama</label>
            <textarea v-model="homepage.heroDescription" rows="3" class="input" />
          </div>
    
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1">🔘 Buton 1 Metni</label>
              <input v-model="homepage.button1Text" class="input" />
            </div>
            <div>
              <label class="block mb-1">🔗 Buton 1 Link</label>
              <input v-model="homepage.button1Link" class="input" />
            </div>
            <div>
              <label class="block mb-1">🔘 Buton 2 Metni</label>
              <input v-model="homepage.button2Text" class="input" />
            </div>
            <div>
              <label class="block mb-1">🔗 Buton 2 Link</label>
              <input v-model="homepage.button2Link" class="input" />
            </div>
          </div>
    
          <hr class="border-gray-600 my-4" />
    
          <div>
            <label class="block mb-1">🖼️ Oyun Tanıtım Görseli</label>
            <input v-model="homepage.introImage" class="input" />
          </div>
    
          <div>
            <label class="block mb-1">📌 Oyun Tanıtım Başlığı</label>
            <input v-model="homepage.introTitle" class="input" />
          </div>
    
          <div>
            <label class="block mb-1">📝 Oyun Tanıtım Açıklaması</label>
            <textarea v-model="homepage.introDescription" rows="4" class="input" />
          </div>
    
          <button @click="updateHomepage" class="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded">
            💾 Kaydet
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
    import { doc, getDoc, setDoc } from 'firebase/firestore'
    import { db } from '@/composables/firebase'
    
    const homepage = ref<any>({})
    const loading = ref(true)
    
    const fetchHomepage = async () => {
      const docRef = doc(db, 'homepage', 'main')
      const snapshot = await getDoc(docRef)
      if (snapshot.exists()) {
        homepage.value = snapshot.data()
      }
      loading.value = false
    }
    
    const updateHomepage = async () => {
      await setDoc(doc(db, 'homepage', 'main'), homepage.value, { merge: true })
      alert("Anasayfa verileri güncellendi.")
    }
    
    onMounted(fetchHomepage)
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
    