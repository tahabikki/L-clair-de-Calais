# L'éclair de Calais

Website for L'éclair de Calais, built with Next.js 15 (App Router), React 19, and TypeScript.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin panel

The menu/content admin lives at `/admin` and is protected by HTTP Basic Auth.
Credentials are read from environment variables:

```
ADMIN_USER=admin
ADMIN_PASSWORD=changeme
```

Set these in a local `.env.local` file (see `.env.example`) and **change the
default password** before sharing the site outside your own machine.

## Build

```bash
npm run build
npm start
```
