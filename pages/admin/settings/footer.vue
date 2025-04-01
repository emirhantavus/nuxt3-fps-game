<template>
      <div class="p-6 max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold mb-6">⚙️ Footer Ayarları</h2>
    
        <div class="grid gap-4 mb-6">
          <div>
            <label class="block mb-1">Discord Linki</label>
            <input v-model="form.discord" class="input" />
          </div>
          <div>
            <label class="block mb-1">X Linki</label>
            <input v-model="form.twitter" class="input" />
          </div>
          <div>
            <label class="block mb-1">Instagram Linki</label>
            <input v-model="form.instagram" class="input" />
          </div>
          <div>
            <label class="block mb-1">YouTube Linki</label>
            <input v-model="form.youtube" class="input" />
          </div>
        </div>
    
        <h3 class="text-2xl font-bold mb-3 mt-8">🤝 Sponsorlar</h3>
        <ul class="mb-4 space-y-2">
          <li v-for="(s, i) in form.sponsorlar" :key="i" class="flex justify-between items-center bg-gray-700 p-2 rounded">
            <span>{{ s }}</span>
            <button @click="removeSponsor(i)" class="text-red-400 hover:text-red-600">Sil</button>
          </li>
        </ul>
    
        <div class="flex gap-2 mb-6">
          <input v-model="newSponsor" placeholder="Sponsor adı..." class="input flex-1" />
          <button @click="addSponsor" class="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Ekle</button>
        </div>
    
        <button @click="saveSettings" class="bg-valorantRed px-6 py-3 rounded text-white font-bold hover:opacity-90">
          Kaydet
        </button>
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
    
    const form = ref({
      discord: '',
      twitter: '',
      instagram: '',
      youtube: '',
      sponsorlar: [] as string[]
    })
    const newSponsor = ref('')
    
    const fetchSettings = async () => {
      const snap = await getDoc(doc(db, 'settings', 'footerLinks'))
      if (snap.exists()) {
        form.value = snap.data() as typeof form.value
      }
    }
    
    const saveSettings = async () => {
      await setDoc(doc(db, 'settings', 'footerLinks'), form.value)
      alert('Footer ayarları kaydedildi ✅')
    }
    
    const addSponsor = () => {
      const name = newSponsor.value.trim()
      if (name && !form.value.sponsorlar.includes(name)) {
        form.value.sponsorlar.push(name)
        newSponsor.value = ''
      }
    }
    
    const removeSponsor = (index: number) => {
      form.value.sponsorlar.splice(index, 1)
    }
    
    onMounted(fetchSettings)
    </script>
    
    <style scoped>
    .input {
      width: 100%;
      padding: 8px 12px;
      background-color: #1f2937;
      border: 1px solid #4b5563;
      color: white;
      border-radius: 6px;
    }
    </style>
    