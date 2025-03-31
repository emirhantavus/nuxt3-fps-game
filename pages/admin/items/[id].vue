<template>
      <div>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl font-bold">Item Detayı</h2>
          <button @click="router.back()" class="bg-valorantRed text-white px-4 py-2 rounded">Geri Dön</button>
        </div>
    
        <div v-if="loading" class="text-yellow-400">Yükleniyor...</div>
    
        <div v-else class="bg-gray-800 p-6 rounded-lg">
          <label class="block mb-2">Item Adı</label>
          <input v-model="item.name" class="input mb-4" />
    
          <label class="block mb-2">Tür</label>
          <input v-model="item.type" class="input mb-4" />
    
          <label class="block mb-2">Hasar</label>
          <input v-model.number="item.damage" type="number" class="input mb-4" />
    
          <label class="block mb-2">Mermi</label>
          <input v-model.number="item.ammo" type="number" class="input mb-4" />
    
          <label class="block mb-2">Görsel URL</label>
          <input v-model="item.image" class="input mb-4" />
    
          <button @click="updateItem" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Güncelle
          </button>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    definePageMeta({
      layout: "admin",
      middleware: "admin",
    });
    
    import { ref, onMounted } from 'vue'
    import { doc, getDoc, updateDoc } from 'firebase/firestore'
    import { db } from '@/composables/firebase'
    
    const route = useRoute()
    const router = useRouter()
    const itemId = route.params.id as string
    
    const item = ref<any>({})
    const loading = ref(true)
    
    const fetchItem = async () => {
      loading.value = true
      const itemDoc = await getDoc(doc(db, 'items', itemId))
      if (itemDoc.exists()) {
        item.value = itemDoc.data()
      }
      loading.value = false
    }
    
    const updateItem = async () => {
      await updateDoc(doc(db, 'items', itemId), {
        name: item.value.name,
        type: item.value.type,
        damage: item.value.damage,
        ammo: item.value.ammo,
        image: item.value.image,
      })
      alert('Item güncellendi.')
    }
    
    onMounted(fetchItem)
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
    