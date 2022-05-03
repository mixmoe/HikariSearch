import _axios from 'axios';
import { Notify } from 'quasar';
import type * as types from './types';

export const axios = _axios.create({
  baseURL: '/api/',
  timeout: 24 * 1000,
  responseType: 'json',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export interface ErrorResponse {
  status?: number;
  error?: string;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace API {
  function factory<R, S>(path: string): (schema: R) => Promise<S> {
    return async (schema: R) =>
      await axios
        .post<S>(path, schema)
        .then((response) => response.data)
        .catch((error: Error) => {
          const response = _axios.isAxiosError(error)
            ? <ErrorResponse>error.response?.data
            : undefined;
          Notify.create({
            message:
              response?.status && response.error
                ? `${response.status} - ${response.error}`
                : error.message,
            color: 'negative',
            position: 'bottom',
          });
          throw error;
        });
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
