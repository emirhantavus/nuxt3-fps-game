<template>
  <div class="p-6">
    <h2 class="text-3xl font-bold mb-6">Yönetim Paneli</h2>

    <!-- Sayılar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
      <div class="stat-box">Kullanıcılar: {{ stats.totalUsers }}</div>
      <div class="stat-box">Ürünler: {{ stats.totalProducts }}</div>
      <div class="stat-box">Itemlar: {{ stats.totalItems }}</div>
      <div class="stat-box">Avatarlar: {{ stats.totalAvatars }}</div>
    </div>

    <!-- En çok satan -->
    <div class="mb-10">
      <h3 class="text-xl font-semibold mb-2">🔥 En Çok Satılan Ürün</h3>
      <p v-if="stats.mostSoldProduct">{{ stats.mostSoldProduct }}</p>
      <p v-else class="text-gray-400">Veri yok</p>
    </div>

    <!-- Grafikler -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <LineChart :data="lineData" />
      <BarChart :data="barData" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

import { ref, onMounted } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/composables/firebase'
import LineChart from '@/components/dashboard/LineChart.vue'
import BarChart from '@/components/dashboard/BarChart.vue'

const stats = ref({
  totalUsers: 0,
  totalProducts: 0,
  totalItems: 0,
  totalAvatars: 0,
  mostSoldProduct: ''
})

const lineData = ref<any>(null)
const barData = ref<any>(null)

onMounted(async () => {
  // USERS
  const usersSnap = await getDocs(collection(db, 'users'))
  stats.value.totalUsers = usersSnap.size

  const dateCounts: Record<string, number> = {}
  usersSnap.docs.forEach(doc => {
    const createdAt = (doc.data().createdAt as { seconds: number })?.seconds
    if (createdAt) {
      const date = new Date(createdAt * 1000).toLocaleDateString('tr-TR')
      dateCounts[date] = (dateCounts[date] || 0) + 1
    }
  })
  lineData.value = {
    labels: Object.keys(dateCounts),
    datasets: [{
      label: 'Kullanıcı Artışı',
      data: Object.values(dateCounts),
      borderColor: '#f43f5e',
      backgroundColor: '#f43f5e88',
      fill: true,
    }]
  }

  // PRODUCTS
  const productsSnap = await getDocs(collection(db, 'products'))
  stats.value.totalProducts = productsSnap.size

  const salesCount: Record<string, number> = {}
  for (const docSnap of productsSnap.docs) {
    const data = docSnap.data()
    const name = data.name || 'Bilinmeyen'
    salesCount[name] = (salesCount[name] || 0) + (data.sales || 0)
  }

  const sortedSales = Object.entries(salesCount).sort((a, b) => b[1] - a[1])
  stats.value.mostSoldProduct = sortedSales[0]?.[0] || ''
  const top5 = sortedSales.slice(0, 5)
  barData.value = {
    labels: top5.map(([name]) => name),
    datasets: [{
      label: 'Satış Adedi',
      data: top5.map(([_, count]) => count),
      backgroundColor: '#3b82f6'
    }]
  }

  // ITEMS
  const itemsSnap = await getDocs(collection(db, 'items'))
  stats.value.totalItems = itemsSnap.size

  // AVATARS
  const avatarsSnap = await getDocs(collection(db, 'avatars'))
  stats.value.totalAvatars = avatarsSnap.size
})
</script>

<style scoped>
.stat-box {
  background: #1f2937;
  color: white;
  padding: 20px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  box-shadow: 0 0 10px #00000020;
}
</style>
