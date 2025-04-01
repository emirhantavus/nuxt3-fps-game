<template>
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold">Avatar Yönetimi</h2>
          <button @click="openModal()" class="bg-valorantRed hover:bg-red-700 text-white px-4 py-2 rounded">
            Avatar Ekle
          </button>
        </div>
    
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="avatar in avatars" :key="avatar.id" class="bg-gray-800 rounded p-3 shadow-lg text-center">
            <img :src="avatar.url" class="w-full h-32 object-cover rounded mb-2" />
            <h3 class="text-white font-semibold">{{ avatar.name }}</h3>
            <div class="flex justify-center gap-2 mt-2">
              <button @click="openModal(avatar)" class="text-sm text-blue-400 hover:text-blue-600">Düzenle</button>
              <button @click="deleteAvatar(avatar.id as string)" class="text-sm text-red-400 hover:text-red-600">Sil</button>
            </div>
          </div>
        </div>
    
        <!-- Avatar Ekle/Düzenle Modal -->
        <div v-if="modalOpen" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div class="bg-gray-900 p-6 rounded-lg w-full max-w-md relative">
            <button @click="closeModal" class="absolute top-2 right-3 text-gray-400 hover:text-white text-xl">×</button>
            <h3 class="text-xl font-bold text-white mb-4">{{ editing ? 'Avatar Düzenle' : 'Yeni Avatar Ekle' }}</h3>
    
            <form @submit.prevent="submitAvatar">
              <label class="block mb-2 text-gray-300">Avatar Adı</label>
              <input v-model="form.name" class="input" required />
    
              <label class="block mt-4 mb-2 text-gray-300">Avatar URL</label>
              <input v-model="form.url" class="input" required />
    
              <button type="submit" class="mt-4 w-full bg-valorantRed hover:bg-red-700 text-white py-2 rounded">
                {{ editing ? 'Güncelle' : 'Ekle' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    import adminMiddleware from '~/middleware/admin.global'
    definePageMeta({
      middleware: adminMiddleware,
    });
    
    import { ref, onMounted } from 'vue'
    import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
    import { db } from '@/composables/firebase'
    
    interface Avatar {
      id?: string
      name: string
      url: string
    }
    
    const avatars = ref<Avatar[]>([])
    const modalOpen = ref(false)
    const editing = ref(false)
    
    const form = ref<Avatar>({ name: '', url: '' })
    
    const fetchAvatars = async () => {
      const snapshot = await getDocs(collection(db, 'avatars'))
      avatars.value = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Avatar) }))
    }
    
    const openModal = (avatar?: Avatar) => {
      if (avatar) {
        editing.value = true
        form.value = { ...avatar }
      } else {
        editing.value = false
        form.value = { name: '', url: '' }
      }
      modalOpen.value = true
    }
    
    const closeModal = () => {
      modalOpen.value = false
      form.value = { name: '', url: '' }
    }
    
    const submitAvatar = async () => {
      if (editing.value && form.value.id) {
        await updateDoc(doc(db, 'avatars', form.value.id as string), {
          name: form.value.name,
          url: form.value.url
        })
      } else {
        await addDoc(collection(db, 'avatars'), {
          name: form.value.name,
          url: form.value.url
        })
      }
      await fetchAvatars()
      closeModal()
    }
    
    const deleteAvatar = async (id: string) => {
      if (confirm('Avatarı silmek istediğine emin misin?')) {
        await deleteDoc(doc(db, 'avatars', id))
        await fetchAvatars()
      }
    }
    
    onMounted(fetchAvatars)
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
    