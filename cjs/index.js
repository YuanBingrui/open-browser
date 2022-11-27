'use strict';

var ip = require('ip');
var node_path = require('node:path');
var node_child_process = require('node:child_process');
var open = require('open');
var spawn = require('cross-spawn');
var colors = require('picocolors');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

/**
 * The following is modified based on source found in
 * https://github.com/facebook/create-react-app
 *
 * MIT Licensed
 * Copyright (c) 2015-present, Facebook, Inc.
 * https://github.com/facebook/create-react-app/blob/master/LICENSE
 *
 */
/**
 * Reads the BROWSER environment variable and decides what to do with it.
 * Returns true if it opened a browser or ran a node.js script, otherwise false.
 */
function openBrowser(url, opt) {
    // The browser executable to open.
    // See https://github.com/sindresorhus/open#app for documentation.
    var browser = typeof opt === 'string' ? opt : process.env.BROWSER || '';
    if (browser.toLowerCase().endsWith('.js')) {
        return executeNodeScript(browser, url);
    }
    else if (browser.toLowerCase() !== 'none') {
        return startBrowserProcess(browser, url);
    }
    return false;
}
function executeNodeScript(scriptPath, url) {
    var extraArgs = process.argv.slice(2);
    var child = spawn(process.execPath, __spreadArray(__spreadArray([scriptPath], extraArgs, true), [url], false), {
        stdio: 'inherit',
    });
    child.on('close', function (code) {
        if (code !== 0) {
            console.log();
            console.log(colors.red('The script specified as BROWSER environment variable failed.'));
            console.log(colors.cyan(scriptPath) + ' exited with code ' + code + '.');
            console.log();
            return;
        }
    });
    return true;
}
var supportedChromiumBrowsers = [
    'Google Chrome Canary',
    'Google Chrome Dev',
    'Google Chrome Beta',
    'Google Chrome',
    'Microsoft Edge',
    'Brave Browser',
    'Vivaldi',
    'Chromium',
];
function startBrowserProcess(browser, url) {
    // If we're on OS X, the user hasn't specifically
    // requested a different browser, we can try opening
    // a Chromium browser with AppleScript. This lets us reuse an
    // existing tab when possible instead of creating a new one.
    var preferredOSXBrowser = browser === 'google chrome' ? 'Google Chrome' : browser;
    var shouldTryOpenChromeWithAppleScript = process.platform === 'darwin' &&
        (!preferredOSXBrowser || supportedChromiumBrowsers.includes(preferredOSXBrowser));
    if (shouldTryOpenChromeWithAppleScript) {
        try {
            var ps_1 = node_child_process.execSync('ps cax').toString();
            var openedBrowser = preferredOSXBrowser && ps_1.includes(preferredOSXBrowser)
                ? preferredOSXBrowser
                : supportedChromiumBrowsers.find(function (b) { return ps_1.includes(b); });
            // Try our best to reuse existing tab with AppleScript
            node_child_process.execSync("osascript openChrome.applescript \"".concat(encodeURI(url), "\" \"").concat(openedBrowser, "\""), {
                cwd: node_path.join(__dirname, '../'),
                stdio: 'ignore',
            });
            return true;
        }
        catch (err) {
            // Ignore errors
        }
    }
    // Another special case: on OS X, check if BROWSER has been set to "open".
    // In this case, instead of passing the string `open` to `open` function (which won't work),
    // just ignore it (thus ensuring the intended behavior, i.e. opening the system browser):
    // https://github.com/facebook/create-react-app/pull/1690#issuecomment-283518768
    if (process.platform === 'darwin' && browser === 'open') {
        browser = undefined;
    }
    // Fallback to open
    // (It will always open new tab)
    try {
        var options = browser ? { app: { name: browser } } : {};
        open(url, options).catch(function () { }); // Prevent `unhandledRejection` error.
        return true;
    }
    catch (err) {
        return false;
    }
}

var OpenBrowser = /** @class */ (function () {
    function OpenBrowser(options) {
        this.url = returnUrl(options);
        this.browser = (options === null || options === void 0 ? void 0 : options.browser) || 'google chrome';
    }
    OpenBrowser.prototype.getLocalIP = function () {
        return getLocalIP();
    };
    OpenBrowser.prototype.open = function (browser, url) {
        url = url || this.url;
        browser = browser || this.browser;
        openBrowser(url, browser);
    };
    return OpenBrowser;
}());
/**
 * get local ip
 * @returns {String} local ip
 */
function getLocalIP() {
    return ip.address();
}
var returnUrl = function (options) {
    if (options === null || options === void 0 ? void 0 : options.url)
        return options === null || options === void 0 ? void 0 : options.url;
    var domain = (options === null || options === void 0 ? void 0 : options.ip) ? getLocalIP() : 'localhost';
    var port = (options === null || options === void 0 ? void 0 : options.port) || 3000;
    var path = options === null || options === void 0 ? void 0 : options.path;
    path = (path === null || path === void 0 ? void 0 : path.startsWith('/')) ? path === null || path === void 0 ? void 0 : path.slice(1) : path;
    return "http://".concat(domain, ":").concat(port, "/").concat(path || '');
};

module.exports = OpenBrowser;
