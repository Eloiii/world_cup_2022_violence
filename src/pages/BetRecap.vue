<template>
  <q-card class="card">
    <q-card-section>
      <q-list>
        <q-item-label class="q-pt-none q-pl-none" header>
          {{ bet.match.date.toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric"
        }) }}
        </q-item-label>
        <q-item>
          <q-item-section side>
            <div class="flex justify-center column items-center">
              <img :src="'https://countryflagsapi.com/svg/'+bet.match.country1.name" alt="drapeau"
                   height="32" width="32">
              <div class="text-caption q-mt-xs">{{ getFrCountryName(bet.match.country1.name) }}</div>
            </div>
          </q-item-section>

          <q-item-section v-if="bet.bet.name === bet.match.country1.name" avatar>
            <q-avatar v-if="userData.avatar === ''" color="primary text-white">
              {{ userData.name?.substring(0, 2) }}
            </q-avatar>
            <q-avatar v-else class="q-mr-sm">
              <img :src="userData.avatar" alt="user profile picture">
            </q-avatar>
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
          <q-item-section v-else>
            <q-item-label class="text-body1 flex justify-evenly">
              contre
            </q-item-label>
          </q-item-section>

          <q-item-section v-if="bet.bet.name === bet.match.country2.name" avatar>
            <q-avatar v-if="userData.avatar === ''" color="primary text-white">
              {{ userData.name?.substring(0, 2) }}
            </q-avatar>
            <q-avatar v-else class="q-mr-sm">
              <img :src="userData.avatar" alt="user profile picture">
            </q-avatar>
            <q-badge color="positive" rounded class="text-dark q-mt-xs">
                <span class="text-subtitle2">
                  {{ bet.bet.stake }}
                </span>
              <q-icon class="q-ml-xs" name="toll" />
            </q-badge>
          </q-item-section>

          <q-item-section side>
            <div class="flex justify-center column items-center">
              <img :src="'https://countryflagsapi.com/svg/'+bet.match.country2.name" alt="drapeau"
                   height="32" width="32">
              <div class="text-caption q-mt-xs">{{ getFrCountryName(bet.match.country2.name) }}</div>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>
<script>
import { getFrCountryName } from "src/getOddsApiData";

export default {
  name: "MatchResult",
  props: {
    userData: Object,
    date: Date,
    bet: Object
  },
  methods: {
    getFrCountryName
  }
};
</script>
