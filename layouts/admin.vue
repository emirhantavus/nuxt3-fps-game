<template>
      <div class="flex min-h-screen bg-gray-900 text-white">
        <aside class="w-64 bg-gray-800 p-6">
          <h2 class="text-xl font-bold text-valorantRed mb-6">Admin Panel</h2>
          <nav class="space-y-4">
            <NuxtLink to="/admin/dashboard" class="block hover:underline">Dashboard</NuxtLink>
            <NuxtLink to="/admin/users" class="block hover:underline">Kullanıcılar</NuxtLink>
            <NuxtLink to="/admin/products" class="block hover:underline">Ürünler</NuxtLink>
            <NuxtLink to="/admin/items" class="block hover:underline">Itemlar</NuxtLink>
            <NuxtLink to="/admin/avatars" class="block hover:underline">Avatarlar</NuxtLink>
            <NuxtLink to="/admin/wallets" class="block hover:underline">Bakiyeler</NuxtLink>
          </nav>
        </aside>
    
        <main class="flex-1 p-8">
          <slot></slot>
        </main>
      </div>
    </template>
    