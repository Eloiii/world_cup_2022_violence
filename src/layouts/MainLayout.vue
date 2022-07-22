<template>
  <q-layout view="hHh lpR fff">
    <q-header reveal :class="bgColor">
      <q-toolbar>
        <q-btn v-if="!currentPageIsLogin" flat round dense :icon="drawer ? 'menu_open' : 'menu'" class="q-mr-sm"
               @click="drawer = !drawer" />
        <q-btn flat rounded :to="currentPageIsLogin ? '/login' : '/'">
          <q-avatar class="q-mr-md">
            <img src="src/assets/logo.png" alt="logo">
          </q-avatar>
          <span class="text-h6">Pronostics de la coupe du monde 2022 de la violence</span>
        </q-btn>
        <q-space />
        <q-toggle v-model="darkMode" icon="dark_mode" color="purple" />
        <q-card v-if="userData" class="q-mt-xs desktop-only cursor-pointer" id="cardData" flat bordered>
          <q-item>
            <q-item-section avatar>
              <q-avatar v-if="userData.avatar === ''" color="primary text-white" class="q-mr-sm">
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
              <q-badge rounded :color="badgeColor()">
                <span class="text-subtitle2">
                  {{ getUserCoins() }}
                </span>
                <q-icon name="toll" class="q-ml-xs" />
              </q-badge>
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

    <q-drawer v-model="drawer" overlay bordered class="rounded-borders">
      <q-scroll-area class="fit">
        <q-list separator>
          <q-item clickable v-ripple>
            <q-item-section>
              Programme
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <q-space />
      <q-card v-if="userData" class="q-mt-xs mobile-only" flat bordered>
        <q-item>
          <q-item-section avatar>
            <q-avatar v-if="userData.avatar === ''" color="primary text-white" class="q-mr-sm">
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
            <q-badge rounded :color="badgeColor()">
                <span class="text-subtitle2">
                  {{ getUserCoins() }}
                </span>
              <q-icon name="toll" class="q-ml-xs" />
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
      <router-view />
    </q-page-container>

  </q-layout>
</template>
<script>
import { defineComponent } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

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
    async getUserData() {
      const username = localStorage.getItem("username");
      const user = await api.get("getUser", { params: { username: username } });
      return user.data;
    },
    toggleDarkMode() {
      this.$q.dark.toggle();
      if (this.$q.dark.isActive)
        localStorage.setItem("darkmode", "true");
      else
        localStorage.setItem("darkmode", "false");
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
      localStorage.setItem("username", null)
      this.$router.push('/login')
      this.userData = await this.getUserData()
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
  async updated() {
    this.userData = await this.getUserData();
    const darkModeStored = localStorage.getItem("darkmode");
    if (darkModeStored === "true") {
      this.darkMode = true
    } else
      this.$q.dark.set(false)
  }

});
</script>
<style scoped lang="scss">

</style>
