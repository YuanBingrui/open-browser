# open-browser

Automatically open browser when starting development server

## features

1. automatically open browser default localhost
2. automatically open browser by local ip
3. support url with path or query

## Install

```
// npm
npm install @xbaijun/open-browser -D
// yarn
yarn add @xbaijun/open-browser -D
// pnpm
pnpm add @xbaijun/open-browser -D
```

## How to use it

```
const openBrowser = require('./cjs/index');
const http = require('node:http');

const OB = new openBrowser({
  ip: true,
  port: 3000,
});

http
  .createServer((req, res) => {
    res.write('hello world\n');
    res.end();
  })
  .listen(3000, () => {
    OB.open();
  });
```

## Docs

```
export interface OpenBrowserOptions {
  ip?: boolean;
  port?: number;
  url?: string;
  browser?: string;
  path?: string;
}

declare class OpenBrowser {
  private url: string;
  private browser: string;
  constructor(options: OpenBrowserOptions);
  getLocalIP(): string;
  open(browser?: string, url?: string): void;
}
```
