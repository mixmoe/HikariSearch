import * as cheerio from 'cheerio';
import { json, StatusError } from 'itty-router-extras';
import * as _ from 'lodash';
import Schema from 'schemastery';
import { router } from '../router';
import { validate } from '../utils';

export const BASE_URLs = {
  eh: new URL('https://upld.e-hentai.org/image_lookup.php'),
  ex: new URL('https://exhentai.org/upld/image_lookup.php'),
} as const;

export function parse(body: string) {
  const $ = cheerio.load(body);
  return _.map($('.glte > tbody > tr'), (result) => {
    const title = $('.glink', result),
      [image] = $('.gl1e img', result),
      [link] = $('.gl1e a', result),
      type = $('.gl3e .cn', result),
      date = $('.gl3e [id^=posted]', result),
      tags = $('.gl4e table td > div[class]', result);
    return {
      title: title.text(),
      image: image.attribs.src,
      link: link.attribs.href,
      type: type.text().toUpperCase(),
      date: date.text(),
      tags: _.map(tags, (tag) => $(tag).text()),
    };
  });
}

export const schema = Schema.object({
  site: Schema.transform(
    Schema.union(Object.keys(BASE_URLs) as (keyof typeof BASE_URLs)[]),
    (v) => BASE_URLs[v]
  ),
  cover: Schema.boolean().default(false),
  deleted: Schema.boolean().default(false),
  similar: Schema.boolean().default(true),
  image: Schema.is(File).required(),
});

router.post('/E-Hentai', async (request: Request) => {
  const { site, cover, deleted, similar, image } = await validate(
    request,
    schema
  );
  const form = new FormData();
  form.append('sfile', image!);
  form.append('f_sfile', 'search');
  if (cover) form.append('fs_covers', 'on');
  if (similar) form.append('fs_similar', 'on');
  if (deleted) form.append('fs_exp', 'on');
  const sent = new Request((site ?? BASE_URLs['eh']).href, {
    method: 'POST',
    body: form,
    credentials: 'include',
  });
  sent.headers.set('Cookie', 'sl=dm_2');
  const response = await fetch(sent)
    .then((res) => res.text())
    .catch((err: Error) => {
      throw new StatusError(502, err.message);
    });
  return json(parse(response));
});
