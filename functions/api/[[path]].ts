import '@ssttevee/cfw-formdata-polyfill';
import { router } from './router';
import { error } from 'itty-router-extras';

export const onRequest: PagesFunction = async ({ request, ...extra }) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response: Response | undefined = await router.handle(request, extra);
    return response ?? error(404, 'not found');
  } catch (err) {
    return error(500, (err as Error).message);
  }
};

import './routes/SauceNAO';
import './routes/IqDB';
import './routes/ascii2d';
import './routes/E-Hentai';
import './routes/TraceMoe';
