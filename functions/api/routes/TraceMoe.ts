import { json, StatusError } from 'itty-router-extras';
import Schema from 'schemastery';
import { router } from '../router';
import { validate } from '../utils';

export const BASE_URL = 'https://api.trace.moe';

export interface TraceMoeResponse {
  frameCount: number;
  error: string;
  result: {
    anilist?: {
      id: number;
      idMal: number;
      title: { native: string; romaji: string | null; english: string | null };
      synonyms: string[];
      isAdult: boolean;
    };
    filename: string;
    episode: null | number;
    from: number;
    to: number;
    similarity: number;
    video: string;
    image: string;
  }[];
}

export function parse({ error, result }: TraceMoeResponse) {
  if (error.length > 0) throw new StatusError(502, error);
  return result
    .map((result) => ({
      preview: result.image,
      similarity: result.similarity * 100,
      name: result.anilist?.title,
      nsfw: result.anilist?.isAdult,
      from: result.from * 1000,
      to: result.to * 1000,
      episode: result.episode,
      file: result.filename,
    }))
    .sort((a, b) => a.similarity - b.similarity)
    .reverse();
}

export const schema = Schema.object({
  image: Schema.is(File).required(),
  cutBorders: Schema.boolean().default(true),
});

router.post('/TraceMoe', async (request: Request) => {
  const { image, cutBorders } = await validate(request, schema);
  const form = new FormData();
  form.append('image', image!);
  const url = new URL('/search', BASE_URL);
  url.searchParams.append('anilistInfo', '1');
  if (cutBorders) url.searchParams.append('cutBorders', '1');
  const response = await fetch(url.href, { method: 'POST', body: form })
    .then((res) => res.json<TraceMoeResponse>())
    .catch((err: Error) => {
      throw new StatusError(502, err.message);
    });
  return json(parse(response));
});
