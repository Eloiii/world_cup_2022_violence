<template>
  <div class="flex justify-center">

  <q-card class="bg-red-5 q-mb-lg shadow-2" square v-if="userID === connectedUserID">
    <q-tooltip>
      Annuler mon pari
    </q-tooltip>
    <q-card-section horizontal class="full-height">
      <q-btn icon="close" flat @click="$emit('removeBet', {bet: bet, userID: userID})">

      </q-btn>
    </q-card-section>
  </q-card>
  <q-card class="card q-mb-lg" style="width:90%" >
    <q-card-section>
      <q-list>
        <q-item-label class="q-pt-none q-pl-none flex justify-between" header>
          <div>
            {{ bet.match.date.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
          }) }}
          </div>
          <div>
            gain potentiel {{ Math.round(bet.bet.odds * bet.bet.stake) }}
          </div>
        </q-item-label>
        <q-item-label caption>

        </q-item-label>
        <q-item>
          <q-item-section side style="width: 6vw">
            <div class="flex justify-center column items-center">
              <img :src="'https://countryflagsapi.com/svg/'+bet.match.country1.name" alt="drapeau"
                   height="32" width="32">
              <div class="text-caption q-mt-xs text-weight-bold">{{ getFrCountryName(bet.match.country1.name) }}</div>
              <div>({{bet.match.country1.odds}})</div>
            </div>
          </q-item-section>


          <q-item-section v-if="bet.bet.name === bet.match.country1.name" avatar style="width: 4vw" class="force_items_center">
            <q-avatar v-if="userData.avatar === ''" color="primary text-white" size="40px">
              {{ userData.name?.substring(0, 2) }}
            </q-avatar>
            <q-avatar v-else size="40px">
              <img :src="userData.avatar" alt="user profile picture">
            </q-avatar>
            <q-badge color="positive" rounded class="text-dark q-mt-xs">
                <span class="text-subtitle2">
                  {{ bet.bet.stake }}
                </span>
              <q-icon class="q-ml-xs" name="toll" />
            </q-badge>
          </q-item-section>
          <q-item-section v-else avatar style="width: 4vw">

          </q-item-section>


          <q-item-section v-if="bet.match.country1.score !== '?'" class="text-center">
            <q-item-label class="text-h6 flex justify-evenly">
              <div>
                {{ bet.match.country1.score }}
              </div>
              <div>
                &ndash;
              </div>
              <div>
                {{ bet.match.country2.score }}
              </div>

            </q-item-label>
          </q-item-section>
          <q-item-section v-else style="width: 70%">
            <div v-if="bet.bet.name === 'Nul'" class="justify-center flex column items-center">
              <q-avatar v-if="userData.avatar === ''" color="primary text-white" size="40px">
                {{ userData.name?.substring(0, 2) }}
              </q-avatar>
              <q-avatar v-else size="40px">
                <img :src="userData.avatar" alt="user profile picture">
              </q-avatar>
              <q-badge color="positive" rounded class="text-dark q-mt-xs" >
                <span class="text-subtitle2">
                  {{ bet.bet.stake }}
                </span>
                <q-icon class="q-ml-xs" name="toll" />
              </q-badge>
            </div>
            <q-item-label class="text-body1 flex justify-evenly column text-center">
              <div>
                contre
              </div>
              <div class="text-caption">
                ({{bet.match.draw.odds}})
              </div>
            </q-item-label>
          </q-item-section>

          <q-item-section v-if="bet.bet.name === bet.match.country2.name" avatar style="width: 4vw" class="force_items_center">
            <q-avatar v-if="userData.avatar === ''" color="primary text-white" size="40px">
              {{ userData.name?.substring(0, 2) }}
            </q-avatar>
            <q-avatar v-else size="40px">
              <img :src="userData.avatar" alt="user profile picture">
            </q-avatar>
            <q-badge color="positive" rounded class="text-dark q-mt-xs">
                <span class="text-subtitle2">
                  {{ bet.bet.stake }}
                </span>
              <q-icon class="q-ml-xs" name="toll" />
            </q-badge>
          </q-item-section>
          <q-item-section v-else avatar style="width: 4vw">

          </q-item-section>

          <q-item-section side style="width: 6vw">
            <div class="flex justify-center column items-center">
              <img :src="'https://countryflagsapi.com/svg/'+bet.match.country2.name" alt="drapeau"
                   height="32" width="32">
              <div class="text-caption q-mt-xs text-weight-bold">{{ getFrCountryName(bet.match.country2.name) }}</div>
              <div>({{bet.match.country2.odds}})</div>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
  </div>
</template>
<script>
import { getFrCountryName } from "src/getOddsApiData";
import {auth} from "boot/firebaseConnection";
import {computed} from "vue";

export default {
  name: "MatchResult",
  props: {
    userData: Object,
    date: Date,
    bet: Object,
    userID: Object
  },
  setup() {
    const connectedUserID = computed(() => {
      return auth.currentUser.uid
    })
    return {
      connectedUserID
    }
  },
  methods: {
    getFrCountryName
  }
};
</script>
<style scoped lang="scss">
.force_items_center {
  align-items: center !important;
}
</style>
