<template>
  <q-page v-if="usersData" padding>
    <div class="row justify-center">
      <div class="col-md-10 col-12">
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
      <div class="col-md-10 col-12">
        <q-tab-panels v-model="tab" animated class="bg-transparent" swipeable>
          <q-tab-panel v-for="(user, userID) in usersData" :key="userID" :name="user.name" class="q-pa-none">
            <q-card>
              <q-item>
                <q-item-section avatar>
                  <q-avatar v-if="user.avatar === ''" color="primary text-white" size="xl">
                    {{ user.name.substring(0, 2) }}
                  </q-avatar>
                  <q-avatar v-else size="xl">
                    <img :src="user.avatar" alt="user profile picture">
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ user.name }}</q-item-label>
                  <q-item-label caption>
                    <q-badge :color="badgeColor(user)" class="text-dark" rounded transparent>
                      <span class="text-caption">
                        {{ getUserCoins(user) }}
                      </span>
                      <q-icon class="q-ml-xs" name="toll" />
                    </q-badge>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <!--              <q-separator inset />-->

              <q-card-section horizontal>
                <q-card-section class="full-width">
                  <q-item>
                    <q-icon class="q-mr-md" name="check_circle" size="sm" />
                    <q-item-section>
                      <q-item-label class="text-body1">
                        Paris réussis
                      </q-item-label>
                      <q-item-label class="text-weight-bold q-pt-sm">
                        {{ user.score.correct }} / {{ getForecastedFinished(user) }}
                      </q-item-label>
                      <q-item-label>
                        {{ Math.round(user.score.correct * 100 / getForecastedFinished(user)) }} %
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>

                <q-separator vertical />

                <q-card-section class="full-width">
                  <q-item>
                    <q-icon class="q-mr-md" name="cancel" size="sm" />
                    <q-item-section>
                      <q-item-label class="text-body1">
                        Paris manqués
                      </q-item-label>
                      <q-item-label class="text-weight-bold q-pt-sm">
                        {{ user.score.wrong }} / {{ getForecastedFinished(user) }}
                      </q-item-label>
                      <q-item-label>
                        {{ Math.round(user.score.wrong * 100 / getForecastedFinished(user)) }} %
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card-section>

              <q-separator inset />

              <q-card-section :horizontal="!$q.screen.lt.md">
                <q-card-section class="full-width">
                  <q-item>
                    <q-icon class="q-mr-md" name="sentiment_very_satisfied" size="sm" />
                    <q-item-section>
                      <q-item-label class="text-body1">
                        Plus gros gain
                      </q-item-label>

                      <BetRecap :bet="biggestWin(user)" :userData="user" :userID="userID" class="q-mt-lg"
                                remove-margin />
                    </q-item-section>
                  </q-item>
                </q-card-section>


                <q-card-section class="full-width">
                  <q-item>
                    <q-icon class="q-mr-md" name="sentiment_very_dissatisfied" size="sm" />
                    <q-item-section>
                      <q-item-label class="text-body1">
                        Plus grande perte
                      </q-item-label>

                      <BetRecap :bet="biggestLoss(user)" :userData="user" :userID="userID" class="q-mt-lg"
                                remove-margin />
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card-section>

              <q-separator inset />

              <q-card-section :horizontal="!$q.screen.lt.md">
                <q-card-section class="full-width">
                  <q-item>
                    <q-icon class="q-mr-md" name="keyboard_double_arrow_up" size="sm" />
                    <q-item-section>
                      <q-item-label class="text-body1">
                        Plus grande mise
                      </q-item-label>

                      <BetRecap :bet="biggestStake(user)" :userData="user" :userID="userID" class="q-mt-lg"
                                remove-margin />
                    </q-item-section>
                  </q-item>
                </q-card-section>


                <q-card-section class="full-width">
                  <q-item>
                    <q-icon class="q-mr-md" name="keyboard_double_arrow_down" size="sm" />
                    <q-item-section>
                      <q-item-label class="text-body1">
                        Plus petite mise
                      </q-item-label>

                      <BetRecap :bet="lowestStake(user)" :userData="user" :userID="userID" class="q-mt-lg"
                                remove-margin />
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card-section>

              <q-separator inset />

              <q-card-section :horizontal="!$q.screen.lt.md">
                <q-card-section class="full-width">
                  <q-item>
                    <q-icon class="q-mr-md" name="check_circle" size="sm" />
                    <q-item-section>
                      <q-item-label class="text-body1">
                        Gain moyen
                      </q-item-label>
                      <q-item-label class="text-weight-bold q-pt-sm">
                        {{ averageWin(user) }}
                        <q-icon name="toll" />
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>

                <q-card-section class="full-width">
                  <q-item>
                    <q-icon class="q-mr-md" name="pending" size="sm" />
                    <q-item-section>
                      <q-item-label class="text-body1">
                        Mise moyenne
                      </q-item-label>
                      <q-item-label class="text-weight-bold q-pt-sm">
                        {{ averageStake(user) }}
                        <q-icon name="toll" />
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>

                <q-card-section class="full-width">
                  <q-item>
                    <q-icon class="q-mr-md" name="unpublished" size="sm" />
                    <q-item-section>
                      <q-item-label class="text-body1">
                        Perte moyenne
                      </q-item-label>
                      <q-item-label class="text-weight-bold q-pt-sm">
                        {{ averageLoss(user) }}
                        <q-icon name="toll" />
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card-section>

              <q-separator inset />

              <q-card-section>
                <apexchart :options="options" :series="getChartData(user)" height="300" type="line"
                           width="100%"></apexchart>
              </q-card-section>

            </q-card>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>

<script>
import BetRecap from "./BetRecap.vue";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "boot/firebaseConnection";
import { collection, doc, getDoc, getDocs, onSnapshot, query } from "firebase/firestore";
import { ref } from "vue";
import * as fr from "apexcharts/dist/locales/fr.json";

export default {
  name: "StatsPage",
  components: { BetRecap },
  setup() {
    const usersData = ref({});
    const tab = ref("");
    const options = {
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
    };

    function getForecastedFinished(user) {
      return user.bets.filter(bet => bet.match.country1.score !== "?").length;
    }

    function getWinnerOfMatch(match) {
      if (match.country1.score === "?")
        return null;
      if (match.country1.score === match.country2.score)
        return "Nul";
      return match.country1.score > match.country2.score ? match.country1.name : match.country2.name;
    }

    function getBetsWon(user) {
      let betsWon = [];
      for (const bet of user.bets) {
        const winner = getWinnerOfMatch(bet.match);
        if (!winner)
          continue;
        if (bet.bet.name === winner)
          betsWon.push(bet);
      }
      return betsWon;
    }

    function biggestWin(user) {
      const betsWon = getBetsWon(user);
      betsWon.sort((a, b) => (Number(b.bet.stake) * b.bet.odds) - (Number(a.bet.stake) * a.bet.odds));
      return betsWon[0];
    }

    function getBetsLost(user) {
      let betsLoss = [];
      for (const bet of user.bets) {
        const winner = getWinnerOfMatch(bet.match);
        if (!winner)
          continue;
        if (bet.bet.name !== winner)
          betsLoss.push(bet);
      }
      return betsLoss;
    }

    function biggestLoss(user) {
      const betsLoss = getBetsWon(user);
      betsLoss.sort((a, b) => b.bet.stake - a.bet.stake);
      return betsLoss[0];
    }

    function biggestStake(user) {
      let maxStakeBet = { bet: { stake: -1 } };
      for (const bet of user.bets) {
        if (Number(bet.bet.stake) > Number(maxStakeBet.bet.stake))
          maxStakeBet = bet;
      }
      return maxStakeBet;
    }

    function lowestStake(user) {
      let minStakeBet = { bet: { stake: 9999999999999 } };
      for (const bet of user.bets) {
        if (Number(bet.bet.stake) < Number(minStakeBet.bet.stake))
          minStakeBet = bet;
      }
      return minStakeBet;
    }

    function averageWin(user) {
      const betsWon = getBetsWon(user);
      let sumWon = 0;
      for (const bet of betsWon)
        sumWon += (Number(bet.bet.stake) * bet.bet.odds);
      return Math.round(sumWon / betsWon.length);
    }

    function averageStake(user) {
      let sumStakes = 0;
      for (const bet of user.bets)
        sumStakes += Number(bet.bet.stake);
      return Math.round(sumStakes / user.bets.length);
    }

    function averageLoss(user) {
      const betsLost = getBetsLost(user);
      let sumLoss = 0;
      for (const bet of betsLost)
        sumLoss += Number(bet.bet.stake);
      return Math.round(sumLoss / betsLost.length);
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
      let usersDataLocal = {};
      if (currentUserData.groups.length === 0) {
        if (currentUserData.bets && currentUserData.bets.length > 0) {
          currentUserData.bets = formatDate(currentUserData);
          usersDataLocal[auth.currentUser.uid] = currentUserData;
          if (!this.tab)
            this.tab = currentUserData.name;
        }
        usersData.value = usersDataLocal;
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
            data.bets = data.bets.sort((a, b) => b.match.date.getTime() - a.match.date.getTime());
            usersDataLocal[doc.id] = data;
            if (!this.tab)
              this.tab = data.name;
          }
        }
      });
      usersData.value = usersDataLocal;
    }

    function userHasAvatar(userName) {
      if (userName) {
        const user = this.getUserDataByName(userName);
        return user.avatar !== "";
      }
    }

    function badgeColor(user) {
      const coinsTab = user.score.coins;
      const coinsAmount = coinsTab[coinsTab.length - 1].amount;
      if (coinsAmount >= 400)
        return "positive";
      if (coinsAmount < 400 && coinsAmount >= 100)
        return "warning";
      return "negative";
    }

    function getChartData(user) {
      const res = [];
      let data = [];
      const groupBy = (x, f) => x.reduce((a, b, i) => ((a[f(b, i, x)] ||= []).push(b), a), {}); //thanks stackoverflow
      const offset = Math.abs(user.score.coins[0].date.toDate().getTimezoneOffset() / 60);
      const filteredByDateData = groupBy(user.score.coins, v => v.date.toDate().setHours(offset, 0, 0, 0));
      for (const date in filteredByDateData) {
        const sortedRecords = filteredByDateData[date].sort((a, b) => b.date.toDate().getTime() - a.date.toDate().getTime());

        data.push({
          x: new Date(Number(date)).getTime(),
          y: sortedRecords[0].amount
        });
      }
      res.push({
        name: user.name,
        data: data
      });
      return res;
    }

    return {
      tab,
      usersData,
      options,
      getForecastedFinished,
      loadUsersData,
      userHasAvatar,
      badgeColor,
      getUserCoins,
      biggestWin,
      biggestLoss,
      biggestStake,
      lowestStake,
      averageWin,
      averageStake,
      averageLoss,
      getChartData
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
};
</script>

<style scoped>

</style>
