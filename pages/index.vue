<template>
  <div>
    <!-- Hero -->
    <div class="relative w-full h-screen">
      <Navbar class="fixed top-0 left-0 w-full z-50" />

      <!-- Arka plan video -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden">
        <video
          v-if="homepage?.videoUrl"
          autoplay
          loop
          muted
          playsinline
          class="w-full h-full object-cover"
        >
          <source :src="`/${homepage.videoUrl}`" type="video/mp4" />
        </video>
      </div>

      <!-- Siyah transparan katman -->
      <div class="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>

      <!-- İçerik -->
      <div class="relative flex flex-col items-center justify-center h-full text-center px-6 z-10">
        <h1 class="text-6xl font-extrabold text-white drop-shadow-lg">
          {{ homepage.heroTitle }}
        </h1>
        <p class="text-lg text-gray-300 max-w-2xl mt-4">
          {{ homepage.heroDescription }}
        </p>

        <div class="mt-8 flex space-x-4">
          <NuxtLink :to="homepage.button1Link">
            <button class="bg-valorantRed px-6 py-3 rounded-lg text-white font-bold text-xl hover:opacity-80 transition-all">
              {{ homepage.button1Text }}
            </button>
          </NuxtLink>
          <NuxtLink to="#intro">
            <button class="border-2 border-white px-6 py-3 rounded-lg text-white font-bold text-xl hover:bg-white hover:text-black transition-all">
              {{ homepage.button2Text }}
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Son Haberler -->
    <section class="bg-white py-20 text-black">
      <div class="container mx-auto text-center">
        <h2 class="text-4xl font-bold mb-6">📰 Son Haberler</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <NuxtLink
            v-for="haber in haberler"
            :key="haber.id"
            :to="`/news/${haber.id}`"
            class="bg-gray-100 p-6 rounded-lg shadow-lg hover:scale-[1.02] transition-all"
          >
            <img :src="haber.image" class="rounded-lg mb-4" />
            <h3 class="text-xl font-bold">{{ haber.title }}</h3>
            <p class="text-gray-600">{{ haber.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Haritalar -->
    <section class="bg-gray-900 py-20 text-white">
      <div class="container mx-auto text-center">
        <h2 class="text-4xl font-bold mb-6">🗺️ Harita Tanıtımı</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <NuxtLink
            v-for="map in maps"
            :key="map.id"
            to="/maps"
            class="bg-gray-800 p-4 rounded-lg shadow-md hover:scale-[1.02] transition-all"
          >
            <img :src="map.images[0]" class="rounded mb-4 h-48 w-full object-cover" />
            <h3 class="text-xl font-semibold">{{ map.title }}</h3>
            <p class="text-gray-400 text-sm">{{ map.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Oyun Tanıtımı -->
    <section id="intro" class="bg-gray-100 text-black py-24 px-6">
      <div class="container mx-auto flex flex-col md:flex-row items-center gap-12 max-w-6xl">
        <img :src="homepage.introImage" class="w-full md:w-1/2 rounded-lg shadow-lg" />
        <div class="md:w-1/2">
          <h2 class="text-4xl font-extrabold mb-6">{{ homepage.introTitle }}</h2>
          <p class="text-lg leading-relaxed">{{ homepage.introDescription }}</p>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { doc, getDoc, collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from '@/composables/firebase'
import Navbar from '@/components/navbar.vue'
import Footer from '@/components/footer.vue'

const homepage = ref<any>({})
const haberler = ref<any[]>([])
const maps = ref<any[]>([])

onMounted(async () => {
  const homepageSnap = await getDoc(doc(db, 'homepage', 'main'))
  if (homepageSnap.exists()) {
    homepage.value = homepageSnap.data()
  }

  const newsSnap = await getDocs(query(collection(db, 'news'), orderBy('createdAt', 'desc')))
  haberler.value = newsSnap.docs.slice(0, 3).map(doc => ({ id: doc.id, ...doc.data() }))

  const mapsSnap = await getDocs(query(collection(db, 'maps'), orderBy('createdAt', 'desc')))
  maps.value = mapsSnap.docs.slice(0, 3).map(doc => ({ id: doc.id, ...doc.data() }))
})
</script>
