<template>
  <q-layout view="hHh lpR fff">
    <q-header :class="bgColor" reveal>
      <q-toolbar>
        <q-btn v-if="!currentPageIsLogin" :icon="drawer ? 'menu_open' : 'menu'" class="q-mr-sm" dense flat round
               @click="drawer = !drawer" />
        <q-btn :to="currentPageIsLogin ? '/login' : '/'" flat rounded>
          <q-avatar class="q-mr-md">
            <img alt="logo" src="~assets/logo.png">
          </q-avatar>
          <span class="text-h6">Pronostics de la coupe du monde 2022 de la violence</span>
        </q-btn>
        <q-space />
        <q-toggle v-model="darkMode" color="purple" icon="dark_mode" />
        <q-card v-if="userData" id="cardData" class="q-mt-xs desktop-only cursor-pointer" flat>
          <q-item>
            <q-item-section avatar>
              <q-avatar v-if="userData.avatar === ''" class="q-mr-sm" color="primary text-white">
                {{ userData.name?.substring(0, 2) }}
              </q-avatar>
              <q-avatar v-else class="q-mr-sm">
                <img :src="userData.avatar" alt="user profile picture">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ userData.name }}
              </q-item-label>
              <q-item-label caption>
                <span class="text-positive">
                  + {{ userData.score.correct }}
                </span>
                /
                <span class="text-red">
                   {{ userData.score.wrong }} -
                </span>

              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <transition
                type="animation"
                mode="in-out"
                enter-active-class="animated bounceInLeft"
                leave-active-class="animated bounceInRight"
              >
              <q-badge :color="badgeColor()" rounded class="text-dark">
                <span class="text-subtitle2">
                  {{ getUserCoins() }}
                </span>
                <q-icon class="q-ml-xs" name="toll" />
              </q-badge>
              </transition>
            </q-item-section>
          </q-item>
          <q-popup-proxy>
            <q-btn color="red" flat @click="disconnectUser">
              Deconnexion
            </q-btn>
          </q-popup-proxy>
        </q-card>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" bordered class="rounded-borders" overlay>
      <q-scroll-area class="fit">
        <q-list separator>
          <q-item v-ripple clickable to="/">
            <q-item-section>
              Accueil
            </q-item-section>
          </q-item>
          <q-item v-ripple clickable to="/bet">
            <q-item-section>
              Parier
            </q-item-section>
          </q-item>
          <q-item v-ripple clickable to="/betlist">
            <q-item-section>
              Voir les paris
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-space />
      <q-card v-if="userData" bordered class="q-mt-xs mobile-only" flat>
        <q-item>
          <q-item-section avatar>
            <q-avatar v-if="userData.avatar === ''" class="q-mr-sm" color="primary text-white">
              {{ userData.name?.substring(0, 2) }}
            </q-avatar>
            <q-avatar v-else class="q-mr-sm">
              <img :src="userData.avatar" alt="user profile picture">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ userData.name }}
            </q-item-label>
            <q-item-label caption>
                <span class="text-positive">
                  + {{ userData.score.correct }}
                </span>
              /
              <span class="text-negative">
                   {{ userData.score.wrong }} -
                </span>

            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge :color="badgeColor()" rounded>
                <span class="text-subtitle2">
                  {{ getUserCoins() }}
                </span>
              <q-icon class="q-ml-xs" name="toll" />
            </q-badge>
          </q-item-section>
        </q-item>
        <q-popup-proxy>
          <q-card>
            <q-btn color="red" @click="disconnectUser">
              Deconnexion
            </q-btn>
          </q-card>
        </q-popup-proxy>
      </q-card>
    </q-drawer>


    <q-page-container>
      <router-view/>
    </q-page-container>

  </q-layout>
</template>
<script>
import { defineComponent } from "vue";
import { useQuasar } from "quasar";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "boot/firebaseConnection";
import { doc, getDoc, onSnapshot, query, collection} from "firebase/firestore";
import mitt from 'mitt'

const emitter = mitt()

export default defineComponent({
  name: "MainLayout",
  data: () => {
    return {
      drawer: false,
      darkMode: false,
      userData: null
    };
  },
  methods: {
    async getUserData(user=auth.currentUser) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
      }
    },
    toggleDarkMode() {
      this.$q.dark.toggle();
      if (this.$q.dark.isActive) {
        localStorage.setItem("darkmode", "true");
        this.$emitter.emit('toggleDarkMode', {
          dark: true
        })
      }
      else {
        this.$emitter.emit('toggleDarkMode', {
          dark: false
        })
      }
    },
    getUserCoins() {
      const coinsTab = this.userData.score.coins;
      return coinsTab[coinsTab.length - 1].amount;
    },
    badgeColor() {
      const coinsTab = this.userData.score.coins;
      const coinsAmount = coinsTab[coinsTab.length - 1].amount;
      if (coinsAmount >= 100)
        return "positive";
      if (coinsAmount < 100 && coinsAmount >= 25)
        return "warning";
      return "negative";
    },
    async disconnectUser() {
      await signOut(auth);
      this.userData = await this.getUserData();
    }
  },
  computed: {
    currentPageIsLogin() {
      return this.$route.name === "login";
    },
    bgColor() {
      if (this.$q.dark.isActive)
        return this.currentPageIsLogin ? "bg-dark" : "bg-dark";
      return this.currentPageIsLogin ? "bg-grey-4 text-dark" : "bg-white text-dark";
    }
  },
  watch: {
    darkMode() {
      this.toggleDarkMode();
    }
  },
  setup() {
    const $q = useQuasar();
    return {
      $q
    };
  },
  async mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userData = await this.getUserData(user);
        const q = query(collection(db, "users"))
        onSnapshot(q, async (querySnapshot) => {
          this.userData = await this.getUserData(user);
        })
      } else {
        this.userData = null;
      }
    });

    const darkModeStored = localStorage.getItem("darkmode");
    if (darkModeStored === "true") {
      this.darkMode = true;
    } else
      this.$q.dark.set(false);
  }

});
</script>
<style lang="scss" scoped>
.animation {
  animation: mymove 5s;
}
@keyframes mymove {
  from {
    background-color: red;
  }
  to {
    background-color: yellow;
  }
}
</style>
