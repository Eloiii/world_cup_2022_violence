<template>
  <q-card class="card">
    <q-card-section>
      <div class="text-subtitle1">
        <q-skeleton type="text" />
      </div>
      <q-list>
        <q-item-label class="q-pt-none q-pl-none" header>
          <q-skeleton type="text" />
        </q-item-label>
        <q-item>
          <q-item-section side>
            <div class="flex justify-center column items-center">
              <q-skeleton type="QAvatar" />
              <q-skeleton type="text" width="2em" />
            </div>
          </q-item-section>

          <q-item-section class="text-center">
            <q-item-label class="text-h6 flex justify-evenly">
              <div>
                <q-skeleton type="text" width="2vw" />
              </div>
              <div>
                &ndash;
              </div>
              <div>
                <q-skeleton type="text" width="2vw" />
              </div>

            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="flex justify-center column items-center">
              <q-skeleton type="QAvatar" />
              <q-skeleton type="text" width="2em" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: "MatchResultSkeleton"
};
</script>

<style scoped>

</style>
