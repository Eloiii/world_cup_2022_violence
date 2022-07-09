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
export default {
  name: "LoginCard",
  data: () => {
    return {
      name: "",
      pass: "",
    };
  },
  methods: {
    submit() {
      console.log('login');
    }
  }
};
</script>

<style scoped>

</style>
