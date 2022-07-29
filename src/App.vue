<template>
  <Transition>
    <router-view />
  </Transition>
</template>

<script>
import { auth } from "boot/firebaseConnection";
import { defineComponent } from "vue";
import { onAuthStateChanged } from "firebase/auth";

export default defineComponent({
  name: "App",
  async mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
      } else {
        this.$router.push("/login");
      }
    });
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
