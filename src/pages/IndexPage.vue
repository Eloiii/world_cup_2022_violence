<template>
  <q-page class="q-col-gutter-xl" padding>
    <div class="row justify-evenly q-col-gutter-xs-md">
      <div class="col-md-3 col-12">
        <q-card v-if="lastResult==='rien'">
          <q-card-section>
            <span class="text-body1">
              Dernier résultat :
            </span>
          </q-card-section>
          <q-card-section class="flex justify-center column items-center">
            <img
              alt="sadge"
              src="https://lh3.googleusercontent.com/H2lTPeipM1RidN1PmxumJCra8-LF1gOngZXmDgkWOmDqSuxv0kpOpsgYAUXAxyuNwmW-z9KO53f4kn8JcafGrZhi-fEHHcSrXZA42q0=w600"
              style="width: 12%"/>
            <span class="text-body2">
              Pas encore de match joué
            </span>
          </q-card-section>
        </q-card>
        <MatchResult v-else-if="lastResult" :match="lastResult" :title="'Dernier Résultat'"/>
        <MatchResultSkeleton v-else/>
      </div>
      <div class="col-md-3 col-12">
        <MatchResult v-if="nextMatch" :match="nextMatch" :title="'Prochain Match'" />
        <q-card v-else flat>
          <q-card-section>
            <div class="text-subtitle1">
              Prochain match
            </div>
          </q-card-section>
          <q-card-section class="flex justify-center q-pa-none">
            <img
              alt="sadge"
              src="https://lh3.googleusercontent.com/H2lTPeipM1RidN1PmxumJCra8-LF1gOngZXmDgkWOmDqSuxv0kpOpsgYAUXAxyuNwmW-z9KO53f4kn8JcafGrZhi-fEHHcSrXZA42q0=w600"
              style="width: 15%" />
          </q-card-section>
          <q-card-section class="text-center">
            C'est fini
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-md-8 col-12">
        <q-table
          v-if="rows"
          v-model:pagination="pagination"
          :columns="columns"
          :grid="tableGridView"
          :loading="loading"
          :rows="rows"
          hide-bottom
          row-key="name"
          title="Leaderboard"
          :rows-per-page-options="[0]"
        >
          <template v-slot:top-right>
            <q-toggle v-model="tableGridView" color="amber-13" label="Grille"/>
          </template>
          <template v-slot:body-cell="props">
            <q-td
              :class="rowBackground(props.row.name)"
              :props="props"
            >
              {{ props.value }}
            </q-td>
          </template>
          <template v-slot:body-cell-coins="props">
            <q-td :class="rowBackground(props.row.name)" :props="props">
              <div>
                <q-badge :color="badgeColor(props.value)" class="text-dark" rounded transparent>
                <span class="text-caption">
                  {{ props.value }}
                </span>
                  <q-icon class="q-ml-xs" name="toll"/>
                </q-badge>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-name="props">
            <q-td :class="rowBackground(props.row.name)" :props="props">
              <div class="flex items-center">
                <q-avatar v-if="!userHasAvatar(props.value)" color="primary text-white" size="lg">
                  {{ props.value.substring(0, 2) }}
                </q-avatar>
                <q-avatar v-else size="lg">
                  <img :src="getUserAvatar(props.value)" alt="user profile picture">
                </q-avatar>
                <div class="q-ml-sm">
                  {{ props.value }}
                </div>
              </div>
            </q-td>
          </template>
        </q-table>
        <q-markup-table v-else>
          <thead>
          <tr>
            <th class="text-left" style="width: 150px">
              <q-skeleton animation="blink" type="text"/>
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text"/>
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text"/>
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text"/>
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text"/>
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text"/>
            </th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="n in 5" :key="n">
            <td class="text-left">
              <q-skeleton animation="blink" type="text" width="85px"/>
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="50px"/>
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="35px"/>
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="65px"/>
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="25px"/>
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="85px"/>
            </td>
          </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>
    <div v-show="!loading" class="row justify-center">
      <div class="col-md-8">
        <apexchart :options="options" :series="series" height="300" type="line" width="100%"></apexchart>
      </div>
    </div>
  </q-page>
</template>
<script>
import { defineComponent } from "vue";
import MatchResult from "./MatchResult.vue";
import MatchResultSkeleton from "./MatchResultSkeleton.vue";
import { getSchedule } from "src/getOddsApiData";
import { collection, doc, getDoc, getDocs, onSnapshot, query } from "firebase/firestore";
import { auth, db } from "boot/firebaseConnection";
import * as fr from "apexcharts/dist/locales/fr.json";
import { onAuthStateChanged } from "firebase/auth";

export default defineComponent({
  name: "IndexPage",
  components: { MatchResult, MatchResultSkeleton },
  data: () => {
    return {
      currentUserData: null,
      usersData: null,
      lastResult: null,
      nextMatch: null,
      rows: null,
      loading: true,
      tableGridView: false,
      series: [],
      columns: [
        {
          name: "name",
          label: "Nom",
          align: "left",
          sortable: true,
          field: "name",
          required: true
        },
        {
          name: "coins",
          label: "Argent",
          align: "center",
          sortable: true,
          field: "coins",
          required: true
        },
        {
          name: "correct",
          label: "Nb. Corrects",
          align: "center",
          sortable: true,
          field: "correct",
          required: true
        },
        {
          name: "wrong",
          label: "Nb. Manqués",
          align: "center",
          sortable: true,
          field: "wrong",
          required: true
        },
        {
          name: "forecasted",
          label: "Nb. pariés",
          align: "center",
          sortable: true,
          field: "forecasted",
          required: true
        }
      ],
      pagination: {
        sortBy: "coins",
        descending: true
      },
      options: {
        title: {
          text: "Évolutions de l'argent",
          offsetY: 10,
          style: {
            fontSize: "1rem",
            fontWeight: "400",
            lineHeight: "1.75rem",
            letterSpacing: "0.00937em",
            fontFamily: "Inter"
          }
        },
        theme: {
          mode: ""
        },
        chart: {
          locales: [fr],
          defaultLocale: "fr"
        },
        stroke: {
          curve: "straight"
        },
        xaxis: {
          type: "datetime"
        },
        markers: {
          size: 5
        }
      }
    };
  },
  methods: {
    getNextMatch(matchs) {
      const today = new Date();
      let nextMatch = null;
      for (let match of matchs) {
        if (match.date < today)
          continue;
        nextMatch = match;
        break;
      }
      return nextMatch;
    },
    async getResults() {
      const querySnapshot = await getDocs(collection(db, "results"));
      const res = [];
      querySnapshot.forEach((doc) => {
        const rawData = doc.data();
        res.push({
          country1: rawData.country1,
          country2: rawData.country2,
          winner: rawData.winner,
          date: rawData.date.toDate()
        });
      });
      return res;
    },
    async getCurrentUserData(user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.currentUserData = docSnap.data();
      } else {
        this.currentUserData = null
      }
    },
    async getUsersData(querySnapshot = null) {
      if (!querySnapshot)
        querySnapshot = await getDocs(collection(db, "users"));
      const res = [];
      querySnapshot.forEach((doc) => {
        const rawData = doc.data();
        const contains = this.currentUserData.groups.some(element => {
          return rawData.groups.includes(element);
        });
        if (contains)
          res.push(rawData);
      });
      this.usersData = res;
    },

    getUserDataByName(name) {
      for (const user of this.usersData) {
        if (user.name === name)
          return user
      }
      return null
    },

    userHasAvatar(userName) {
      if (userName) {
        const user = this.getUserDataByName(userName)
        return user.avatar !== ''
      }
    },


    getUserAvatar(userName) {
      const user = this.getUserDataByName(userName)
      return user.avatar
    },

    async getLeaderboardData() {
      const res = [];
      for (const userData of this.usersData) {
        if (this.currentUserData.groups.some(r => userData.groups.includes(r)))

          res.push({
            name: userData.name,
            coins: userData.score.coins[userData.score.coins.length - 1].amount,
            correct: userData.score.correct,
            wrong: userData.score.wrong,
            forecasted: userData.score.forecasted
          });
      }
      this.rows = res;
    },
    getChartData() {
      const res = [];
      for (const userData of this.usersData) {
        let data = [];
        const groupBy = (x, f) => x.reduce((a, b, i) => ((a[f(b, i, x)] ||= []).push(b), a), {}); //thanks stackoverflow
        const offset = Math.abs(userData.score.coins[0].date.toDate().getTimezoneOffset() / 60);
        const filteredByDateData = groupBy(userData.score.coins, v => v.date.toDate().setHours(offset, 0, 0, 0));
        for (const date in filteredByDateData) {
          const sortedRecords = filteredByDateData[date].sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());

          data.push({
            x: new Date(Number(date)).getTime(),
            y: sortedRecords[0].amount
          });
        }
        res.push({
          name: userData.name,
          data: data
        });
      }
      this.series = res;
    },
    rowBackground(name) {
      if (this.currentUserData.name === name) {
        if (this.$q.dark.isActive)
          return "bg-grey-9";
        return "bg-grey-3";
      }
    },
    badgeColor(coinsAmount) {
      if (coinsAmount >= 400)
        return "positive";
      if (coinsAmount < 400 && coinsAmount >= 100)
        return "warning";
      return "negative";
    },

    async loadBackEndData(user = auth.currentUser, querySnapshot = null) {
      await this.getCurrentUserData(user);
      await this.getUsersData(querySnapshot);
      await this.getLeaderboardData();
      this.getChartData();
      this.loading = false;
    },

    async loadOddsApiData() {
      let oddsApiData = JSON.parse(sessionStorage.getItem("oddsApiData"));
      const schedule = getSchedule(oddsApiData.data);
      this.nextMatch = this.getNextMatch(schedule);

      const rawResults = await this.getResults();
      const results = Object.entries(rawResults);
      for (let result of results) {
        result[1].date = new Date(result[1].date);
      }
      results.sort((a, b) => b[1].date.getTime() - a[1].date.getTime());
      if (results.length > 0)
        this.lastResult = results[0][1];
      else
        this.lastResult = 'rien'
    }
  },
  async mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await this.loadBackEndData(user)
      }
    });
    const q = query(collection(db, "users"));
    onSnapshot(q, async (querySnapshot) => {
      await this.loadBackEndData(auth.currentUser, querySnapshot)
    });


    const timerOddsApi = setInterval(async () => {
      if(this.nextMatch !== null)
        clearInterval(timerOddsApi)
      await this.loadOddsApiData()
    }, 500)

    this.$emitter.on("toggleDarkMode", (dark) => {
      setTimeout(() =>
        this.options = {
          title: {
            text: "Évolutions de l'argent",
            offsetY: 10,
            style: {
              fontSize: "1rem",
              fontWeight: "400",
              lineHeight: "1.75rem",
              letterSpacing: "0.00937em",
              fontFamily: "Inter"
            }
          },
          theme: {
            mode: dark.dark ? "dark" : "light"
          },
          chart: {
            locales: [fr],
            defaultLocale: "fr"
          },
          stroke: {
            curve: "straight"
          },
          xaxis: {
            type: "datetime"
          },
          markers: {
            size: 5
          }
        }, 50);


    });
  }
});
</script>
