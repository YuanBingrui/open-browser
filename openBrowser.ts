/**
 * The following is modified based on source found in
 * https://github.com/facebook/create-react-app
 *
 * MIT Licensed
 * Copyright (c) 2015-present, Facebook, Inc.
 * https://github.com/facebook/create-react-app/blob/master/LICENSE
 *
 */

import {join} from 'node:path';
import {execSync} from 'node:child_process';
import open from 'open';
import spawn from 'cross-spawn';
import colors from 'picocolors';

/**
 * Reads the BROWSER environment variable and decides what to do with it.
 * Returns true if it opened a browser or ran a node.js script, otherwise false.
 */
export function openBrowser(url: string, opt: string | true): boolean {
  // The browser executable to open.
  // See https://github.com/sindresorhus/open#app for documentation.
  const browser = typeof opt === 'string' ? opt : process.env.BROWSER || '';
  if (browser.toLowerCase().endsWith('.js')) {
    return executeNodeScript(browser, url);
  } else if (browser.toLowerCase() !== 'none') {
    return startBrowserProcess(browser, url);
  }
  return false;
}

function executeNodeScript(scriptPath: string, url: string) {
  const extraArgs = process.argv.slice(2);
  const child = spawn(process.execPath, [scriptPath, ...extraArgs, url], {
    stdio: 'inherit',
  });
  child.on('close', (code) => {
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

const supportedChromiumBrowsers = [
  'Google Chrome Canary',
  'Google Chrome Dev',
  'Google Chrome Beta',
  'Google Chrome',
  'Microsoft Edge',
  'Brave Browser',
  'Vivaldi',
  'Chromium',
];

function startBrowserProcess(browser: string | undefined, url: string) {
  // If we're on OS X, the user hasn't specifically
  // requested a different browser, we can try opening
  // a Chromium browser with AppleScript. This lets us reuse an
  // existing tab when possible instead of creating a new one.
  const preferredOSXBrowser = browser === 'google chrome' ? 'Google Chrome' : browser;
  const shouldTryOpenChromeWithAppleScript =
    process.platform === 'darwin' &&
    (!preferredOSXBrowser || supportedChromiumBrowsers.includes(preferredOSXBrowser));

  if (shouldTryOpenChromeWithAppleScript) {
    try {
      const ps = execSync('ps cax').toString();
      const openedBrowser =
        preferredOSXBrowser && ps.includes(preferredOSXBrowser)
          ? preferredOSXBrowser
          : supportedChromiumBrowsers.find((b) => ps.includes(b));
      // Try our best to reuse existing tab with AppleScript
      execSync(`osascript openChrome.applescript "${encodeURI(url)}" "${openedBrowser}"`, {
        cwd: join(__dirname, '../'),
        stdio: 'ignore',
      });
      return true;
    } catch (err) {
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
    const options: open.Options = browser ? {app: {name: browser}} : {};
    open(url, options).catch(() => {}); // Prevent `unhandledRejection` error.
    return true;
  } catch (err) {
    return false;
  }
}
