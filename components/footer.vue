<template>
      <footer class="bg-gray-800 text-white py-10 px-4 mt-10">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Sosyal Medya -->
          <div>
            <h2 class="text-xl font-bold mb-4">Topluluk</h2>
            <ul class="space-y-2">
              <li v-if="links.discord">
                <a :href="links.discord" target="_blank" class="hover:text-valorantRed">Discord</a>
              </li>
              <li v-if="links.twitter">
                <a :href="links.twitter" target="_blank" class="hover:text-valorantRed">Twitter</a>
              </li>
              <li v-if="links.instagram">
                <a :href="links.instagram" target="_blank" class="hover:text-valorantRed">Instagram</a>
              </li>
              <li v-if="links.youtube">
                <a :href="links.youtube" target="_blank" class="hover:text-valorantRed">YouTube</a>
              </li>
            </ul>
          </div>
    
          <!-- Sponsorlar -->
          <div>
            <h2 class="text-xl font-bold mb-4">Sponsorlar / Ortaklar</h2>
            <ul class="space-y-2">
              <li v-for="sponsor in links.sponsorlar" :key="sponsor">
                <span class="text-gray-300">{{ sponsor }}</span>
              </li>
            </ul>
          </div>
        </div>
    
        <div class="text-center text-gray-500 text-sm mt-10">
          © {{ new Date().getFullYear() }} FPS Oyunu. Tüm hakları saklıdır.
        </div>
      </footer>
    </template>
    
    <script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { doc, getDoc } from 'firebase/firestore'
    import { db } from '@/composables/firebase'
    
    const links = ref({
      discord: '',
      twitter: '',
      instagram: '',
      youtube: '',
      sponsorlar: [] as string[]
    })
    
    const fetchLinks = async () => {
      const docRef = doc(db, 'settings', 'footerLinks')
      const snap = await getDoc(docRef)
      if (snap.exists()) {
        links.value = snap.data() as typeof links.value
      }
    }
    
    onMounted(fetchLinks)
    </script>
    