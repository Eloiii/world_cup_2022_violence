<template>
  <q-layout view="hHh lpR fff">
    <q-header :class="bgColor" reveal>
      <q-toolbar>
        <q-btn v-if="!currentPageIsLogin" :icon="drawer ? 'menu_open' : 'menu'" class="q-mr-sm" dense flat round
               @click="drawer = !drawer"/>
        <q-btn :to="currentPageIsLogin ? '/login' : '/'" flat rounded>
          <q-avatar class="q-mr-md">
            <img alt="logo" src="~assets/logo.png">
          </q-avatar>
          <span class="text-h6">Pronostics de la coupe du monde 2022 {{
              userData && userData.groups.includes("Violence") ? "de la Violence" : ""
            }}</span>
        </q-btn>
        <q-space/>
        <q-toggle v-model="darkMode" color="amber-13" icon="dark_mode"/>
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
                  <span :class="getLastCoinChange() < 0 ? 'text-negative' : 'text-positive'">
                    <q-tooltip>
                      Dernière transaction
                    </q-tooltip>
                 {{ getLastCoinChange() }}
                </span>
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge :color="badgeColor()" class="text-dark" rounded>
                <span class="text-subtitle2">
                  <number

                    :duration="3"
                    :from="previousCoinsCount"
                    :to="getUserCoins()"
                  >
                  </number>
                </span>
                <q-icon class="q-ml-xs" name="toll"/>
              </q-badge>
            </q-item-section>
          </q-item>
          <q-popup-proxy>
            <q-card>
              <q-card-section v-if="userData">
                <span class="text-h6">
                  Mes groupes
                </span>
                <q-list class="q-mt-sm">
                  <q-item v-for="group in userData.groups" :key="group">
                    <q-item-section side>
                      <q-btn color="amber-13" flat icon="close" @click="removeGroup(group)"/>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>
                        {{ group }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <q-form @submit="addGroup">
                  <q-input v-model="newGroup" label="Ajouter un groupe"/>
                </q-form>
              </q-card-section>
              <q-card-actions>
                <q-btn color="red" flat @click="disconnectUser">
                  Deconnexion
                </q-btn>
              </q-card-actions>
            </q-card>
          </q-popup-proxy>
        </q-card>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" bordered class="rounded-borders" overlay>
      <q-scroll-area :style="$q.screen.lt.md ? 'margin-top: 65px' : ''" class="fit">
        <q-list separator>
          <q-item v-ripple :to="{name: 'home'}" clickable>
            <q-item-section>
              Accueil
            </q-item-section>
          </q-item>
          <q-item v-ripple :to="{name: 'bet'}" clickable>
            <q-item-section>
              Parier
            </q-item-section>
          </q-item>
          <q-item v-ripple :to="{name: 'betlist'}" clickable>
            <q-item-section>
              Voir les paris
            </q-item-section>
          </q-item>
          <q-item v-ripple :to="{name: 'statspage'}" clickable>
            <q-item-section>
              Statistiques
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-card v-if="userData" class="q-mt-xs mobile-only absolute-top" flat>
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
              <span :class="getLastCoinChange() < 0 ? 'text-negative' : 'text-positive'">
                <q-tooltip>
                  Dernière transaction
                </q-tooltip>
                {{ getLastCoinChange() }}
              </span>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge :color="badgeColor()" rounded>
                <span class="text-subtitle2">
                  {{ getUserCoins() }}
                </span>
              <q-icon class="q-ml-xs" name="toll"/>
            </q-badge>
          </q-item-section>
        </q-item>
        <q-popup-proxy>
          <q-card>
            <q-card-section v-if="userData">
                <span class="text-h6">
                  Mes groupes
                </span>
              <q-list class="q-mt-sm">
                <q-item v-for="group in userData.groups" :key="group">
                  <q-item-section side>
                    <q-btn color="amber-13" flat icon="close" @click="removeGroup(group)"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ group }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-form @submit="addGroup">
                <q-input v-model="newGroup" label="Ajouter un groupe"/>
              </q-form>
            </q-card-section>
            <q-card-actions>
              <q-btn color="red" flat @click="disconnectUser">
                Deconnexion
              </q-btn>
            </q-card-actions>
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
import { collection, doc, getDoc, onSnapshot, query, updateDoc } from "firebase/firestore";
import mitt from "mitt";

const emitter = mitt();

export default defineComponent({
  name: "MainLayout",
  data: () => {
    return {
      drawer: false,
      darkMode: false,
      userData: null,
      previousCoinsCount: 0,
      newGroup: ""
    };
  },
  methods: {
    async addGroup() {
      if (this.newGroup === "") {
        this.showNotif("Groupe vide !", "negative")
        return
      }

      const userGroups = this.userData.groups
      userGroups.push(this.newGroup)

      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {groups: userGroups});

      this.newGroup = ""
    },

    async removeGroup(removedGroup) {
      let userGroups = this.userData.groups
      userGroups = userGroups.filter(group => group !== removedGroup)

      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {groups: userGroups});
    },

    async getUserData(user = auth.currentUser) {
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
        this.$emitter.emit("toggleDarkMode", {
          dark: true
        });
      } else {
        localStorage.setItem("darkmode", "false");
        this.$emitter.emit("toggleDarkMode", {
          dark: false
        });
      }
    },
    getUserCoins() {
      const coinsTab = this.userData.score.coins;
      this.previousCoinsCount = coinsTab[coinsTab.length - 2]
      return coinsTab[coinsTab.length - 1].amount;
    },

    badgeColor() {
      const coinsTab = this.userData.score.coins;
      const coinsAmount = coinsTab[coinsTab.length - 1].amount;
      if (coinsAmount >= 400)
        return "positive";
      if (coinsAmount < 400 && coinsAmount >= 100)
        return "warning";
      return "negative";
    },
    async disconnectUser() {
      await signOut(auth);
      this.userData = await this.getUserData();
    },
    checkEmptyGroups() {
      if (this.userData && this.userData.groups.length <= 0)
        this.showNotif("Tu ne fais partie d'aucun groupe ! Rentre le(s) groupe(s) dont tu fais partie en cliquant sur ton profil !", "warning", 5000)
    },
    getLastCoinChange() {
      if (!this.userData)
        return "?"
      const coinsTab = this.userData.score.coins;
      const diff = coinsTab[coinsTab.length - 1].amount - this.previousCoinsCount.amount
      return diff < 0 ? diff : "+" + diff
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
      $q,
      showNotif(message, type, timeout = 2500) {
        $q.notify({
          message: message,
          type: type,
          multiLine: true,
          timeout: timeout
        });
      }
    };
  },
  async mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userData = await this.getUserData(user);
        const q = query(collection(db, "users"));
        onSnapshot(q, async (querySnapshot) => {
          this.userData = await this.getUserData(user);
        });
        this.checkEmptyGroups()
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
.q-router-link--active {
  color: unset;
}

.q-router-link--exact-active {
  color: var(--q-primary);
}

</style>
