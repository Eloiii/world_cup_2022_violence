<template>
  <q-page padding>
    <q-form>
      <q-input v-model="country1Name" label="HOME (ENGLISH)">

      </q-input>
      <q-input v-model="country1Score" label="HOME score">

      </q-input>
      <q-input v-model="country2Name" label="AWAY(ENGLISH)">

      </q-input>
      <q-input v-model="country2Score" label="AWAY score">

      </q-input>
      <q-input v-model="winnerName" label="winner (ENGLISH)">

      </q-input>

      <q-btn color="amber-13" @click="validate()">
        Valider
      </q-btn>
    </q-form>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { addDoc, collection, doc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "boot/firebaseConnection";

export default {
  name: "AddResults",
  setup() {
    const country1Name = ref("");
    const country1Score = ref("");
    const country2Name = ref("");
    const country2Score = ref("");
    const winnerName = ref("");


    function getMatch(country1Name, country2Name, data) {
      for (const match of data) {
        if (match.country1.name === country1Name && match.country2.name === country2Name)
          return match
      }
      return null
    }

    function getMatchFromBets(country1Name, country2Name, data) {
      for (const match of data) {
        if (match.match.country1.name === country1Name && match.match.country2.name === country2Name)
          return match;
      }
      return null;
    }


    async function validate() {
      const usersData = await loadUsersData();

      const schedule = usersData[Object.keys(usersData)[0]].bets;

      const match = getMatchFromBets(country1Name.value, country2Name.value, schedule);

      if (!match) {
        console.log("match not found");
        return;
      }

      let res = {
        country1: {
          name: country1Name.value,
          score: country1Score.value
        },
        country2: {
          name: country2Name.value,
          score: country2Score.value
        },
        date: match.match.date,
        winner: winnerName.value
      };

      processResult(res, usersData).then((status) => {
        if (status)
          console.log("oui");
        else
          console.log("non");
      });
    }

    async function loadUsersData() {
      let usersData = {};
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        data.bets = data.bets.map(function (bet) {
          bet.match.date = bet.match.date.toDate();
          return bet;
        });
        usersData[doc.id] = data;
      });
      return usersData
    }

    async function processResult(result, usersData) {
      for (const userID in usersData) {
        const userData = usersData[userID];
        const userBets = userData.bets;
        updateMatch(userBets, result);
        updateCoins(userData, result);
        try {
          await updateUser(userID, userData);
        } catch (e) {
          return false;
        }
      }
      await updateResultDatabase(result)
      return true
    }

    async function updateResultDatabase(result) {
      await addDoc(collection(db, "results"), result);
    }

    async function updateUser(userID, userData) {
      try {
        const docRef = doc(db, "users", userID);
        await updateDoc(docRef, userData);
      } catch (e) {
        console.error(e)
      }
    }

    function updateMatch(matches, result) {
      if(matches.length === 0)
        return
      const match = getMatchFromBets(result.country1.name, result.country2.name, matches)
      match.match.country1.score = result.country1.score
      match.match.country2.score = result.country2.score
      if (match.bet.name === result.country1.name)
        match.bet.score = result.country1.score
      if (match.bet.name === result.country2.name)
        match.bet.score = result.country2.score
    }

    function updateCoins(userData, result) {
      const match = getMatchFromBets(result.country1.name, result.country2.name, userData.bets)
      if(!match)
        return
      const userScore = userData.score;
      if (match.bet.name === result.winner) {
        userScore.coins.push({
          amount: Math.round(getUserCoins(userData) + (Number(match.bet.stake) * match.bet.odds)),
          date: Timestamp.fromDate(new Date())
        });
        userScore.correct = userScore.correct + 1
      } else {
        userScore.coins.push({
          amount: getUserCoins(userData),
          date: Timestamp.fromDate(new Date())
        });
        userScore.wrong = userScore.wrong + 1
      }
    }

    function getUserCoins(user) {
      const coinsTab = user.score.coins;
      return coinsTab[coinsTab.length - 1].amount;
    }

    return {
      country1Name,
      country1Score,
      country2Name,
      country2Score,
      winnerName,
      validate,
    }
  }
}
</script>

<style scoped>

</style>
