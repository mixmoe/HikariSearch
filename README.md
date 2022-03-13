# Hikari 动漫图片聚合搜索

[**English README**](./README_en.md)

**_一款动漫图片搜索引擎聚合网站, 基于 Cloudflare 提供的 Pages Function_**

![screenshot-mockup](https://user-images.githubusercontent.com/32300164/158019817-a90109c1-96ec-406d-9a8c-8b2bcf7145fb.png)

## 亮点

- 集成了多款动漫图片搜索引擎, 包括:

  - [SauceNAO](https://saucenao.com/)
  - [IqDB](https://iqdb.org/)
  - [ascii2d](https://ascii2d.net/)
  - [E-Hentai](https://e-hentai.org/)
  - [TraceMoe](https://trace.moe/)

    有了它, 你就可以在这个网站上搜索到你想要的动漫图片来源, 无需同时打开这么多网页

- 现代化的交互界面, 基于 [Quasar](https://quasar.dev) 和 Vue.js

- 基于 Cloudflare 的无服务器云函数, 稳定, 快速, 可靠 (并且完全免费)

## 演示站点

请访问[演示站点](https://hikari.obfs.dev)来进行使用

## 进行开发

### 配置开发环境

- 你需要:
  - Node.js 14+
  - yarn
  - VSCode

#### 安装依赖

```bash
yarn install
```

#### 启动开发服务

- 你需要在两个终端中同时执行这两个指令

```bash
yarn run dev:worker
```

```bash
yarn run dev:front
```

稍等一会, 然后在浏览器中打开由 Quasar 提供的开发模式服务器: `http://localhost:8080`来开始你的开发之旅

### 部署到 Cloudflare

该项目部署流程完全和一般的 Pages 部署流程几乎一致, 你总是可以参考 [Cloudflare Pages](https://developers.cloudflare.com/pages/get-started/) 文档来获得更多信息

- 这里给出你几个需要配置的值:
  - 构建命令: `quasar build -P`
  - 公开目录: `dist/spa`

## 鸣谢

- 提供上述搜索服务的网站们
- Cloudflare Pages, 本项目基于的对象
- Quasar, 交互界面的框架
- [Schemastery](https://github.com/Shigma/schemastery), 一款轻量字段类型校验库, 用于 API 的传参验证

## 开源许可

本项目以 [LGPL-3.0](./LICENSE) 许可开源

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
