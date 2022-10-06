<template>
<!--  TODO VERSION MOBILE-->
  <q-page padding>
    <div class="row justify-center">
      <div class="col-8">
        <div v-if="(userData && userBets).length > 0">
          <BetRecap  v-for="bet of userBets" :key="bet"  :bet="bet" :userData="userData"/>
        </div>
        <MatchResultSkeleton v-else/>
      </div>
    </div>
  </q-page>
</template>

<script>
import BetRecap from "./BetRecap.vue";
import MatchResultSkeleton from "./MatchResultSkeleton.vue";
import {collection, doc, getDoc, onSnapshot, query, getDocs} from "firebase/firestore";
import {auth, db} from "boot/firebaseConnection";
import {getFrCountryName} from "src/getOddsApiData";
import {ref} from "vue";
import {onAuthStateChanged} from "firebase/auth";

export default {
  name: "BetList",
  components: { BetRecap, MatchResultSkeleton },
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
    let usersData = {}
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        this.userData = await this.getUserData(user);
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          usersData[doc.id] = doc.data()
        });
        this.userBets = this.userData.bets.map(function(bet) {
          bet.match.date = bet.match.date.toDate()
          return bet
        })
        console.log(this.userBets)
        console.log(usersData);
        //TODO pouvoir supprimer uniquement ses propres paris
        //TODO afficher par personne les paris (glhf)
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
