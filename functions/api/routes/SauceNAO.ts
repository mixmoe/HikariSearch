import * as cheerio from 'cheerio';
import * as _ from 'lodash';
import { json } from 'itty-router-extras';
import Schema from 'schemastery';
import { router } from '../router';
import { request, validate } from '../utils';

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
      imageUrl = image.attr('data-src') ?? hiddenImage ?? image.attr('src') ?? '';
    return {
      image: new URL(<string>imageUrl, BASE_URL).toString(),
      hidden: !!hiddenImage,
      title: title.text(),
      similarity: parseFloat(similarity.text()),
      misc: _.map(misc, (m) => m.attribs.href),
      content: _.map(content, (element) => ({
        text: $(element).text(),
        link: element.attribs.href as string | undefined,
      })).filter(({ text }) => text.length > 0),
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

router.post('/SauceNAO', async (req: Request) => {
  const { hide, image } = await validate(req, schema);

  const form = new FormData();
  form.append('file', image!);
  if (hide) form.append('hide', '3');

  const url = new URL('/search.php', BASE_URL);
  const response = await request.post(url, form).then((res) => res.text());

  return json(parse(response));
});
