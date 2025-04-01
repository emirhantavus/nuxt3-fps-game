<template>
  <div>
    <h2 class="text-3xl font-bold mb-6">Kullanıcılar</h2>

    <div v-if="loading" class="text-yellow-400">Yükleniyor...</div>

    <table v-else class="w-full text-left bg-gray-800 rounded-lg overflow-hidden">
      <thead class="bg-gray-700 text-valorantRed">
        <tr>
          <th class="p-4">Email</th>
          <th class="p-4">Rol</th>
          <th class="p-4">Avatar</th>
          <th class="p-4">Üyelik Tarihi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          class="border-b border-gray-700 hover:bg-gray-700/30 cursor-pointer"
          @click="goToUserDetail(user.id)"
        >
          <td class="p-4">{{ user.email }}</td>
          <td class="p-4">{{ user.role }}</td>
          <td class="p-4">
            <img :src="user.photoURL" class="w-10 h-10 rounded-full" />
          </td>
          <td class="p-4">
            {{ formatDate(user.createdAt) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import adminMiddleware from '~/middleware/admin.global'
definePageMeta({
  middleware: adminMiddleware,
});

const router = useRouter();  // ✅ Nuxt 3 doğru kullanımı
import { useAdminUsers } from "@/composables/useAdminUsers";

const { users, loading } = useAdminUsers();

const goToUserDetail = (userId: string) => {
  router.push(`/admin/users/${userId}`)
}

const formatDate = (timestamp: { seconds: number; nanoseconds?: number }) => {
  const date = new Date(timestamp.seconds * 1000)
  return date.toLocaleDateString("tr-TR")
}
</script>
