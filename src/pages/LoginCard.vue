<template>
  <q-card class="q-pa-lg card">
    <q-card-section>
      <div class="text-h5">
        Se connecter
      </div>
    </q-card-section>

    <q-form @submit="submit">
      <q-card-section>
        <q-input v-model="email" :rules="[val => !!val || 'Champ requis']" class="q-mb-xs" label="E-mail"
                 outlined />
        <q-input v-model="pass" :rules="[val => !!val || 'Champ requis']" class="q-mb-xs" label="Mot de passe" outlined
                 type="password" />
      </q-card-section>

      <q-card-actions>
        <q-btn color="primary" flat type="submit">
          Connexion
        </q-btn>
        <q-btn color="primary" flat @click="$emit('createAccount')">
          Créer un compte
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "boot/firebaseConnection";

export default {
  name: "LoginCard",
  data: () => {
    return {
      email: "",
      pass: ""
    };
  },
  methods: {
    async submit() {
      const self = this;
      signInWithEmailAndPassword(auth, this.email, this.pass)
        .then((userCredential) => {
          self.showNotif("Bienvenue bg", "positive");
          self.$router.push("/");
        })
        .catch((error) => {
          self.showNotif(error.code + "-" + error.message, "negative");
        });
      /*const login = await loginUser({email : this.email, pass: this.pass})
      if (login) {
        this.showNotif("Bienvenue bg", "positive")
        localStorage.setItem('uidLogged', login.uid)
        this.$router.push('/')
      } else {
        this.showNotif("T'existes pas ou mot de passe incorrect", "negative")
      }*/
    }
  },
  setup() {
    const $q = useQuasar();
    return {
      showNotif(message, type) {
        $q.notify({
          message: message,
          type: type
        });
      }
    };
  }
};
</script>

<style scoped>

</style>
