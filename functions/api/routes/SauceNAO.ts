import * as cheerio from 'cheerio';
import * as _ from 'lodash';
import { StatusError, json } from 'itty-router-extras';
import Schema from 'schemastery';
import { router } from '../router';
import { validate } from '../utils';

export const BASE_URL = 'https://saucenao.com';

export function parse(body: string) {
  const $ = cheerio.load(body, { decodeEntities: true });
  return _.map($('.result'), (result) => {
    const image = $('.resultimage img', result),
      title = $('.resulttitle', result),
      similarity = $('.resultsimilarityinfo', result),
      misc = $('.resultmiscinfo > a', result),
      content = $('.resultcontentcolumn > *', result);
    if (title.length <= 0) return;
    const hiddenImage = image.attr('data-src2'),
      imageUrl = hiddenImage ? hiddenImage : image.attr('src');
    return {
      image: new URL(<string>imageUrl, BASE_URL).toString(),
      hidden: !!hiddenImage,
      title: title.text(),
      similarity: parseFloat(similarity.text()),
      misc: _.map(misc, (m) => m.attribs.href),
      content: _.map(content, (element) => {
        let result = $(element).text();
        switch (element.tagName) {
          case 'a':
            result += `↪️${element.attribs.href}`;
            break;
          case 'br':
            result += '\n';
            break;
        }
        return result;
      })
        .filter((s) => s.length > 0)
        .join(''),
    };
  })
    .filter(<T>(v: T | undefined): v is T => v !== undefined)
    .sort((a, b) => a.similarity - b.similarity)
    .reverse();
}

export const schema = Schema.object({
  hide: Schema.boolean().default(true),
  image: Schema.is(File).required(),
});

router.post('/SauceNAO', async (request: Request) => {
  const { hide, image } = await validate(request, schema);
  const form = new FormData();
  form.append('file', image!);
  if (hide) form.append('hide', '3');
  const url = new URL('/search.php', BASE_URL);
  const response = await fetch(url.href, { method: 'POST', body: form })
    .then((res) => res.text())
    .catch((err: Error) => {
      throw new StatusError(502, err.message);
    });
  return json(parse(response));
});
