<template>
      <div class="p-6 max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold mb-6">🔧 Navbar Ayarları</h2>
    
        <!-- Mevcut Navbar Elemanları -->
        <div class="mb-8">
          <h3 class="text-2xl font-semibold mb-4">📋 Mevcut Linkler</h3>
          <div class="space-y-4">
            <div
              v-for="item in navbarItems"
              :key="item.id"
              class="bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div class="flex-1">
                <p class="font-semibold text-lg">{{ item.name }}</p>
                <p class="text-sm text-gray-400">
                  {{ item.link }} — {{ item.authOnly ? 'Giriş Gerekli' : 'Herkese Açık' }} — Sıra: {{ item.order }}
                </p>
              </div>
              <div class="flex gap-2">
                <button @click="editItem(item)" class="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Düzenle</button>
                <button @click="deleteItem(item.id)" class="bg-red-600 px-4 py-2 rounded hover:bg-red-700">Sil</button>
              </div>
            </div>
          </div>
        </div>
    
        <!-- Yeni / Düzenleme -->
        <div class="mb-6">
          <h3 class="text-2xl font-semibold mb-4">{{ editingItem ? '📝 Linki Düzenle' : '➕ Yeni Link Ekle' }}</h3>
    
          <div class="grid gap-4 grid-cols-1 md:grid-cols-4 mb-4">
            <input v-model="form.name" placeholder="Buton Adı" class="input" />
            <input v-model="form.link" placeholder="Yol (/path)" class="input" />
            <select v-model="form.authOnly" class="input">
              <option :value="false">Herkese Açık</option>
              <option :value="true">Sadece Giriş Yapan</option>
            </select>
            <input v-model.number="form.order" type="number" placeholder="Sıra (1-99)" class="input" />
          </div>
    
          <div class="flex gap-4">
            <button
              @click="editingItem ? updateItem() : addItem()"
              class="bg-green-600 px-6 py-3 rounded hover:bg-green-700"
            >
              {{ editingItem ? 'Kaydet' : 'Ekle' }}
            </button>
            <button v-if="editingItem" @click="resetForm" class="bg-gray-600 px-6 py-3 rounded hover:bg-gray-700">
              Vazgeç
            </button>
          </div>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    definePageMeta({
      layout: 'admin',
      middleware: 'admin'
    })
    
    import { ref, onMounted } from 'vue'
    import {
      collection,
      getDocs,
      addDoc,
      updateDoc,
      deleteDoc,
      doc,
      query,
      orderBy
    } from 'firebase/firestore'
    import { db } from '@/composables/firebase'
    
    interface NavbarItem {
      id?: string
      name: string
      link: string
      authOnly: boolean
      order: number
    }
    
    const navbarItems = ref<NavbarItem[]>([])
    const form = ref<NavbarItem>({
      name: '',
      link: '',
      authOnly: false,
      order: 1
    })
    const editingItem = ref<NavbarItem | null>(null)
    
    const fetchNavbar = async () => {
      const q = query(collection(db, 'navbar'), orderBy('order'))
      const snap = await getDocs(q)
      navbarItems.value = snap.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as NavbarItem)
      }))
    }
    
    const addItem = async () => {
      if (!form.value.name || !form.value.link || !form.value.order) return
      await addDoc(collection(db, 'navbar'), form.value)
      resetForm()
      await fetchNavbar()
    }
    
    const editItem = (item: NavbarItem) => {
      form.value = { ...item }
      editingItem.value = item
    }
    
    const updateItem = async () => {
      if (!editingItem.value?.id) return
      await updateDoc(doc(db, 'navbar', editingItem.value.id), {
        name: form.value.name,
        link: form.value.link,
        authOnly: form.value.authOnly,
        order: form.value.order
      })
      resetForm()
      await fetchNavbar()
    }
    
    const deleteItem = async (id: string | undefined) => {
      if (!id) return
      await deleteDoc(doc(db, 'navbar', id))
      await fetchNavbar()
    }
    
    const resetForm = () => {
      form.value = {
        name: '',
        link: '',
        authOnly: false,
        order: 1
      }
      editingItem.value = null
    }
    
    onMounted(fetchNavbar)
    </script>
    
    <style scoped>
    .input {
      width: 100%;
      padding: 8px 12px;
      background-color: #1f2937;
      border: 1px solid #4b5563;
      color: white;
      border-radius: 6px;
    }
    </style>
    