<template>
  <!--  TODO VERSION MOBILE-->
  <q-page padding v-if="usersData">
    <div class="row justify-center">
      <div class="col-8">
        <q-tabs
          align="justify"
          v-model="tab"
        >
          <q-tab v-for="item in usersData" :key="item.name" :name="item.name">
            {{ item.name }}
          </q-tab>
        </q-tabs>
      </div>
    </div>
    <div class="row justify-center q-mt-xl">
      <div class="col-8">
        <q-tab-panels v-model="tab" animated class="bg-transparent">
          <q-tab-panel v-for="item in usersData" :key="item.name" :name="item.name">
            <div v-if="usersData">
              <BetRecap v-for="bet of item.bets" :key="bet" :bet="bet" :userData="item" />
            </div>
            <MatchResultSkeleton v-else />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script>
import BetRecap from "./BetRecap.vue";
import MatchResultSkeleton from "./MatchResultSkeleton.vue";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "boot/firebaseConnection";
import { getFrCountryName } from "src/getOddsApiData";
import { ref } from "vue";
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: "BetList",
  components: { BetRecap, MatchResultSkeleton },
  setup() {
    const userData = ref({});
    const usersData = ref({});
    const userBets = ref([]);
    const tab = ref('');

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
      usersData,
      userBets,
      tab,
      getUserData,
      getFrCountryName
    };
  },
  async mounted() {
    let usersData = {};
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          const data = doc.data()
          if(data.bets) {
            data.bets = data.bets.map(function(bet) {
              bet.match.date = bet.match.date.toDate();
              return bet;
            });
            usersData[doc.id] = data;
            if (!this.tab)
              this.tab = data.name
          }
        });
        this.usersData = usersData;
        //TODO pouvoir supprimer uniquement ses propres paris
        //TODO afficher par personne les paris (glhf)
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
