<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-bold">Kullanıcı Detayı</h2>
      <button @click="router.back()" class="bg-valorantRed text-white px-4 py-2 rounded">Geri Dön</button>
    </div>

    <div v-if="loading" class="text-yellow-400">Yükleniyor...</div>

    <div v-else class="bg-gray-800 p-6 rounded-lg">
      <div class="flex items-center mb-4">
        <img :src="user.photoURL" class="w-20 h-20 rounded-full mr-4" />
        <div>
          <p class="text-xl">{{ user.email }}</p>
          <p class="text-gray-400">Üyelik: {{ formatDate(user.createdAt) }}</p>
        </div>
      </div>

      <label class="block mb-2">Rol</label>
      <select v-model="user.role" class="input mb-4">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <label class="block mb-2">Avatar URL</label>
      <input v-model="user.photoURL" class="input mb-4" />

      <label class="block mb-2">Bakiye</label>
      <input v-model.number="walletBalance" type="number" class="input mb-4" />

      <button @click="updateUser" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        Güncelle
      </button>

      <h3 class="mt-8 text-2xl font-bold">Envanter</h3>
      <div v-if="inventoryLoading" class="text-yellow-400">Envanter yükleniyor...</div>

      <div v-else>
        <table class="w-full mt-4 bg-gray-700 rounded">
          <thead>
            <tr class="text-left text-sm text-valorantRed border-b border-gray-600">
              <th class="py-2 px-4">Ürün Adı</th>
              <th class="py-2 px-4">Satın Alma Tarihi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in inventoryItems"
              :key="item.id"
              class="text-white text-sm border-b border-gray-600 hover:bg-gray-600/30"
            >
              <td class="py-2 px-4">{{ item.productName }}</td>
              <td class="py-2 px-4">{{ formatDate(item.addedAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin',
})

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doc, getDoc, updateDoc, collection, getDocs, setDoc } from 'firebase/firestore'
import { db } from '@/composables/firebase'

const route = useRoute()
const router = useRouter()
const userId = route.params.id as string

const user = ref<any>({})
const loading = ref(true)
const walletBalance = ref(0)

const inventoryItems = ref<
  { id: string; productName: string; addedAt: { seconds: number } }[]
>([])
const inventoryLoading = ref(true)

const formatDate = (timestamp: { seconds: number }) => {
  const date = new Date(timestamp.seconds * 1000)
  return date.toLocaleDateString('tr-TR')
}

const fetchUser = async () => {
  loading.value = true
  const userDoc = await getDoc(doc(db, 'users', userId))
  if (userDoc.exists()) {
    user.value = userDoc.data()
  }
  loading.value = false
}

const fetchWallet = async () => {
  const walletDoc = await getDoc(doc(db, 'wallets', userId))
  if (walletDoc.exists()) {
    walletBalance.value = walletDoc.data().balance
  }
}

const fetchInventory = async () => {
  inventoryLoading.value = true
  const snapshot = await getDocs(collection(db, `inventory/${userId}/items`))

  const items = await Promise.all(
    snapshot.docs.map(async (itemDoc) => {
      const data = itemDoc.data()
      const productId = data.productId

      let productName = 'Bilinmeyen'
      if (productId) {
        const productSnap = await getDoc(doc(db, 'products', productId))
        if (productSnap.exists()) {
          const productData = productSnap.data() as { name: string }
          productName = productData.name
        }
      }

      return {
        id: itemDoc.id,
        productName,
        addedAt: data.addedAt || { seconds: 0 },
      }
    })
  )

  inventoryItems.value = items
  inventoryLoading.value = false
}

const updateUser = async () => {
  await updateDoc(doc(db, 'users', userId), {
    role: user.value.role,
    photoURL: user.value.photoURL,
  })

  await setDoc(
    doc(db, 'wallets', userId),
    {
      balance: walletBalance.value,
    },
    { merge: true }
  )

  alert('Kullanıcı bilgileri güncellendi.')
}

onMounted(async () => {
  await fetchUser()
  await fetchWallet()
  await fetchInventory()
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
