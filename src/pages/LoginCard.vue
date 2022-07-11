<template>
  <q-card class="q-pa-lg card">
    <q-card-section>
      <div class="text-h5">
        Se connecter
      </div>
    </q-card-section>

    <q-form @submit="submit">
      <q-card-section>
        <q-input v-model="name" label="Nom" outlined class="q-mb-xs"
                 :rules="[val => !!val || 'Champ requis']" />
        <q-input type="password" v-model="pass" label="Mot de passe" outlined class="q-mb-xs"
                 :rules="[val => !!val || 'Champ requis']" />
      </q-card-section>

      <q-card-actions>
        <q-btn flat color="primary" type="submit">
          Connexion
        </q-btn>
        <q-btn flat color="primary" @click="$emit('createAccount')">
          Créer un compte
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import bcrypt from 'bcryptjs'
import { api } from '/src/boot/axios'

export default {
  name: "LoginCard",
  data: () => {
    return {
      name: "",
      pass: "",
    };
  },
  methods: {
    async submit() {
      const self = this
      const user = await api.get('getUser', {params: {username : self.name}})
      await bcrypt.compare(self.pass, user.data.pass, function (err, res) {
        if (res) {
          self.showNotif("Bienvenue bg", "positive")
          localStorage.setItem('username', user.data.name)
          self.$router.push('/')
        } else {
          self.showNotif("T'existes pas ou mot de passe incorrect", "negative")
        }
      });
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
