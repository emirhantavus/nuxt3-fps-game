<template>
  <div class="p-6">
    <h2 class="text-3xl font-bold mb-4">Item Yönetimi</h2>

    <div class="flex justify-between items-center mb-6">
      <input
        v-model="search"
        placeholder="İtem adına göre ara..."
        class="bg-gray-900 text-white px-4 py-2 rounded border border-gray-600 w-1/2"
      />
      <button
        @click="showModal = true"
        class="bg-valorantRed text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Yeni Item Ekle
      </button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
        @click="router.push(`/admin/items/${item.id}`)"
      >
        <img
          :src="item.image"
          alt="item görsel"
          class="w-full h-40 object-cover mb-4 rounded"
        />
        <h3 class="text-lg font-semibold text-white">{{ item.name }}</h3>
        <p class="text-sm text-gray-400">Tür: {{ item.type }}</p>
        <p class="text-sm text-gray-400">Hasar: {{ item.damage }}</p>
        <p class="text-sm text-gray-400">Mermi: {{ item.ammo }}</p>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div class="bg-gray-900 p-6 rounded-lg w-full max-w-md relative">
        <button
          class="absolute top-2 right-2 text-gray-400 hover:text-white"
          @click="showModal = false"
        >
          ✕
        </button>
        <h3 class="text-xl text-white font-bold mb-4">Yeni Item Ekle</h3>
        <form @submit.prevent="addItem">
          <div class="mb-3">
            <label class="text-gray-300">İsim:</label>
            <input v-model="form.name" class="input-box" required />
          </div>
          <div class="mb-3">
            <label class="text-gray-300">Tür:</label>
            <input v-model="form.type" class="input-box" required />
          </div>
          <div class="mb-3">
            <label class="text-gray-300">Hasar:</label>
            <input v-model.number="form.damage" type="number" class="input-box" required />
          </div>
          <div class="mb-3">
            <label class="text-gray-300">Mermi:</label>
            <input v-model.number="form.ammo" type="number" class="input-box" required />
          </div>
          <div class="mb-3">
            <label class="text-gray-300">Görsel URL:</label>
            <input v-model="form.image" class="input-box" required />
          </div>
          <button type="submit" class="bg-valorantRed text-white w-full py-2 rounded mt-2 hover:bg-red-700">
            Ekle
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

import { ref, computed, onMounted } from 'vue';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/composables/firebase';
import { useRouter } from 'vue-router';

const router = useRouter();

const items = ref<any[]>([]);
const search = ref('');
const showModal = ref(false);

const form = ref({
  name: '',
  type: '',
  damage: 0,
  ammo: 0,
  image: ''
});

const fetchItems = async () => {
  const snapshot = await getDocs(collection(db, 'items'));
  items.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const addItem = async () => {
  await addDoc(collection(db, 'items'), form.value);
  form.value = { name: '', type: '', damage: 0, ammo: 0, image: '' };
  showModal.value = false;
  await fetchItems();
};

const filteredItems = computed(() =>
  items.value.filter(item =>
    item.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

onMounted(fetchItems);
</script>

<style scoped>
.input-box {
  width: 100%;
  padding: 0.5rem;
  background-color: #1f2937;
  color: white;
  border: 1px solid #374151;
  border-radius: 0.375rem;
  margin-top: 0.25rem;
}
</style>
