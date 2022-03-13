# Hikari anime image aggregation search

**_A collection of anime image search engines, based on Cloudflare Pages Function._**

![screenshot-mockup](https://user-images.githubusercontent.com/32300164/158019817-a90109c1-96ec-406d-9a8c-8b2bcf7145fb.png)

## Highlights

- Integrated with several anime image search engines, including:

  - [SauceNAO](https://saucenao.com/)
  - [IqDB](https://iqdb.org/)
  - [ascii2d](https://ascii2d.net/)
  - [E-Hentai](https://e-hentai.org/)
  - [TraceMoe](https://trace.moe/)

    With it, you can search for your desired anime image source on this website, WITHOUT having to open so many pages at once!

- Modern user interface, based on Quasar and Vue.js

- Based on Cloudflare Pages Function, stable, fast, reliable (and completely free)

## Demo site

Please visit the [demo site](https://hikari.obfs.dev) to use it

## Develop

### Configuring the development environment

- You need:
  - Node.js 14+
  - yarn
  - VSCode

#### Install the dependencies

```bash
yarn install
```

#### Start development services

- You need to execute both commands in both terminals

```bash
yarn run dev:worker
```

```bash
yarn run dev:front
```

Wait a moment, then open the development mode server provided by Quasar in your browser: `http://localhost:8080` to start your development journey

### Deploying to Cloudflare

The project deployment process is almost identical to the general Pages deployment process.
You can always refer to the [Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/) documentation for more information.

- Here are some of the values you may need to configure:
  - Build command: `quasar build -P`
  - Public directory: `dist/spa`

## Acknowledgements

- The sites that provide the above search services
- Cloudflare Pages, the base of this project
- Quasar, a framework for user interfaces
- [Schemastery](https://github.com/Shigma/schemastery), a lightweight schema type validation library for API schema validation

## License

This project is licensed under the [LGPL-3.0](./LICENSE) license.

<!-- markdownlint-disable MD046 -->

    A site collects many anime image search engines.
    Copyright (C) 2022 Mix

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/.

<!-- markdownlint-enable MD046 -->
