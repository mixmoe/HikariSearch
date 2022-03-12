import _axios from 'axios';
import { useQuasar } from 'quasar';
import type * as types from './types';

export const axios = _axios.create({
  baseURL: '/api/',
  timeout: 24 * 1000,
  responseType: 'json',
});

export interface ErrorResponse {
  status: number;
  error: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API {
  function factory<R, S>(path: string): (schema: R) => Promise<S> {
    return async (schema: R) => {
      const form = new FormData();
      for (const [key, value] of Object.entries(schema))
        form.append(key, value instanceof File ? value : JSON.stringify(value));

      return await axios
        .post<S>(path, form)
        .then((response) => response.data)
        .catch((error: Error) => {
          const { notify } = useQuasar();
          const response = _axios.isAxiosError(error)
            ? <ErrorResponse>error.response?.data
            : undefined;
          notify({
            message: response ? response.error : error.message,
            caption: response?.status.toString(),
            color: 'negative',
            position: 'bottom',
          });
          throw error;
        });
    };
  }

  export const SauceNAO = factory<
    types.SauceNAORequestSchema,
    types.SauceNAOParseResult
  >('./SauceNAO');

  export const IqDB = factory<
    types.IqDBRequestSchema, //
    types.IqDBParseResult
  >('./IqDB');

  export const ascii2d = factory<
    types.ascii2dRequestSchema,
    types.ascii2dParseResult
  >('./ascii2d');

  export const EHentai = factory<
    types.EHentaiRequestSchema,
    types.EHentaiParseResult
  >('./E-Hentai');

  export const TraceMoe = factory<
    types.TraceMoeRequestSchema,
    types.TraceMoeParseResult
  >('./TraceMoe');
}

export function proxy(url: string) {
  const requestUrl = new URL('/proxy', window.location.href);
  requestUrl.searchParams.set('url', url);
  return requestUrl.toString();
}
