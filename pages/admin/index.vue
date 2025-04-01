<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-white mb-6">Admin Paneline Hoş Geldin 👑</h1>
    <p class="text-gray-400">Admin: {{ currentUser?.email }}</p>
    <p class="text-gray-400 mt-2">Soldaki menüden bir bölüm seç.</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

import { useAuth } from '@/composables/auth'
const { currentUser } = useAuth()
</script>
