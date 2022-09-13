<template>
  <q-card class="q-pa-lg card">
    <q-btn flat icon="arrow_back" round @click="$emit('goBack')" />
    <q-card-section>
      <div class="text-h5">
        Créer un compte
      </div>
    </q-card-section>

    <q-form @submit="submit">
      <q-card-section>
        <q-input v-model="name" :rules="[val => val.length <= 10 || '10 caractères max', val => !!val || 'Champ requis']" class="q-mb-xs" label="Nom"
                 outlined />
        <q-input v-model="email" :rules="[val => !!val || 'Champ requis']" class="q-mb-xs" label="E-mail" outlined
                 type="email" />
        <q-input v-model="pass" :rules="[val => val.length >= 6 || '6 caractères minimum stp', val => !!val || 'Champ requis']" class="q-mb-xs" label="Mot de passe" outlined
                 type="password" />
        <q-input v-model="passConfirmation" :rules="[val => !!val || 'Champ requis']" class="q-mb-xs" label="Confirmation mot de passe" outlined
                 type="password" />
        <q-input v-model="ppLink" label="Lien image de profil" outlined type="url" />

      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-h6 q-mb-md">
          Prévisualisation
        </div>

        <q-avatar v-if="ppLink?.length === 0 || ppLink === null" class="q-mr-sm" color="primary text-white">
          {{ name?.substring(0, 2) }}
        </q-avatar>
        <q-avatar v-else class="q-mr-sm">
          <img :src="ppLink" alt="user profile picture">
        </q-avatar>

        <span class="text-body1"> {{ name }} </span>

      </q-card-section>
      <q-card-actions>
        <q-btn color="primary" flat type="submit">
          Valider
        </q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { auth, db } from "boot/firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export default {
  name: "RegistrationCard",
  data: () => {
    return {
      ppLink: "",
      name: "",
      email: "",
      pass: "",
      passConfirmation: ""
    };
  },
  methods: {
    async submit() {
      const self = this;
      if (this.pass !== this.passConfirmation) {
        this.showNotif("Les mots de passe ne correspondent pas", "negative");
        return;
      }
      //TODO recup tous les users et regarder leurs noms pour voir que pas de doublon (idem email ?)
      let usernameCheck = {
        data: ""
      };
      if (usernameCheck.data !== "") {
        this.showNotif("Quelqu'un a déjà ce nom", "negative");
        return;
      }
      const newUser = {
        name: this.name,
        email: this.email,
        avatar: this.ppLink,
        groups: ["Violence"],
        score: {
          coins: [
            {
              amount: 100,
              date: Timestamp.fromDate(new Date("2022-11-18"))
            }
          ],
          forecasted: 0,
          correct: 0,
          wrong: 0
        },
        bets: []
      };
      try {
        const { user } = await createUserWithEmailAndPassword(auth, this.email, this.pass);
        await setDoc(doc(db, "users", user.uid), newUser);
        self.showNotif("TOUT EST BON GO GO GO !", "positive");
        self.$emit("goBack");
      } catch (error) {
        self.showNotif(error.code + "-" + error.message, "negative");
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
.card {
  width: 100%;
  max-width: 340px;
}
</style>
