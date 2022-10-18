import { boot } from "quasar/wrappers";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
import VueApexCharts from "vue3-apexcharts";

export default boot(({ app }) => {
  app.use(VueApexCharts);
});
