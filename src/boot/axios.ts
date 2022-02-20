import { boot } from 'quasar/wrappers';
import type { AxiosInstance } from 'axios';
import { axios, api } from 'src/api';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
