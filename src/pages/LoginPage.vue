<template>
  <q-page class="flex flex-center" :class="backgroundColor">
    <Transition name="slide-up">
      <login-card v-if="loginView" @createAccount="loginView = false">

      </login-card>
      <registration-card v-else @goBack="loginView = true">

      </registration-card>
    </Transition>
  </q-page>
</template>

<script>
import LoginCard from "./LoginCard.vue";
import RegistrationCard from "./RegistrationCard.vue";

export default {
  name: "LoginPage",
  components: { LoginCard, RegistrationCard },
  data: () => {
    return {
      loginView: true
    };
  },
  computed: {
    backgroundColor() {
      if (this.$q.dark.isActive)
        return "bg-dark";
      return  "bg-grey-4"
    }
  }
};
</script>

<style scoped>
.slide-up-enter-active{
  transition: all 0.3s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
