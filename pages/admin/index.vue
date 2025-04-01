<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-white mb-6">Admin Paneline Hoş Geldin 👑</h1>
    <p class="text-gray-400">Soldaki menüden bir bölüm seç.</p>
  </div>
</template>

<script setup lang="ts">
import adminMiddleware from '~/middleware/admin.global'
definePageMeta({
  middleware: adminMiddleware,
})
</script>
