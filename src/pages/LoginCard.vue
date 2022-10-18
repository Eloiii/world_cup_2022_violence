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

      <q-card-actions vertical>
        <q-btn color="primary" type="submit">
          Connexion
        </q-btn>
      </q-card-actions>
      <q-btn color="secondary" flat @click="$emit('createAccount')">
        Créer un compte
      </q-btn>
      <q-btn color="secondary" flat @click="resetPassword">
        Tu as perdu ton mot de passe gros bébé ?
      </q-btn>
    </q-form>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import {
  browserLocalPersistence,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword
} from "firebase/auth";
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
      setPersistence(auth, browserLocalPersistence)
        .then(() => {
          signInWithEmailAndPassword(auth, this.email, this.pass)
            .then((userCredential) => {
              self.showNotif("Bienvenue bg", "positive");
              self.$router.push("/");
            })
            .catch((error) => {
              self.showNotif(error.code + "-" + error.message, "negative");
            });
        });

    },
    async resetPassword() {
      if (this.email === "" || this.email === null || this.email === undefined) {
        this.showNotif("Rentre ton email", "negative");
        return;
      }
      try {
        await sendPasswordResetEmail(auth, this.email, {
          url: "http://localhost:9000"
        });
        this.showNotif("E-mail envoyé", "positive");
      } catch (error) {
        this.showNotif(error.code + "-" + error.message, "negative");
      }

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
