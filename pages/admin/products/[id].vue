<template>
      <div>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-3xl font-bold">Ürün Detayı</h2>
          <button @click="router.back()" class="bg-valorantRed text-white px-4 py-2 rounded">Geri Dön</button>
        </div>
    
        <div v-if="loading" class="text-yellow-400">Yükleniyor...</div>
    
        <div v-else class="bg-gray-800 p-6 rounded-lg">
          <label class="block mb-2">Ürün Adı</label>
          <input v-model="product.name" class="input mb-4" />
    
          <label class="block mb-2">Fiyat (₺)</label>
          <input v-model.number="product.price" type="number" class="input mb-4" />
    
          <label class="block mb-2">Kategori</label>
          <select v-model="product.category" class="input mb-4">
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
    
          <label class="block mb-2">Görsel URL</label>
          <input v-model="product.image" class="input mb-4" />
    
          <button @click="updateProduct" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Güncelle
          </button>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    import adminMiddleware from '~/middleware/admin.global'
    definePageMeta({
      middleware: adminMiddleware,
    });
    
    import { ref, onMounted } from 'vue'
    import { doc, getDoc, updateDoc } from 'firebase/firestore'
    import { db } from '@/composables/firebase'
    
    const route = useRoute()
    const router = useRouter()
    const productId = route.params.id as string
    
    const product = ref<any>({})
    const loading = ref(true)
    
    const categories = ['Silahlar', 'Aksesuarlar', 'Zırhlar', 'Ekipman']
    
    const fetchProduct = async () => {
      loading.value = true
      const productDoc = await getDoc(doc(db, 'products', productId))
      if (productDoc.exists()) {
        product.value = productDoc.data()
      }
      loading.value = false
    }
    
    const updateProduct = async () => {
      await updateDoc(doc(db, 'products', productId), {
        name: product.value.name,
        price: product.value.price,
        category: product.value.category,
        image: product.value.image,
      })
      alert('Ürün güncellendi.')
    }
    
    onMounted(fetchProduct)
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
    