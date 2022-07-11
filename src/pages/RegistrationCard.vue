<template>
  <q-card class="q-pa-lg card">
    <q-btn round flat icon="arrow_back" @click="$emit('goBack')" />
    <q-card-section>
      <div class="text-h5">
        Créer un compte
      </div>
    </q-card-section>

    <q-form @submit="submit">
      <q-card-section>
        <q-input v-model="name" label="Nom" outlined class="q-mb-xs"
                 :rules="[val => val.length <= 10 || '10 caractères max', val => !!val || 'Champ requis']" />
        <q-input type="password" v-model="pass" label="Mot de passe" outlined class="q-mb-xs"
                 :rules="[val => !!val || 'Champ requis']" />
        <q-input type="password" v-model="passConfirmation" label="Confirmation mot de passe" outlined class="q-mb-xs"
                 :rules="[val => !!val || 'Champ requis']" />
        <q-input type="url" v-model="ppLink" label="Lien image de profil" outlined />

      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-h6 q-mb-md">
          Prévisualisation
        </div>

        <q-avatar v-if="ppLink?.length === 0 || ppLink === null" color="primary text-white" class="q-mr-sm">
          {{ name?.substring(0, 2) }}
        </q-avatar>
        <q-avatar v-else class="q-mr-sm">
          <img :src="ppLink" alt="user profile picture">
        </q-avatar>

        <span class="text-body1"> {{ name }} </span>

      </q-card-section>
      <q-card-actions>
        <q-btn flat color="primary" type="submit">
          Valider
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import bcrypt from 'bcryptjs'
import { useQuasar } from "quasar";
import { api } from '/src/boot/axios'

export default {
  name: "RegistrationCard",
  data: () => {
    return {
      ppLink: "",
      name: "",
      pass: "",
      passConfirmation: ""
    };
  },
  methods: {
    async submit() {
      const self = this
      if(this.pass !== this.passConfirmation) {
        this.showNotif("Les mots de passe ne correspondent pas", "negative")
        return
      }
      const usernameCheck = await api.get('getUser', {params: {username: this.name}})
      if(usernameCheck.data !== "") {
        this.showNotif("Quelqu'un a déjà ce nom", "negative")
        return
      }
      await bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(self.pass, salt, function (err, hash) {
          const newUser = {
            name : self.name,
            pass: hash,
            avatar : self.ppLink,
            score : {
              coins : [
                {
                  amount : 0,
                  date: new Date("2022-11-18")
                }
              ],
              forecasted : 0,
              correct : 0,
              wrong : 0
            }
          }
          api.post('addUser', newUser).then(res => {
            self.showNotif("TOUT EST BON GO GO GO !", 'positive')
            self.$emit('goBack')
          })
        })
      })
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
.card {
  width: 100%;
  max-width: 340px;
}
</style>
