import { boot } from 'quasar/wrappers'
import mitt from 'mitt';
import axios from "boot/axios";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
const emitter = mitt();
export default boot(({ app }) => {


  app.config.globalProperties.$emitter = emitter;
})
