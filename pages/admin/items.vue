<template>
      <div>
        <h2 class="text-3xl font-bold mb-6">Item Yönetimi</h2>
    
        <!-- Arama -->
        <div class="flex justify-between items-center mb-4">
          <input
            v-model="search"
            type="text"
            placeholder="Item adına göre ara..."
            class="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded w-1/2"
          />
          <button
            @click="showModal = true"
            class="bg-valorantRed hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Yeni Item Ekle
          </button>
        </div>
    
        <!-- Grid -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="bg-gray-800 p-4 rounded shadow hover:bg-gray-700"
          >
            <img :src="item.image" alt="Item Image" class="w-full h-32 object-cover rounded mb-2" />
            <h3 class="text-lg font-bold text-white">{{ item.name }}</h3>
            <p class="text-sm text-gray-400">Tür: {{ item.type }}</p>
            <p class="text-sm text-gray-400">Hasar: {{ item.damage }}</p>
            <p class="text-sm text-gray-400">Mermi: {{ item.ammo }}</p>
          </div>
        </div>
    
        <!-- Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div class="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button @click="showModal = false" class="absolute top-2 right-3 text-white">✖</button>
            <h3 class="text-xl font-bold text-white mb-4">Yeni Item Ekle</h3>
            <form @submit.prevent="addItem" class="space-y-4">
              <div class="flex flex-col">
                <label class="text-sm text-gray-400 mb-1">İsim</label>
                <input v-model="form.name" class="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600" required />
              </div>
              <div class="flex flex-col">
                <label class="text-sm text-gray-400 mb-1">Tür</label>
                <input v-model="form.type" class="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600" required />
              </div>
              <div class="flex flex-col">
                <label class="text-sm text-gray-400 mb-1">Hasar</label>
                <input type="number" v-model.number="form.damage" class="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600" required />
              </div>
              <div class="flex flex-col">
                <label class="text-sm text-gray-400 mb-1">Mermi</label>
                <input type="number" v-model.number="form.ammo" class="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600" required />
              </div>
              <div class="flex flex-col">
                <label class="text-sm text-gray-400 mb-1">Görsel URL</label>
                <input v-model="form.image" class="bg-gray-800 text-white px-3 py-2 rounded border border-gray-600" required />
              </div>
              <button type="submit" class="bg-valorantRed hover:bg-red-700 text-white px-4 py-2 rounded w-full">
                Ekle
              </button>
            </form>
          </div>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    definePageMeta({
      layout: "admin",
      middleware: ["admin"],
    })
    
    import { ref, computed, onMounted } from "vue"
    import { collection, addDoc, getDocs } from "firebase/firestore"
    import { db } from "@/composables/firebase"
    
    const showModal = ref(false)
    const search = ref("")
    const items = ref<any[]>([])
    const form = ref({
      name: "",
      type: "",
      damage: 0,
      ammo: 0,
      image: "",
    })
    
    const fetchItems = async () => {
      const snapshot = await getDocs(collection(db, "items"))
      items.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    }
    
    const addItem = async () => {
      await addDoc(collection(db, "items"), form.value)
      form.value = { name: "", type: "", damage: 0, ammo: 0, image: "" }
      showModal.value = false
      await fetchItems()
    }
    
    const filteredItems = computed(() =>
      items.value.filter((item) =>
        item.name.toLowerCase().includes(search.value.toLowerCase())
      )
    )
    
    onMounted(fetchItems)
    </script>
    