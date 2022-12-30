import * as cheerio from 'cheerio';
import { json } from 'itty-router-extras';
import * as _ from 'lodash';
import Schema from 'schemastery';
import { router } from '../router';
import { request, validate } from '../utils';

export const BASE_URL = 'https://iqdb.org/';

export enum IqDBServices {
  danbooru = 1,
  konachan = 2,
  yandere = 3,
  gelbooru = 4,
  sankaku_channel = 5,
  e_shuushuu = 6,
  zerochan = 11,
  anime_pictures = 13,
}

export function parse(body: string) {
  const $ = cheerio.load(body);
  return _.map($('table'), (result) => {
    const content = $(result).text(),
      [link] = $('td.image > a', result),
      [image] = $('td.image img', result);
    if (!link) return;
    const [, similarity] = content.match(/(\d+%)\s*similarity/) ?? [],
      [, level] = content.match(/\[(\w+)\]/) ?? [],
      [, resolution] = content.match(/(\d+×\d+)/) ?? [];

    return {
      url: new URL(link.attribs.href, BASE_URL).toString(),
      image: new URL(image.attribs.src, BASE_URL).toString(),
      similarity: parseFloat(similarity),
      resolution: resolution,
      level: level,
    };
  })
    .filter(<T>(v: T | undefined): v is T => v !== undefined)
    .sort((a, b) => a.similarity - b.similarity)
    .reverse();
}

export const schema = Schema.object({
  services: Schema.array(
    Schema.transform(
      Schema.union(
        Object.values(IqDBServices).filter(
          <T extends string>(s: T | number): s is T => typeof s === 'string'
        ) as (keyof typeof IqDBServices)[]
      ),
      (v) => IqDBServices[v]
    )
  ),
  discolor: Schema.boolean().default(false),
  image: Schema.is(File).required(),
});

router.post('/IqDB', async (req: Request) => {
  const { services, discolor, image } = await validate(req, schema);

  const form = new FormData();
  form.append('file', image!);
  if (services) services.forEach((s) => form.append('service[]', s.toString()));
  if (discolor) form.append('forcegray', 'on');

  const response = await request.post(BASE_URL, form).then((res) => res.text());

  return json(parse(response));
});
