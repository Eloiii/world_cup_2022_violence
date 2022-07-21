<template>
  <q-card class="card">
    <q-card-section>
      <div class="text-subtitle1">
        {{ title }}
      </div>
      <q-list>
        <q-item-label header class="q-pt-none q-pl-none">
          {{ date.toLocaleDateString("fr-FR", {
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
              <img :src="'https://countryflagsapi.com/svg/'+match.country1.engName" height="32"
                   width="32" alt="drapeau pays">
              <div class="text-caption q-mt-xs">{{ match.country1.frName }}</div>
            </div>
          </q-item-section>

          <q-item-section class="text-center" v-if="match.country1.score !== '?'">
            <q-item-label class="text-h6 flex justify-evenly">
              <div>
                {{ match.country1.score }}
              </div>
              <div>
                &ndash;
              </div>
              <div>
                {{ match.country2.score }}
              </div>

            </q-item-label>
          </q-item-section>
          <q-item-section v-else>
            <q-item-label class="text-body1 flex justify-evenly">
              contre
            </q-item-label>
          </q-item-section>


          <q-item-section side>
            <div class="flex justify-center column items-center">
              <img :src="'https://countryflagsapi.com/svg/'+match.country2.engName" height="32"
                   width="32" alt="drapeau pays">
              <div class="text-caption q-mt-xs">{{ match.country2.frName }}</div>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  name: "MatchResult",
  props: {
    title: String,
    date: Date,
    match: Object
  }
};
</script>
