interface OpenBrowserOptions {
    ip?: boolean;
    port?: number;
    url?: string;
    browser?: string;
    path?: string;
}
declare class OpenBrowser {
    private url;
    private browser;
    constructor(options: OpenBrowserOptions);
    getLocalIP(): string;
    open(url?: string, browser?: string): void;
}
export default OpenBrowser;
