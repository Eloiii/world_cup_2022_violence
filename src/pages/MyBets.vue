<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-8">
<!--        TODO placer avatar (ou atre) du coté parié et trouver où mettre le montant parié-->
        <MatchResult v-for="bet of userBets" :key="bet" :match="bet.match" :title="''" />
      </div>
    </div>
  </q-page>
</template>

<script>
import MatchResult from "./MatchResult.vue";
import {collection, doc, getDoc, onSnapshot, query} from "firebase/firestore";
import {auth, db} from "boot/firebaseConnection";
import {getFrCountryName} from "src/getOddsApiData";
import {ref} from "vue";
import {onAuthStateChanged} from "firebase/auth";

export default {
  name: "MyBets",
  components: { MatchResult },
  setup() {
    const userData = ref({})
    const userBets = ref([])

    async function getUserData(user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.error("No such document!");
      }
    }

    return {
      userData,
      userBets,
      getUserData,
      getFrCountryName,
    }
  },
  async mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userData = await this.getUserData(user);
        const q = query(collection(db, "users"))
        onSnapshot(q, async (querySnapshot) => {
          this.userData = await this.getUserData(user);
        })
        this.userBets = this.userData.bets.map(function(bet) {
          bet.match.date = bet.match.date.toDate()
          return bet
        })
        console.log(this.userBets)
      } else {
        this.userData = null;
      }
    });

  }
};
</script>

<style scoped>
.country {
  width: 125px;
}

.buttonOdds {
  width: 30%;
}

.cote {
  width: 135px;
  text-align: right;
}
</style>
