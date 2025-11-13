# DDG Email Panel

> Open source unofficial [DuckDuckGo Email Protection](https://duckduckgo.com/email) panel.

![GitHub Repo stars](https://img.shields.io/github/stars/isyuricunha/ddg-email-panel?style=social)

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=Vercel&logoColor=white) ![GitHub](https://img.shields.io/github/license/isyuricunha/ddg-email-panel?style=for-the-badge)

## 🍴 Fork Information

This is a fork of the [original project](https://github.com/whatk233/ddg-email-panel) by [Whatk](https://github.com/whatk233), now maintained by [Yuri Cunha](https://github.com/isyuricunha).

> **Warning**   
> DDG Email Panel is a community open-source management panel for DuckDuckGo Email Protection. Although it is not officially owned by DuckDuckGo, we still respect your privacy and will not store or sell any personal information.
> 
> DDG Email Panel is an open-source project, anyone can deploy it. Therefore, we cannot guarantee that publicly deployed sites can be trusted. To ensure your privacy and security, we strongly recommend that you use our hosted site or self-host DDG Email Panel.

## ⭐ Features
* No need to install DuckDuckGo browser extension
* Supports all modern browsers
* PWA support
* Generate new privacy aliases
* No user information is stored on the server side
* Multi-language support (English, Chinese, Japanese, Portuguese)
* Night Mode

## 📒 Todo
* Multi-account management
* History alias management and notes
* Change forwarding address
* DuckDuckGo Email account cancellation

## 🌏 Hosted Instance
* [DDG Email Panel](https://ddg-email-panel.yuricunha.com)

## 🚀 Quick Deployment
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fisyuricunha%2Fddg-email-panel&demo-title=DDG%20Email%20Panel&demo-description=DDG%20Email%20Panel%20is%20the%20open%20source%20unofficial%20DuckDuckGo%20Email%20Protection%20panel.&demo-url=https%3A%2F%2Fddg-email-panel.yuricunha.com)

## ⚓ Docker Deployment

> **Note**: Docker images are available from the [original repository](https://github.com/whatk233/ddg-email-panel). To build your own image from this fork, use the provided Dockerfile.

```shell
docker run -d --restart=always -p 3000:3000 --name ddg-email-panel whatk233/ddg-email-panel
```

## 🔧 Local Deployment

### Environment
* Node.js 16 or newer

```bash
git clone https://github.com/isyuricunha/ddg-email-panel.git
cd ddg-email-panel

# pnpm
pnpm install
pnpm build
pnpm start

# yarn
yarn install
yarn build
yarn start

# npm
npm install
npm run build
npm run start
```

## 📝 License
MIT

## 🙏 Credits
Originally created with ♥ by [Whatk](https://github.com/whatk233)
