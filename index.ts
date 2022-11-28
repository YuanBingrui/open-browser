import ip from 'ip';
import {openBrowser as doOpenBrowser} from './openBrowser';

interface OpenBrowserOptions {
  ip?: boolean;
  port?: number;
  url?: string;
  browser?: string;
  path?: string;
}

class OpenBrowser {
  private url: string;
  private browser: string;
  constructor(options: OpenBrowserOptions) {
    this.url = returnUrl(options);
    this.browser = options?.browser || 'google chrome';
  }

  getLocalIP() {
    return getLocalIP();
  }

  open(url?: string, browser?: string) {
    url = url || this.url;
    browser = browser || this.browser;
    doOpenBrowser(url, browser);
  }
}

/**
 * get local ip
 * @returns {String} local ip
 */
function getLocalIP() {
  return ip.address();
}

const returnUrl = (options: OpenBrowserOptions) => {
  if (options?.url) return options?.url;
  const domain = options?.ip ? getLocalIP() : 'localhost';
  const port = options?.port || 3000;
  let path = options?.path;
  path = path?.startsWith('/') ? path?.slice(1) : path;
  return `http://${domain}:${port}/${path || ''}`;
};

export default OpenBrowser;
