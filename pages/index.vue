<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- Arkaplan video kısmı. sonra değiştircez. -->
    <video class="absolute top-0 left-0 w-full h-full object-cover" autoplay loop muted>
      <source src="/video1.mp4" type="video/mp4" />
    </video>

    <div class="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>

    <Navbar />

    <div class="relative flex flex-col items-center justify-center h-full text-center px-6 z-10">
      <h1 class="text-6xl font-extrabold text-white drop-shadow-lg">
        Gerçek Dünyada <span class="text-valorantRed">FPS Deneyimi</span>
      </h1>
      <p class="text-lg text-gray-300 max-w-2xl mt-4">
        Valorant'tan ilham alan, gerçek dünyada oynanan FPS oyunu. Takımını kur, ekipmanını seç ve mücadeleye katıl!
      </p>

      <div class="mt-8 flex space-x-4">
        <NuxtLink to="/login">
          <button class="bg-valorantRed px-6 py-3 rounded-lg text-white font-bold text-xl hover:opacity-80 transition-all">
            Giriş Yap
          </button>
        </NuxtLink>
        <NuxtLink to="/store">
          <button class="border-2 border-white px-6 py-3 rounded-lg text-white font-bold text-xl hover:bg-white hover:text-black transition-all">
            Daha Fazla Bilgi
          </button>
        </NuxtLink>
      </div>
    </div>
  </div>

  <!-- Haberler -->
  <section class="bg-valorantDark py-20">
    <div class="container mx-auto text-center">
      <h2 class="text-4xl text-white font-bold mb-6">Son Haberler</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="haber in haberler" :key="haber.id" class="bg-valorantGray p-6 rounded-lg shadow-lg">
          <img :src="haber.image" alt="haber görseli" class="rounded-lg mb-4">
          <h3 class="text-xl text-white font-bold">{{ haber.title }}</h3>
          <p class="text-gray-400">{{ haber.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Navbar from "@/components/navbar.vue";
import { ref } from "vue";

interface Haber {
  id: number;
  title: string;
  desc: string;
  image: string;
}

const haberler = ref<Haber[]>([
  { id: 1, title: "Yeni Güncelleme Yayında!", desc: "FPS Oyununa yeni harita ve silahlar eklendi.", image: "/news1.jpg" },
  { id: 2, title: "Turnuva Başlıyor!", desc: "Büyük FPS turnuvası başlıyor, kayıtları kaçırma!", image: "/news2.jpg" },
  { id: 3, title: "Dereceli Mod Güncellendi!", desc: "Dereceli sistemde denge değişiklikleri yapıldı.", image: "/news3.jpg" }
]);
</script>
