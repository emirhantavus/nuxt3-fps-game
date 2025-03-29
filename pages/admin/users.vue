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
              <th class="p-4">Değiştir</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b border-gray-700 hover:bg-gray-700/30">
              <td class="p-4">{{ user.email }}</td>
              <td class="p-4">{{ user.role }}</td>
              <td class="p-4">
                <img :src="user.photoURL" class="w-10 h-10 rounded-full" />
              </td>
              <td class="p-4">
                <select
                  v-model="user.role"
                  @change="() => updateUserRole(user.id, user.role)"
                  class="bg-gray-900 text-white px-3 py-1 rounded border border-gray-600"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    
    <script setup lang="ts">
    definePageMeta({
      layout: "admin",
      middleware: "admin",
    });
    
    import { useAdminUsers } from "@/composables/useAdminUsers";
    const { users, loading, updateUserRole } = useAdminUsers();
    </script>
    