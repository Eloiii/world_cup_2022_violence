<template>
  <q-page class="q-col-gutter-xl" padding>
    <div class="row justify-evenly q-col-gutter-xs-md">
      <div class="col-md-3 col-12">
        <MatchResult v-if="lastResult" :match="lastResult" :title="'Dernier Résultat'" />
        <MatchResultSkeleton v-else />
      </div>
      <div class="col-md-3 col-12">
        <MatchResult v-if="nextMatch" :match="nextMatch" :title="'Prochain Match'" />
        <MatchResultSkeleton v-else />
      </div>
    </div>
    <div class="row justify-center">
      <div class="col-md-8 col-sm-12">
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
        >
          <template v-slot:top-right>
            <q-toggle v-model="tableGridView" color="purple" label="Grille" />
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
                  <q-icon class="q-ml-xs" name="toll" />
                </q-badge>
              </div>
            </q-td>
          </template>

        </q-table>
        <q-markup-table v-else>
          <thead>
          <tr>
            <th class="text-left" style="width: 150px">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
            <th class="text-right">
              <q-skeleton animation="blink" type="text" />
            </th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="n in 5" :key="n">
            <td class="text-left">
              <q-skeleton animation="blink" type="text" width="85px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="50px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="35px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="65px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="25px" />
            </td>
            <td class="text-right">
              <q-skeleton animation="blink" type="text" width="85px" />
            </td>
          </tr>
          </tbody>
        </q-markup-table>
      </div>
    </div>
    <div class="row justify-center">
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
import { collection, doc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "boot/firebaseConnection";
import * as fr from "apexcharts/dist/locales/fr.json";

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
          label: "Corrects",
          align: "center",
          sortable: true,
          field: "correct",
          required: true
        },
        {
          name: "wrong",
          label: "Ratés",
          align: "center",
          sortable: true,
          field: "wrong",
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
    async getCurrentUserData() {
      const currentUserEmail = auth.currentUser.email;
      const querySnapshot = await getDocs(collection(db, "users"));
      let res = null;
      querySnapshot.forEach((doc) => {
        const rawData = doc.data();
        if (rawData.email === currentUserEmail) {
          res = rawData;
        }
      });
      this.currentUserData = res;
    },
    async getUsersData() {
      const querySnapshot = await getDocs(collection(db, "users"));
      const res = [];
      querySnapshot.forEach((doc) => {
        const rawData = doc.data();
        res.push(rawData);
      });
      this.usersData = res;
    },
    async getLeaderboardData() {
      const res = [];
      for (const userData of this.usersData) {
        if (this.currentUserData.groups.some(r => userData.groups.includes(r)))

          res.push({
            name: userData.name,
            coins: userData.score.coins[userData.score.coins.length - 1].amount,
            correct: userData.score.correct,
            wrong: userData.score.wrong
          });
      }
      this.rows = res;
    },
    getChartData() {
      const res = [];
      for (const userData of this.usersData) {
        let data = [];
        for (const record of userData.score.coins) {
          const offset = Math.abs(record.date.toDate().getTimezoneOffset() / 60);
          const dateWithOffset = new Date(record.date.toDate().setHours(record.date.toDate().getHours()  + offset))
          data.push({
            x: dateWithOffset.getTime(),
            y: record.amount
          });
        }
        let userSeries = {
          name: userData.name,
          data: data
        };
        res.push(userSeries);
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
      if (coinsAmount >= 100)
        return "positive";
      if (coinsAmount < 100 && coinsAmount >= 25)
        return "warning";
      return "negative";
    }
  },
  async mounted() {

      // const docRef = doc(db, "users", auth.currentUser.uid);
      // await updateDoc(docRef, { bets: [], score: {
      //   coins: [
      //     {
      //       amount: 1000,
      //       date: Timestamp.fromDate(new Date(2022, 9, 19, 20, 43, 0))
      //     },
      //     {
      //       amount: 650,
      //       date: Timestamp.fromDate(new Date(2022, 9, 19, 21, 43, 0))
      //     },
      //     {
      //       amount: 400,
      //       date: Timestamp.fromDate(new Date(2022, 9, 19, 21, 59, 0))
      //     },
      //     {
      //       amount: 200,
      //       date: Timestamp.fromDate(new Date(2022, 9, 19, 23, 21, 0))
      //     },
      //     {
      //       amount: 1200,
      //       date: Timestamp.fromDate(new Date(2022, 9, 21, 12, 30, 0))
      //     },
      //     {
      //       amount: 73,
      //       date: Timestamp.fromDate(new Date(2022, 9, 21, 19, 33, 22))
      //     },
      //     {
      //       amount: 560,
      //       date: Timestamp.fromDate(new Date(2022, 9, 25, 9, 17, 0))
      //     },
      //
      //   ],
      //     correct: 0,
      //     forecasted: 0,
      //     wrong: 0
      //   } })

    const oddsApiData = JSON.parse(sessionStorage.getItem("oddsApiData"));
    const schedule = getSchedule(oddsApiData.data);
    this.nextMatch = this.getNextMatch(schedule);

    const rawResults = await this.getResults();
    const results = Object.entries(rawResults);
    for (let result of results) {
      result[1].date = new Date(result[1].date);
    }
    results.sort((a, b) => b[1].date.getTime() - a[1].date.getTime());
    this.lastResult = results[0][1];

    await this.getCurrentUserData();
    await this.getUsersData();

    await this.getLeaderboardData();
    this.getChartData();

    this.$emitter.on("toggleDarkMode", (dark) => {
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
          mode: dark.dark ? "dark" : ""
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
      };
    });
  }
});
</script>
