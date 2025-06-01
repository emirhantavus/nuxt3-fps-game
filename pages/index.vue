<template>
  <div class="overflow-x-hidden">
    <!-- Hero -->
    <div class="relative w-full min-h-[70vh] md:h-screen flex flex-col">
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
      <div class="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
      <div class="relative flex flex-col items-center justify-center h-full text-center px-4 z-10">
        <h1 class="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg leading-tight">
          {{ homepage.heroTitle }}
        </h1>
        <p class="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl mt-4">
          {{ homepage.heroDescription }}
        </p>
        <div class="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md md:max-w-lg mx-auto" v-if="authLoaded && !currentUser">
          <NuxtLink :to="homepage.button1Link" class="flex-1">
            <button class="bg-valorantRed px-6 py-3 rounded-lg text-white font-bold text-lg sm:text-xl w-full hover:opacity-80 transition-all">
              {{ homepage.button1Text }}
            </button>
          </NuxtLink>
          <NuxtLink to="#intro" class="flex-1">
            <button class="border-2 border-white px-6 py-3 rounded-lg text-white font-bold text-lg sm:text-xl w-full hover:bg-white hover:text-black transition-all">
              {{ homepage.button2Text }}
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Son Haberler -->
    <section class="bg-white py-14 sm:py-20 text-black">
      <div class="container mx-auto px-3 text-center">
        <h2 class="text-2xl sm:text-4xl font-bold mb-6">📰 Son Haberler</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <NuxtLink
            v-for="haber in haberler"
            :key="haber.id"
            :to="`/news/${haber.id}`"
            class="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-lg hover:scale-[1.02] transition-all flex flex-col"
          >
            <img :src="haber.image" class="rounded-lg mb-4 w-full aspect-video object-cover" />
            <h3 class="text-lg sm:text-xl font-bold mb-2">{{ haber.title }}</h3>
            <p class="text-gray-600 text-sm sm:text-base">{{ haber.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Haritalar -->
    <section class="bg-gray-900 py-14 sm:py-20 text-white">
      <div class="container mx-auto px-3 text-center">
        <h2 class="text-2xl sm:text-4xl font-bold mb-6">🗺️ Harita Tanıtımı</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          <NuxtLink
            v-for="map in maps"
            :key="map.id"
            to="/maps"
            class="bg-gray-800 p-3 sm:p-4 rounded-lg shadow-md hover:scale-[1.02] transition-all flex flex-col"
          >
            <img :src="map.images[0]" class="rounded mb-4 w-full aspect-video object-cover" />
            <h3 class="text-lg sm:text-xl font-semibold mb-1">{{ map.title }}</h3>
            <p class="text-gray-400 text-xs sm:text-sm">{{ map.description }}</p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Oyun Tanıtımı -->
    <section id="intro" class="bg-gray-100 text-black py-16 sm:py-24 px-4">
      <div class="container mx-auto max-w-4xl md:max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <img :src="homepage.introImage"
          class="w-full max-w-xs sm:max-w-md md:max-w-none md:w-1/2 rounded-lg shadow-lg mb-6 md:mb-0"
          alt="Oyun tanıtım resmi"
        />
        <div class="w-full md:w-1/2">
          <h2 class="text-2xl sm:text-4xl font-extrabold mb-4 sm:mb-6">{{ homepage.introTitle }}</h2>
          <p class="text-base sm:text-lg leading-relaxed break-words">{{ homepage.introDescription }}</p>
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
import { useAuth } from '@/composables/auth'

const homepage = ref<any>({})
const haberler = ref<any[]>([])
const maps = ref<any[]>([])

const { currentUser, authLoaded } = useAuth()

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
