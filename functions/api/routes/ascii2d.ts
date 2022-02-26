import * as cheerio from 'cheerio';
import { json } from 'itty-router-extras';
import * as _ from 'lodash';
import Schema from 'schemastery';
import { router } from '../router';
import { request, validate } from '../utils';

export const BASE_URL = 'https://ascii2d.obfs.dev/';

export function parse(body: string) {
  const $ = cheerio.load(body, { decodeEntities: true });
  return _.map($('.item-box'), (item) => {
    const detail = $('.detail-box', item),
      hash = $('.hash', item),
      info = $('.info-box > .text-muted', item),
      [image] = $('.image-box > img', item);

    const [source, author] = $('a[rel=noopener]', detail);

    if (!source && !author) return;

    return {
      hash: hash.text(),
      info: info.text(),
      image: new URL(
        image.attribs['src'] ?? image.attribs['data-cfsrc'],
        BASE_URL
      ).toString(),
      source: source
        ? { link: source.attribs.href, text: $(source).text() }
        : undefined,
      author: author
        ? { link: author.attribs.href, text: $(author).text() }
        : undefined,
    };
  }).filter(<T>(v: T | undefined): v is T => v !== undefined);
}

export const schema = Schema.object({
  type: Schema.union(['color', 'bovw'] as const).default('color'),
  image: Schema.is(File).required(),
});

router.post('/ascii2d', async (req: Request) => {
  const { type, image } = await validate(req, schema);

  const form = new FormData();
  form.append('file', image!);

  const url = new URL('/search/file', BASE_URL);
  const colorResponse = await request.post(url, form);

  let response: string;
  if (type === 'color') {
    response = await colorResponse.text();
  } else {
    const bovwUrl = colorResponse.url.replace('/color/', '/bovw/');
    response = await request.get(bovwUrl).then((res) => res.text());
  }
  return json(parse(response));
});
