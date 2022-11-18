<template>
  <q-page padding>
    <q-scroll-observer @scroll="onScroll" />
    <div v-if="lastOddsUpdate" class="row q-col-gutter-xs-md q-mb-md">
      <div class="col-md-3">
        <q-badge class="q-pa-sm" color="red">
          Toutes les cotes datent du {{
            lastOddsUpdate.toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              timeZoneName: "short"
            })
          }}
        </q-badge>
      </div>
    </div>
    <div class="row justify-around q-col-gutter-xs-md">
      <div class="col-md-8 col-12">
        <template v-for="date of schedule" :key="date">
          <q-list v-if="date" bordered class="q-mb-xl" padding>
            <q-item-label v-if="date" header>
              {{
                date[0].date.toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })
              }}
            </q-item-label>
            <template v-for="match of date" :key="match.date">
              <q-item class="mobile-hide">
                <q-item-section side>
                  <div class="flex">
                    <div class="flex justify-center column items-center country">
                      <img :src="'https://countryflagsapi.com/svg/'+match.country1.name" alt="drapeau"
                           height="32" width="32">
                      <div class="text-body2 q-mt-xs text-weight-bold">{{
                          getFrCountryName(match.country1.name)
                        }}
                      </div>
                    </div>
                    &ndash;
                    <div class="flex justify-center column items-center country">
                      <img :src="'https://countryflagsapi.com/svg/'+match.country2.name" alt="drapeau"
                           height="32" width="32">
                      <div class="text-body2 q-mt-xs text-weight-bold">{{
                          getFrCountryName(match.country2.name)
                        }}
                      </div>
                    </div>
                  </div>
                </q-item-section>
                <q-item-section class="items-center">
                  <div class="flex justify-evenly" style="width:80%">
                    <q-btn :color="buttonColor(match, match.country1.name)"
                           :text-color="buttonTextColor(match, match.country1.name)"
                           class="buttonOdds"
                           @click="addItemToBasket(match, match.country1)">
                      <div class="flex column no-wrap ellipsis">
                        <div class="text-caption ellipsis">
                          {{ getFrCountryName(match.country1.name) }}
                        </div>
                        <div>
                          {{ match.country1.odds }}
                        </div>
                      </div>
                    </q-btn>
                    <q-btn :color="buttonColor(match, match.draw.name)"
                           :text-color="buttonTextColor(match, match.draw.name)"
                           class="buttonOdds"
                           @click="addItemToBasket(match, match.draw)">
                      <div class="flex column">
                        <div class="text-caption">
                          {{ getFrCountryName(match.draw.name) }}
                        </div>
                        <div>
                          {{ match.draw.odds }}
                        </div>
                      </div>
                    </q-btn>
                    <q-btn :color="buttonColor(match, match.country2.name)"
                           :text-color="buttonTextColor(match, match.country2.name)"
                           class="buttonOdds"
                           @click="addItemToBasket(match, match.country2)">
                      <div class="flex column no-wrap ellipsis">
                        <div class="text-caption ellipsis">
                          {{ getFrCountryName(match.country2.name) }}
                        </div>
                        <div>
                          {{ match.country2.odds }}
                        </div>
                      </div>
                    </q-btn>
                  </div>
                </q-item-section>
                <q-item-section class="q-mt-xl text-caption" side>
                  <span class="text-italic">
                    {{
                      match.date.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZoneName: "short"
                      })
                    }}
                  </span>
                  <span class="cote q-mt-sm text-weight-medium">
                    cotes de {{ match.service }}
                  </span>
                </q-item-section>
              </q-item>
              <q-item class="mobile-only block">
                <q-item-section class="flex" style="flex-direction:row;">
                  <div class="flex justify-center column items-center country">
                    <img :src="'https://countryflagsapi.com/svg/'+match.country1.name" alt="drapeau"
                         height="32" width="32">
                    <div class="text-body2 q-mt-xs text-weight-bold">{{ getFrCountryName(match.country1.name) }}</div>
                  </div>
                  &ndash;
                  <div class="flex justify-center column items-center country">
                    <img :src="'https://countryflagsapi.com/svg/'+match.country2.name" alt="drapeau"
                         height="32" width="32">
                    <div class="text-body2 q-mt-xs text-weight-bold">{{ getFrCountryName(match.country2.name) }}</div>
                  </div>
                </q-item-section>
                <q-item-section class="items-center q-mt-xl" style="margin-left: 0 !important;">
                  <div class="flex justify-between full-width">
                    <q-btn :color="buttonColor(match, match.country1.name)"
                           :text-color="buttonTextColor(match, match.country1.name)"
                           class="buttonOdds"
                           @click="addItemToBasket(match, match.country1)">
                      <div class="flex column no-wrap ellipsis">
                        <div class="text-caption ellipsis">
                          {{ getFrCountryName(match.country1.name) }}
                        </div>
                        <div>
                          {{ match.country1.odds }}
                        </div>
                      </div>
                    </q-btn>
                    <q-btn :color="buttonColor(match, match.draw.name)"
                           :text-color="buttonTextColor(match, match.draw.name)"
                           class="buttonOdds"
                           @click="addItemToBasket(match, match.draw)">
                      <div class="flex column">
                        <div class="text-caption">
                          {{ getFrCountryName(match.draw.name) }}
                        </div>
                        <div>
                          {{ match.draw.odds }}
                        </div>
                      </div>
                    </q-btn>
                    <q-btn :color="buttonColor(match, match.country2.name)"
                           :text-color="buttonTextColor(match, match.country2.name)"
                           class="buttonOdds"
                           @click="addItemToBasket(match, match.country2)">
                      <div class="flex column no-wrap ellipsis">
                        <div class="text-caption ellipsis">
                          {{ getFrCountryName(match.country2.name) }}
                        </div>
                        <div>
                          {{ match.country2.odds }}
                        </div>
                      </div>
                    </q-btn>
                  </div>
                </q-item-section>
                <q-item-section class="q-mt-xl text-caption" side>
                  <span class="cote">
                    cotes de {{ match.service }}
                  </span>
                </q-item-section>
              </q-item>
              <q-separator v-if="date.indexOf(match) !== date.length -1" />
            </template>
          </q-list>
        </template>
      </div>

      <div class="col-md-4 mobile-hide" :style="getScrollTranslation()">
        <q-list v-if="basket.length > 0" bordered class="q-pb-none q-px-sm" padding>
          <q-item v-for="bet of basket" :key="bet.match">
            <q-item-section thumbnail>
              <q-icon v-if="alreadyBetOnMatch(bet.match)" name="warning">
                <q-tooltip class="bg-negative">
                  Tu as déjà parié sur ce match !
                </q-tooltip>
              </q-icon>
              <q-icon v-else name="sports_soccer" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-caption">
                {{ getMatchName(bet) }}
              </q-item-label>
              <q-item-label class="text-subtitle2">
                Résultat du match : {{ getFrCountryName(bet.bet.name) }}
              </q-item-label>
            </q-item-section>
            <q-item-section style="flex-shrink: 1;">
              <q-input v-model="bet.bet.stake" :rules="stakeRules" label="Mise" max="5" min="" outlined
                       type="numeric" />
            </q-item-section>
            <q-item-section class="q-mr-md text-weight-bold" side>
              <div>
                Gain
              </div>
              <div>
                {{ Math.round(bet.bet.stake * bet.bet.odds || 0) }}
                <q-icon class="q-ml-xs" name="toll" />
              </div>
            </q-item-section>
            <q-item-section side>
              <div class="text-caption">
                Cote
              </div>
              <div>
                {{ bet.bet.odds }}
              </div>
            </q-item-section>
          </q-item>
          <q-card class="q-my-sm">
            <q-card-section class="flex column">
              <div class="flex justify-between">
                <div>
                  Mise totale
                </div>
                <div>
                  {{ totalStake }}
                  <q-icon class="q-ml-xs" name="toll" />
                </div>
              </div>
              <div class="flex justify-between q-mt-xs">
                <div class="text-weight-bold">
                  Total des gains
                </div>
                <div class="text-weight-bold">
                  {{ totalProfit }}
                  <q-icon class="q-ml-xs" name="toll" size="xs" />
                </div>
              </div>
            </q-card-section>
            <q-card-section class="flex justify-center q-mt-none">
              <q-btn :disable="!allStakesFullfilled()" :loading="processingBet" class="full-width" color="amber-13"
                     rounded
                     size="lg"
                     text-color="dark" unelevated @click="validateBet">
                Parier
              </q-btn>
            </q-card-section>
          </q-card>
        </q-list>
        <q-card v-else bordered flat>
          <q-card-section class="flex justify-center">
            <img
              alt="sadge"
              src="https://lh3.googleusercontent.com/H2lTPeipM1RidN1PmxumJCra8-LF1gOngZXmDgkWOmDqSuxv0kpOpsgYAUXAxyuNwmW-z9KO53f4kn8JcafGrZhi-fEHHcSrXZA42q0=w600"
              style="width: 30%" />
          </q-card-section>
          <q-card-section class="text-center">
            Commence par séléctionner un match !
          </q-card-section>
        </q-card>
      </div>
      <div class="mobile-only">
        <q-page-sticky :offset="[18, 18]" position="bottom-right">
          <q-fab
            :icon="!mobileBasket ? 'shopping_basket' : 'close'"
            color="red"
            direction="up"
            @click="mobileBasket = true"
          >
          </q-fab>
        </q-page-sticky>
      </div>
    </div>
    <q-dialog v-model="mobileBasket" maximized>
      <q-card class="flex column">
        <q-card-section>
          <div class="row no-wrap">
            <div class="col">
              <div class="text-h6">Panier</div>
            </div>
            <div class="col-auto">
              <q-btn v-close-popup flat icon="close"></q-btn>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="mobileList">
            <template v-for="bet of basket" :key="bet.match">
              <div class="mobileList-item q-mb-md q-mt-sm">
                <div class="mobileList-item-match">
                  <div class="q-mr-sm">
                    <q-icon v-if="alreadyBetOnMatch(bet.match)" name="warning" size="sm">
                      <q-tooltip class="bg-negative">
                        Tu as déjà un pari sur ce match !
                      </q-tooltip>
                    </q-icon>
                    <q-icon v-else name="sports_soccer" size="sm" />
                  </div>
                  <div>
                    <div class="text-caption">
                      {{ getMatchName(bet) }}
                    </div>
                    <div class="text-weight-bold">
                      Résultat du match : {{ getFrCountryName(bet.bet.name) }}
                    </div>
                  </div>
                </div>
                <div class="mobileList-item-stake q-mt-sm">
                  <div class="mobileList-item-stake-odds q-mr-lg">
                    <div>
                      Cote
                    </div>
                    <div class="text-weight-bold">
                      {{ bet.bet.odds }}
                    </div>
                  </div>
                  <div class="q-mr-md">
                    <q-input v-model="bet.bet.stake" :rules="stakeRules" label="Mise" max="5" min=""
                             outlined
                             type="numeric" />
                  </div>
                  <div class="mobileList-item-stake-winnings">
                    <div>
                      Gain
                    </div>
                    <div>
                      {{ Math.round(bet.bet.stake * bet.bet.odds || 0) }}
                      <q-icon class="q-ml-xs" name="toll" />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </q-card-section>
        <q-space />
        <q-card-section class="flex column">
          <div class="flex justify-between">
            <div>
              Mise totale
            </div>
            <div>
              {{ totalStake }}
              <q-icon class="q-ml-xs" name="toll" />
            </div>
          </div>
          <div class="flex justify-between q-mt-xs">
            <div class="text-weight-bold">
              Total des gains
            </div>
            <div class="text-weight-bold">
              {{ totalProfit }}
              <q-icon class="q-ml-xs" name="toll" size="xs" />
            </div>
          </div>
        </q-card-section>
        <q-card-section class="flex justify-center q-mt-none">
          <q-btn :disable="!allStakesFullfilled()" :loading="processingBet" class="full-width" color="amber-13" rounded
                 size="md"
                 text-color="dark" unelevated @click="validateBet">
            Parier
          </q-btn>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { computed, ref } from "vue";
import { getFrCountryName, getSchedule } from "src/getOddsApiData";
import { useQuasar } from "quasar";
import { auth, db } from "boot/firebaseConnection";
import { collection, doc, getDoc, onSnapshot, query, Timestamp, updateDoc } from "firebase/firestore";


export default {
  name: "BetPage",
  setup() {
    const $q = useQuasar();
    const schedule = ref([]);
    const basket = ref([]);
    const lastOddsUpdate = ref();
    const stakeRules = ref([]);
    const userCoins = ref(0);
    const userData = ref({});
    const userBets = ref([]);
    const mobileBasket = ref(false);
    let processingBet = ref(false);
    const scrollInfo = ref({});


    function onScroll(info) {
      scrollInfo.value = info;
    }

    function getScrollTranslation() {
      if(scrollInfo.value && Object.keys(scrollInfo.value).length !== 0) {
        return 'margin-top: ' + scrollInfo.value.position.top + 'px;'
      }
      return 'margin-top: 0px'
    }

    function addItemToBasket(match, selected) {
      const matchAlreadyInBasket = basketContainsMatch(match);
      if (matchAlreadyInBasket) {
        if (matchAlreadyInBasket.bet === selected) {
          basket.value = basket.value.filter((el => el.bet !== selected));
          return;
        } else
          basket.value = basket.value.filter((el) => el.match !== match);
      }
      basket.value.push({
        match: match,
        bet: selected
      });
    }

    function basketContainsMatch(match) {
      for (let basketMatch of basket.value) {
        if (basketMatch.match === match) {
          return basketMatch;
        }
      }
      return false;
    }

    function basketContainsBet(match, countryName) {
      for (let basketMatch of basket.value) {
        if (basketMatch.match === match) {
          if (basketMatch.bet.name === countryName)
            return true;
        }
      }
      return false;
    }


    function buttonColor(match, countryName) {
      if (basketContainsBet(match, countryName))
        return "dark";
      return "amber-13";
    }

    function buttonTextColor(match, countryName) {
      if (basketContainsBet(match, countryName))
        return "amber-13";
      return "dark";
    }

    function showNotif(message, type) {
      $q.notify({
        message: message,
        type: type
      });
    }

    function getMatchName(bet) {
      const name1 = getFrCountryName(bet.match.country1.name);
      const name2 = getFrCountryName(bet.match.country2.name);

      return name1 + " - " + name2;
    }

    async function getUserData(user) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.error("No such document!");
      }
    }

    function getUserCoins(user) {
      const coinsTab = user.score.coins;
      return coinsTab[coinsTab.length - 1].amount;
    }

    function isDecimal(num) {
      return (num - Math.floor(num)) !== 0;
    }

    async function validateBet() {
      processingBet.value = true;
      if (isDecimal(totalStake.value)) {
        showNotif("Ne rentre que des valeurs entières", "negative");
        return;
      }
      if (totalStake.value > userCoins.value) {
        showNotif("Tu ne possèdes pas assez d'argent", "negative");
        return;
      }
      let finalBets = [];
      let loopingBets = [];
      for (const userBet of userBets.value) {
        loopingBets.push(userBet);
      }
      let coinsToBeRefund = 0;

      for (const bet of loopingBets) {
        let sameMatchFound = false;
        for (const basketBet of basket.value) {
          if (isSameMatch(basketBet.match, bet.match)) {
            finalBets = finalBets.filter(b => !isSameMatch(b.match, bet.match));
            finalBets.push(basketBet);
            coinsToBeRefund += Number(bet.bet.stake);
            sameMatchFound = true;
          } else if (!finalBets.includes(basketBet)) {
            finalBets.push(basketBet);
          }
          if (!finalBets.includes(bet) && !sameMatchFound)
            finalBets.push(bet);
        }
      }
      if (finalBets.length === 0) {
        finalBets = [...basket.value];
      }
      const userScore = userData.value.score;

      userScore.coins.push({
        amount: (getUserCoins(userData.value) - Number(totalStake.value)) + coinsToBeRefund,
        date: Timestamp.fromDate(new Date())
      });

      userScore.forecasted = finalBets.length;

      basket.value = [];
      try {
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, { bets: finalBets, score: userScore });

        showNotif("Pari(s) enregistré(s) !", "info");
      } catch (e) {
        showNotif(e.message, "negative");
      }

      processingBet = false;
    }

    function allStakesFullfilled() {
      for (let item of basket.value) {
        if (!item.bet.stake)
          return false;
      }
      return true;
    }

    function isSameMatch(match1, match2) {
      if (match1.country1.name !== match2.country1.name)
        return false;
      if (match1.country2.name !== match2.country2.name)
        return false;
      return match1.date.getDate() === match2.date.getDate();

    }

    function alreadyBetOnMatch(match) {
      for (let bet of userBets.value) {
        if (isSameMatch(bet.match, match))
          return true;
      }
      return false;
    }

    async function loadUserData() {
      this.userData = await this.getUserData(auth.currentUser);
      this.userCoins = this.getUserCoins(this.userData);
      this.stakeRules = [val => val > 0 || "une mise positive non nulle de préférence", val => val <= this.userCoins || "tu ne possèdes pas assez d'argent"];
      this.userData.bets.forEach((bet) => bet.match.date = bet.match.date.toDate());
      this.userBets = this.userData.bets;
    }


    const totalStake = computed(() => {
      let total = 0;
      for (let stake of basket.value) {
        if (stake.bet.stake)
          total += Number(stake.bet.stake);
      }
      return total || 0;
    });

    const totalProfit = computed(() => {
      let total = 0;
      for (let stake of basket.value) {
        if (stake.bet.stake && stake.bet.odds)
          total += Math.round(stake.bet.stake * stake.bet.odds);
      }
      return total || 0;
    });

    return {
      schedule,
      basket,
      lastOddsUpdate,
      stakeRules,
      userCoins,
      userData,
      userBets,
      mobileBasket,
      scroll,
      processingBet,
      addItemToBasket,
      showNotif,
      onScroll,
      getScrollTranslation,
      getMatchName,
      buttonColor,
      getFrCountryName,
      getUserData,
      getUserCoins,
      buttonTextColor,
      allStakesFullfilled,
      alreadyBetOnMatch,
      validateBet,
      loadUserData,
      totalStake,
      totalProfit
    };
  },
  async mounted() {
    let rawMatchesData;
    try {
      rawMatchesData = JSON.parse(sessionStorage.getItem("oddsApiData"));
    } catch (e) {
      rawMatchesData = [];
    }
    if (!rawMatchesData)
      return;


    const schedule = getSchedule(rawMatchesData.data).sort((a, b) => a.date.getTime() - b.date.getTime());

    const dateSeparated = schedule.reduce(function(prev, curr) {
      const date = curr.date.getDate();
      if (!prev[date])
        prev[date] = [];
      prev[date].push(curr);
      return prev;
    }, []);
    dateSeparated.sort((objA, objB) => {
      return Number(objA[0].date) - Number(objB[0].date);
    });

    this.schedule = dateSeparated;
    this.lastOddsUpdate = new Date(rawMatchesData.date);
    const q = query(collection(db, "users"));
    onSnapshot(q, async (querySnapshot) => {
      await this.loadUserData();
    });
  }
};
</script>

<style lang="scss" scoped>
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

.mobileList {
  display: flex;
  flex-direction: column;

  .mobileList-item {

    .mobileList-item-match {
      display: flex;
      align-items: center;

    }

    .mobileList-item-stake {
      display: flex;

      .mobileList-item-stake-odds {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .mobileList-item-stake-winnings {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }

}

</style>
