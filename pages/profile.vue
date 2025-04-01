<template>
  <div class="relative w-full min-h-screen bg-valorantDark text-white">
    <Navbar class="fixed top-0 left-0 w-full z-50" />
    <div class="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10 blur-sm" style="background-image: url('/foto1.png')"></div>

    <div class="relative z-10 container mx-auto pt-28 px-6">
      <div v-if="authLoaded && currentUser" class="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <!-- Sol Panel -->
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
          <img
            :src="currentUser.photoURL || '/avatar.png'"
            class="w-28 h-28 object-cover rounded-full border-4 border-valorantRed mx-auto mb-4"
          />
          <h2 class="text-xl font-bold">{{ currentUser.email }}</h2>
          <p class="text-sm text-gray-400 mb-2">UID: {{ currentUser.uid }}</p>

          <button @click="showAvatarModal = true" class="mt-4 bg-valorantRed px-4 py-2 rounded w-full font-bold hover:opacity-80">
            Avatarı Değiştir
          </button>

          <NuxtLink to="/update-password" class="block mt-4 text-valorantRed hover:underline">
            Şifreyi Güncelle
          </NuxtLink>
        </div>

        <!-- Sağ Panel -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Hakkımda -->
          <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold text-valorantRed mb-2">Hakkımda</h3>
            <textarea v-model="bio" class="w-full bg-gray-900 p-3 rounded resize-none text-white" rows="4" />
            <button @click="updateBio" class="mt-2 bg-valorantRed px-4 py-1 rounded font-bold hover:opacity-80">
              Kaydet
            </button>
            <p v-if="bioMessage" class="text-green-400 text-sm mt-1">{{ bioMessage }}</p>
          </div>

          <!-- İstatistik Kartları -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-gray-800 p-4 rounded shadow text-center">
              <h4 class="text-lg font-bold text-valorantRed">Oynanan Maç</h4>
              <p class="text-2xl font-bold">120</p>
            </div>
            <div class="bg-gray-800 p-4 rounded shadow text-center">
              <h4 class="text-lg font-bold text-valorantRed">Galibiyet</h4>
              <p class="text-2xl font-bold">82</p>
            </div>
            <div class="bg-gray-800 p-4 rounded shadow text-center">
              <h4 class="text-lg font-bold text-valorantRed">En Çok Silah</h4>
              <p class="text-xl">AK-47</p>
            </div>
          </div>

          <!-- Son Kazanılan Ürünler -->
          <div class="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 class="text-xl font-bold text-valorantRed mb-3">Son Kazanılan Eşyalar</h3>
            <div class="flex gap-4 overflow-x-auto">
              <div
                v-for="item in latestItems"
                :key="item.id"
                class="bg-gray-900 p-3 rounded w-40 shrink-0"
              >
                <img :src="item.image" class="w-full h-20 object-cover rounded mb-2" />
                <p class="text-sm font-bold">{{ item.name }}</p>
              </div>
            </div>
          </div>

          <!-- Takipçi / Takip edilen -->
          <div class="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 class="text-xl font-bold text-valorantRed mb-2">Sosyal</h3>
            <p>Takipçi: <span class="font-bold">43</span></p>
            <p>Takip Edilen: <span class="font-bold">27</span></p>
          </div>
        </div>
      </div>
    </div>

    <!-- Avatar Modal -->
    <div v-if="showAvatarModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div class="bg-gray-900 p-6 rounded-lg max-w-md w-full">
        <h2 class="text-xl font-bold text-valorantRed mb-4">Avatar Seç</h2>
        <div class="grid grid-cols-4 gap-3 max-h-[250px] overflow-y-auto">
          <img
            v-for="(avatar, i) in avatars"
            :key="i"
            :src="avatar.url"
            class="w-16 h-16 object-cover rounded-full border-4 cursor-pointer"
            :class="selectedAvatar === avatar.url ? 'border-valorantRed' : 'border-transparent'"
            @click="selectedAvatar = avatar.url"
          />
        </div>
        <button @click="confirmAvatar" class="mt-4 bg-valorantRed px-4 py-2 rounded w-full font-bold hover:opacity-80">
          Güncelle
        </button>
        <button @click="showAvatarModal = false" class="mt-2 text-sm text-gray-400 hover:underline w-full text-center">
          Vazgeç
        </button>
        <p v-if="avatarMessage" class="text-green-400 text-sm mt-2">{{ avatarMessage }}</p>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import Navbar from "@/components/navbar.vue";
import { useAuthRedirect } from "@/composables/useAuthRedirect";
import { useAuth } from "@/composables/auth";
import { updateProfile } from "firebase/auth";
import { db } from "@/composables/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { onMounted, ref } from "vue";

useAuthRedirect();

const { currentUser, authLoaded } = useAuth();

const avatars = ref<{ url: string }[]>([]);
const selectedAvatar = ref("");
const showAvatarModal = ref(false);
const avatarMessage = ref("");

const bio = ref("");
const bioMessage = ref("");

const latestItems = ref<any[]>([]);

const fetchAvatars = async () => {
  const snap = await getDocs(collection(db, "avatars"));
  avatars.value = snap.docs.map((doc) => ({
    url: doc.data().url,
  }));
};

const fetchBio = async () => {
  if (!currentUser.value) return;
  const docRef = doc(db, "users", currentUser.value.uid);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    bio.value = snap.data().bio || "";
  }
};

const updateBio = async () => {
  if (!currentUser.value) return;
  const docRef = doc(db, "users", currentUser.value.uid);
  await updateDoc(docRef, { bio: bio.value });
  bioMessage.value = "Hakkımda başarıyla güncellendi!";
};

const confirmAvatar = async () => {
  if (!currentUser.value || !selectedAvatar.value) return;
  await updateProfile(currentUser.value, { photoURL: selectedAvatar.value });
  avatarMessage.value = "Avatar güncellendi!";
  showAvatarModal.value = false;
};

const fetchRecentInventory = async () => {
  if (!currentUser.value) return;
  const snap = await getDocs(collection(db, `inventory/${currentUser.value.uid}/items`));

  const items = [];

  for (const docSnap of snap.docs.slice(-3).reverse()) {
    const data = docSnap.data();
    const productRef = doc(db, "products", data.productId);
    const productSnap = await getDoc(productRef);

    items.push({
      ...data,
      image: productSnap.exists() ? productSnap.data().image : "/avatar.png",
    });
  }

  latestItems.value = items;
};

onMounted(() => {
  fetchAvatars();
  fetchBio();
  fetchRecentInventory();
});
</script>
