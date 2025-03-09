<template>
  <nav class="absolute top-0 left-0 w-full bg-valorantDark/90 backdrop-blur-md p-4 shadow-md z-50">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-2xl font-bold text-valorantRed tracking-wider">FPS Oyun</h1>
      <ul class="flex space-x-6">
        <li><NuxtLink to="/" class="text-white hover:text-valorantRed transition-all">Ana Sayfa</NuxtLink></li>
        <li><NuxtLink to="/store" class="text-white hover:text-valorantRed transition-all">Mağaza</NuxtLink></li>
        <li><NuxtLink to="/profile" class="text-white hover:text-valorantRed transition-all">Profil</NuxtLink></li>
      </ul>
      <NuxtLink to="/login">
        <button class="bg-valorantRed px-4 py-2 rounded-lg text-white font-bold hover:opacity-80 transition-all">
          Giriş Yap
        </button>
      </NuxtLink>
    </div>
  </nav>
</template>
