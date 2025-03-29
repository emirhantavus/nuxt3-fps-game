<template>
  <div>
    <h2 class="text-3xl font-bold mb-4">Admin Dashboard</h2>
    <p class="text-gray-400">Hoş geldin, {{ currentUser?.email }}</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: ["admin"],
});

import { useAuth } from "@/composables/auth";
const { currentUser } = useAuth();
</script>
