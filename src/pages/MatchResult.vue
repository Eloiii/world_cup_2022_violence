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
            <img src="//ssl.gstatic.com/onebox/media/sports/logos/6SF7yEoB60bU5knw-M7R5Q_96x96.png" height="32"
                 width="32" class="q-ml-sm">
            <div class="text-caption">{{ country1.name }}</div>
          </q-item-section>

          <q-item-section class="text-center" v-if="country1.score !== '?'">
            <q-item-label class="text-h6 flex justify-evenly">
              <div>
                {{ country1.score  }}
              </div>
              <div>
                &ndash;
              </div>
              <div>
                {{ country2.score }}
              </div>

            </q-item-label>
          </q-item-section>
          <q-item-section v-else>
            <q-item-label class="text-body1 flex justify-evenly">
              contre
            </q-item-label>
          </q-item-section>


          <q-item-section side>
            <img src="//ssl.gstatic.com/onebox/media/sports/logos/6SF7yEoB60bU5knw-M7R5Q_96x96.png" height="32"
                 width="32" class="q-mr-sm">
            <div class="text-caption">{{ country2.name }}</div>
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
    country1: Object,
    country2: Object
  }
};
</script>
