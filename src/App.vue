<template>
  <router-view v-slot="{ Component }">
    <transition>
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script>
import { auth } from "boot/firebaseConnection";
import { defineComponent } from "vue";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

export default defineComponent({
  name: "App",
  async mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
      } else {
        this.$router.push("/login");
      }
    });
    if (sessionStorage.getItem("oddsApiData") === null || sessionStorage.getItem("oddsApiData") === "null") {
      const getOddsApiData = await axios.get("https://europe-west1-violence-qatar2022.cloudfunctions.net/getOddsApiData");
      sessionStorage.setItem("oddsApiData", JSON.stringify({
        data: getOddsApiData.data ,
        date: new Date()
      }));
    }
  }
});
</script>
<style>
@import url('https://rsms.me/inter/inter.css');

* {
  font-family: 'Inter', sans-serif;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

</style>
