<template>
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-bold">Bakiyeler Yönetimi</h2>
        </div>
    
        <input
          v-model="searchQuery"
          placeholder="Kullanıcı UID'ye göre ara..."
          class="w-full px-4 py-2 rounded bg-gray-900 border border-gray-600 text-white mb-4"
        />
    
        <table class="w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead class="bg-gray-700 text-valorantRed">
            <tr>
              <th class="p-4 text-left">Kullanıcı UID</th>
              <th class="p-4 text-left">Bakiye (₺)</th>
              <th class="p-4">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="wallet in filteredWallets"
              :key="wallet.uid"
              class="border-b border-gray-700 hover:bg-gray-700/30"
            >
              <td class="p-4">{{ wallet.uid }}</td>
              <td class="p-4">{{ wallet.balance }}</td>
              <td class="p-4">
                <button @click="openEdit(wallet)" class="text-blue-500">Düzenle</button>
              </td>
            </tr>
          </tbody>
        </table>
    
        <!-- Düzenleme Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div class="bg-gray-900 p-6 rounded-lg w-full max-w-sm">
            <h3 class="text-2xl font-bold mb-4">Bakiye Güncelle</h3>
            <input v-model.number="selectedWallet!.balance" type="number" class="input" required />
            <div class="mt-4 flex justify-end gap-2">
              <button @click="updateWallet" class="bg-valorantRed px-4 py-2 rounded">Kaydet</button>
              <button @click="showModal = false" class="bg-gray-600 px-4 py-2 rounded">İptal</button>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    definePageMeta({
      layout: "admin",
      middleware: ["admin"],
    });
    
    import { ref, computed, onMounted } from 'vue'
    import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
    import { db } from '@/composables/firebase'
    
    interface Wallet {
      uid: string
      balance: number
    }
    
    const wallets = ref<Wallet[]>([])
    const searchQuery = ref('')
    const showModal = ref(false)
    const selectedWallet = ref<Wallet | null>(null)
    
    const fetchWallets = async () => {
      const snapshot = await getDocs(collection(db, 'wallets'))
      wallets.value = snapshot.docs.map(doc => ({
        uid: doc.id,
        balance: doc.data().balance
      }))
    }
    
    const openEdit = (wallet: Wallet) => {
      selectedWallet.value = { ...wallet }
      showModal.value = true
    }
    
    const updateWallet = async () => {
      if (selectedWallet.value && selectedWallet.value.uid) {
        await updateDoc(doc(db, 'wallets', selectedWallet.value.uid), {
          balance: selectedWallet.value.balance
        })
        await fetchWallets()
        showModal.value = false
      }
    }
    
    const filteredWallets = computed(() =>
      wallets.value.filter(w => w.uid.includes(searchQuery.value))
    )
    
    onMounted(fetchWallets)
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
    