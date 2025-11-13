# DDG Email Panel

> modern open source unofficial [DuckDuckGo Email Protection](https://duckduckgo.com/email) panel with full internationalization support.

![GitHub Repo stars](https://img.shields.io/github/stars/isyuricunha/ddg-email-panel?style=social)

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=Vercel&logoColor=white) ![GitHub](https://img.shields.io/github/license/isyuricunha/ddg-email-panel?style=for-the-badge)

## 🍴 fork information

this is a fork of the [original project](https://github.com/whatk233/ddg-email-panel) by [whatk](https://github.com/whatk233), now maintained by [yuri cunha](https://github.com/isyuricunha).

> **warning**   
> ddg email panel is a community open-source management panel for duckduckgo email protection. although it is not officially owned by duckduckgo, we still respect your privacy and will not store or sell any personal information.
> 
> ddg email panel is an open-source project, anyone can deploy it. therefore, we cannot guarantee that publicly deployed sites can be trusted. to ensure your privacy and security, we strongly recommend that you use our hosted site or self-host ddg email panel.

## ⭐ features
* comprehensive dashboard with statistics and activity charts
* alias management with search and filtering
* email formatter for generating unique aliases
* account settings with security features
* modern ui with glass morphism design
* full internationalization (i18n) support
* no need to install duckduckgo browser extension
* supports all modern browsers
* pwa support with offline capabilities
* generate new privacy aliases
* no user information stored on server side
* multi-language support (english, portuguese)
* dark theme optimized
* responsive design for mobile and desktop

## 🌐 internationalization
* **english** - complete translation
* **portuguese** - complete translation
* easily extensible for additional languages
* consistent translation keys across all pages
* dynamic content interpolation support

## 📱 pages & features
* **dashboard** - overview with statistics and activity charts
* **email generator** - create and manage duck addresses
* **alias formatter** - generate unique aliases for recipients
* **alias management** - organize and search through saved aliases
* **settings** - customize preferences and data management
* **account** - profile information and security settings

## 🎨 technical stack
* **next.js 13** - react framework with app router
* **typescript** - type-safe development
* **tailwind css** - utility-first styling
* **next-i18next** - internationalization
* **jotai** - state management
* **heroicons** - consistent iconography
* **next-pwa** - progressive web app features

## 📒 todo
* multi-account management
* history alias management and notes
* change forwarding address
* duckduckgo email account cancellation
* additional language translations

## 🌏 hosted instance
* [ddg email panel](https://ddg-email-panel.yuricunha.com)

## 🚀 quick deployment
[![deploy with vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fisyuricunha%2Fddg-email-panel&demo-title=ddg%20email%20panel&demo-description=ddg%20email%20panel%20is%20the%20open%20source%20unofficial%20duckduckgo%20email%20protection%20panel.&demo-url=https%3A%2F%2Fddg-email-panel.yuricunha.com)

## ⚓ docker deployment

> **note**: docker images are available from the [original repository](https://github.com/whatk233/ddg-email-panel). to build your own image from this fork, use the provided dockerfile.

```shell
docker run -d --restart=always -p 3000:3000 --name ddg-email-panel whatk233/ddg-email-panel
```

## 🔧 local development

### requirements
* node.js 16 or newer
* pnpm (recommended) or npm/yarn

### setup
```bash
git clone https://github.com/isyuricunha/ddg-email-panel.git
cd ddg-email-panel

# install dependencies
pnpm install

# start development server
pnpm dev

# build for production
pnpm build
pnpm start
```

### development commands
```bash
# development server
pnpm dev

# build application
pnpm build

# start production server
pnpm start

# type checking
pnpm type-check

# linting
pnpm lint
```

## 🌐 adding translations

to add a new language:

1. create `public/locales/{lang}/common.json`
2. copy structure from `public/locales/en/common.json`
3. translate all values
4. add locale to `next-i18next.config.js`

## 📝 license
mit

## 🙏 credits
originally created with ♥ by [whatk](https://github.com/whatk233)
