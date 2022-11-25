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
