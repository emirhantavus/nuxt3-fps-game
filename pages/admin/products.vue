<template>
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold">Ürünler</h2>
          <button @click="showModal = true" class="bg-valorantRed hover:bg-red-700 text-white px-4 py-2 rounded">
            Ürün Ekle
          </button>
        </div>
    
        <div class="mb-4">
          <input
            v-model="searchQuery"
            placeholder="Ürün adına göre ara..."
            class="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 text-white"
          />
        </div>
    
        <table class="w-full text-left bg-gray-800 rounded-lg overflow-hidden">
          <thead class="bg-gray-700 text-valorantRed">
            <tr>
              <th class="p-4">Ad</th>
              <th class="p-4">Fiyat</th>
              <th class="p-4">Kategori</th>
              <th class="p-4">Görsel</th>
              <th class="p-4">Item</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
              class="border-b border-gray-700 hover:bg-gray-700/30"
            >
              <td class="p-4">{{ product.name }}</td>
              <td class="p-4">{{ product.price }}₺</td>
              <td class="p-4">{{ product.category }}</td>
              <td class="p-4">
                <img :src="product.image" class="w-14 h-14 object-cover rounded" />
              </td>
              <td class="p-4">{{ product.item?.name || '-' }}</td>
            </tr>
          </tbody>
        </table>
    
        <!-- ÜRÜN EKLE MODAL -->
        <div v-if="showModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div class="bg-gray-900 p-6 rounded-lg w-full max-w-lg text-white relative">
            <button @click="showModal = false" class="absolute top-2 right-3 text-gray-400 hover:text-white text-xl">×</button>
            <h3 class="text-2xl font-bold mb-4">Yeni Ürün Ekle</h3>
    
            <form @submit.prevent="addProduct">
              <label class="block mb-2">Ad</label>
              <input v-model="form.name" class="input" required />
    
              <label class="block mt-4 mb-2">Fiyat</label>
              <input v-model.number="form.price" type="number" class="input" required />
    
              <label class="block mt-4 mb-2">Kategori</label>
              <select v-model="form.category" class="input" required>
                <option value="" disabled selected>Kategori seçin</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
    
              <label class="block mt-4 mb-2">Item Seç</label>
              <select v-model="form.itemId" @change="onItemChange" class="input" required>
                <option value="" disabled selected>Lütfen seçin</option>
                <option v-for="item in items" :value="item.id" :key="item.id">{{ item.name }}</option>
              </select>
    
              <div v-if="selectedItem" class="mt-4 text-sm text-gray-300">
                <p><strong>Tür:</strong> {{ selectedItem.type }}</p>
                <p><strong>Hasar:</strong> {{ selectedItem.damage }}</p>
                <p><strong>Mermi:</strong> {{ selectedItem.ammo }}</p>
                <img :src="selectedItem.image" class="w-24 h-24 object-cover rounded mt-2" />
              </div>
    
              <label class="block mt-4 mb-2">Görsel (Opsiyonel, override)</label>
              <input v-model="form.image" class="input" placeholder="URL girin veya boş bırakın" />
    
              <button type="submit" class="mt-6 w-full bg-valorantRed hover:bg-red-700 text-white py-2 rounded">
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
    });
    
    import { ref, computed, onMounted } from 'vue'
    import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore'
    import { db } from '@/composables/firebase'
    
    const showModal = ref(false)
    const searchQuery = ref('')
    const products = ref<any[]>([])
    const items = ref<any[]>([])
    const selectedItem = ref<any | null>(null)
    
    // Sabit kategoriler
    const categories = [
      'Silahlar',
      'Aksesuarlar',
      'Zırhlar',
      'Ekipman'
    ]
    
    const form = ref({
      name: '',
      price: 0,
      category: '',
      itemId: '',
      image: '',
    })
    
    const fetchItems = async () => {
      const snapshot = await getDocs(collection(db, 'items'))
      items.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    }
    
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, 'products'))
      const productList = []
      for (const docSnap of snapshot.docs) {
        const productData = docSnap.data()
        const itemRef = doc(db, 'items', productData.itemId)
        const itemSnap = await getDoc(itemRef)
        const itemData = itemSnap.exists() ? itemSnap.data() : null
    
        productList.push({
          id: docSnap.id,
          ...productData,
          item: itemData,
        })
      }
      products.value = productList
    }
    
    const addProduct = async () => {
      const selected = items.value.find(i => i.id === form.value.itemId)
      const imageToUse = form.value.image || selected?.image || ''
    
      await addDoc(collection(db, 'products'), {
        name: form.value.name,
        price: form.value.price,
        category: form.value.category,
        itemId: form.value.itemId,
        image: imageToUse,
      })
    
      showModal.value = false
      form.value = { name: '', price: 0, category: '', itemId: '', image: '' }
      selectedItem.value = null
      await fetchProducts()
    }
    
    const onItemChange = () => {
      selectedItem.value = items.value.find(item => item.id === form.value.itemId) || null
    }
    
    const filteredProducts = computed(() =>
      products.value.filter(p => p.name?.toLowerCase()?.includes(searchQuery.value.toLowerCase()))
    )
    
    onMounted(async () => {
      await fetchItems()
      await fetchProducts()
    })
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
    