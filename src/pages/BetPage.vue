<template>
  <q-page padding>
    <div class="row q-col-gutter-xs-md q-mb-md" v-if="lastOddsUpdate">
      <div class="col">
        <q-badge color="red">
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
      <div class="col-md-8">
        <template v-for="date of schedule" :key="date">
          <q-list class="q-mb-xl" bordered padding v-if="date">
            <q-item-label header v-if="date">
              {{
                date[0].date.toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })
              }}
            </q-item-label>
            <template v-for="match of date" :key="match.date">
              <q-item>
                <q-item-section side>
                  <div class="flex">
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
                  </div>
                </q-item-section>
                <q-item-section class="items-center">
                  <div class="flex justify-evenly" style="width:80%">
                    <q-btn :color="buttonColor(match, match.country1.name)" class="buttonOdds"
                           :text-color="buttonTextColor(match, match.country1.name)"
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
                    <q-btn :color="buttonColor(match, match.draw.name)" class="buttonOdds"
                           :text-color="buttonTextColor(match, match.draw.name)"
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
                    <q-btn :color="buttonColor(match, match.country2.name)" class="buttonOdds"
                           :text-color="buttonTextColor(match, match.country2.name)"
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
                <q-item-section side class="q-mt-xl text-caption">
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
      <div class="col-md-4">
        <q-list class="q-mb-xl" bordered padding v-if="basket.length > 0">
          <q-item v-for="bet of basket" :key="bet.match">
            <q-item-section thumbnail>
              <q-icon name="sports_soccer" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-caption">
                {{ getMatchName(bet) }}
              </q-item-label>
              <q-item-label class="text-subtitle2">
                Résultat du match : {{ getFrCountryName(bet.bet.name) }}
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-input v-model="bet.bet.stake" type="number" min="" max="5" label="Mise" outlined />
            </q-item-section>
            <q-item-section>
              <div>
                Gain potentiel
              </div>
              <div>
                {{
                  new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR"
                  }).format(bet.bet.stake * bet.bet.odds)
                }}6
              </div>
            </q-item-section>
            <q-item-section side top>
              <div class="text-caption">
                Cote
              </div>
              <div>
                {{ bet.bet.odds }}
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <q-card bordered flat v-else>
          <img
            src="https://lh3.googleusercontent.com/H2lTPeipM1RidN1PmxumJCra8-LF1gOngZXmDgkWOmDqSuxv0kpOpsgYAUXAxyuNwmW-z9KO53f4kn8JcafGrZhi-fEHHcSrXZA42q0=w600" />
          <q-card-section class="text-center">
            Commence par séléctionner un pari !
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from "vue";
import { getFrCountryName, getSchedule } from "src/getOddsApiData";
import { useQuasar } from "quasar";


export default {
  name: "BetPage",
  setup() {
    const $q = useQuasar();
    const schedule = ref([]);
    const basket = ref([]);
    const lastOddsUpdate = ref();

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
      console.log(basket.value);
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
      //TODO regarder dans firestore si déjà un bet sur ce match (en plus du panier actuel)
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

    return {
      schedule,
      basket,
      lastOddsUpdate,
      addItemToBasket,
      showNotif,
      getMatchName,
      buttonColor,
      getFrCountryName,
      buttonTextColor
    };
  },
  mounted() {
    const rawMatchesData = JSON.parse(sessionStorage.getItem("oddsApiData"));
    if (!rawMatchesData)
      return;
    //TODO faire qq ici si les données ne sont pas (encore) là
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

  }
};
</script>

<style scoped>
.country {
  width: 125px;
}

.buttonOdds {
  width: 100px;
}

.cote {
  width: 135px;
  text-align: right;
}
</style>
