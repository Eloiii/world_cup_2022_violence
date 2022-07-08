<template>
  <q-layout view="hHh lpR fff">
    <q-header class="bg-white text-dark" reveal>
      <q-toolbar>
        <q-btn flat round dense :icon="drawer ? 'menu_open' : 'menu'" class="q-mr-sm" @click="drawer = !drawer"/>
        <q-btn flat rounded>
          <q-avatar class="q-mr-md">
            <img src="src/assets/logo.png" alt="logo">
          </q-avatar>
          <span class="text-h6">Pronostics de la coupe du monde 2022 de la violence </span>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawer" overlay bordered class="rounded-borders">
      <q-scroll-area class="fit">
        <q-list separator bordered>
          <q-item clickable v-ripple>
            <q-item-section >
              Programme
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  data : () => {
    return {
      drawer: false
    }
  }

})
</script>
