<template>
  <q-page v-if="usersData" padding>
    <div class="row justify-center">
      <div class="col-md-8 col-12">
        <q-tabs
          v-model="tab"
          align="justify"
        >
          <q-tab v-for="item in usersData" :key="item.name" :name="item.name">
            {{ item.name }}
          </q-tab>
        </q-tabs>
      </div>
    </div>
    <div class="row justify-center q-mt-xl">
      <div class="col-md-8 col-12">
        <q-tab-panels v-model="tab" animated class="bg-transparent" swipeable>
          <q-tab-panel v-for="(item, userID) in usersData" :key="item.name" :name="item.name" class="q-pa-none">
            <div v-if="usersData">
              <BetRecap v-for="bet of item.bets" :key="bet" :bet="bet" :userData="item" :userID="userID"
                        @removeBet="removeBet"/>
            </div>
            <MatchResultSkeleton v-else/>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script>
import BetRecap from "./BetRecap.vue";
import MatchResultSkeleton from "./MatchResultSkeleton.vue";
import { collection, doc, getDoc, getDocs, onSnapshot, query, Timestamp, updateDoc } from "firebase/firestore";
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
    const tab = ref("");

    async function removeBet(data) {
      const userBets = usersData.value[data.userID].bets;
      const userScore = usersData.value[data.userID].score;

      const finalBets = userBets.filter((match) => match !== data.bet);

      userScore.coins.push({
        amount: getUserCoins(usersData.value[data.userID]) + Number(data.bet.bet.stake),
        date: Timestamp.fromDate(new Date())
      });

      userScore.forecasted = userScore.forecasted - 1

      const docRef = doc(db, "users", data.userID);
      await updateDoc(docRef, {bets: finalBets, score: userScore});
    }

    function getUserCoins(user) {
      const coinsTab = user.score.coins;
      return coinsTab[coinsTab.length - 1].amount;
    }

    async function getCurrentUserData() {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    }

    function formatDate(userData) {
      return userData.bets.map(function(bet) {
        bet.match.date = bet.match.date.toDate();
        return bet;
      });
    }

    async function loadUsersData() {
      const currentUserData = await getCurrentUserData();
      let usersData = {};
      if (currentUserData.groups.length === 0) {
        if (currentUserData.bets && currentUserData.bets.length > 0) {
          currentUserData.bets = formatDate(currentUserData);
          usersData[auth.currentUser.uid] = currentUserData;
          if (!this.tab)
            this.tab = currentUserData.name;
        }
        this.usersData = usersData;
        return;
      }

      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const contains = currentUserData.groups.some(element => {
          return data.groups.includes(element);
        });
        if (contains) {
          if (data.bets && data.bets.length > 0) {
            data.bets = formatDate(data);
            data.bets = data.bets.sort((a,b) => b.match.date.getTime() - a.match.date.getTime())
            usersData[doc.id] = data;
            if (!this.tab)
              this.tab = data.name;
          }
        }
      });
      this.usersData = usersData;
    }

    return {
      userData,
      usersData,
      userBets,
      tab,
      getUserCoins,
      removeBet,
      loadUsersData,
      getFrCountryName
    };
  },
  async mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await this.loadUsersData();
      }
    });
    const q = query(collection(db, "users"));
    onSnapshot(q, async (querySnapshot) => {
      await this.loadUsersData();
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
