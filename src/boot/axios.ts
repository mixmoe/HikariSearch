import { boot } from 'quasar/wrappers';
import type { AxiosInstance } from 'axios';
import { axios, API } from 'src/api';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: typeof API;
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = API;
});

export { API as api };
