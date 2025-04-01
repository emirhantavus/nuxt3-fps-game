<template>
  <div class="flex min-h-screen bg-gray-900 text-white">
    <aside class="w-64 bg-gray-800 p-6">
      <h2 class="text-xl font-bold text-valorantRed mb-6">Admin Panel</h2>
      <nav class="space-y-2">
        <NuxtLink to="/admin/dashboard" class="block px-3 py-2 rounded hover:bg-gray-700">Dashboard</NuxtLink>
        <NuxtLink to="/admin/users" class="block px-3 py-2 rounded hover:bg-gray-700">Kullanıcılar</NuxtLink>
        <NuxtLink to="/admin/products" class="block px-3 py-2 rounded hover:bg-gray-700">Ürünler</NuxtLink>
        <NuxtLink to="/admin/items" class="block px-3 py-2 rounded hover:bg-gray-700">Itemler</NuxtLink>
        <NuxtLink to="/admin/avatars" class="block px-3 py-2 rounded hover:bg-gray-700">Avatarlar</NuxtLink>
        <NuxtLink to="/admin/wallets" class="block px-3 py-2 rounded hover:bg-gray-700">Bakiyeler</NuxtLink>
        <NuxtLink to="/admin/news" class="block px-3 py-2 rounded hover:bg-gray-700">Haberler</NuxtLink>
        <NuxtLink to="/admin/maps" class="block px-3 py-2 rounded hover:bg-gray-700">Haritalar</NuxtLink>
        <NuxtLink to="/admin/homepage" class="block px-3 py-2 rounded hover:bg-gray-700">Ana Sayfa İçeriği</NuxtLink>
        <NuxtLink to="/admin/settings/navbar" class="block px-3 py-2 rounded hover:bg-gray-700">Navbar Ayarları</NuxtLink>
        <NuxtLink to="/admin/settings/footer" class="block px-3 py-2 rounded hover:bg-gray-700">Footer Ayarları</NuxtLink>
        <NuxtLink to="/" class="block px-3 py-2 rounded hover:bg-gray-700">Ana Sayfa</NuxtLink>
      </nav>
    </aside>

    <main class="flex-1 p-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

onMounted(() => {
  const auth = getAuth()
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const tokenResult = await user.getIdTokenResult()
      console.log("🛡️ Kullanıcının rolü:", tokenResult.claims.role)
    } else {
      console.log("🚫 Kullanıcı giriş yapmamış")
    }
  })
})
</script>
