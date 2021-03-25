# keyn

`keyn` is a browser extension that adds keyboard navigation.

Install it from [here](https://addons.mozilla.org/en-GB/firefox/addon/keyn).

![screenshot of wikipedia page about browser extensions, with links highlighted by keyn](docs/keyn-filter-chrome-webstore.png)

## usage

Press `Ctrl+,` to show nav hints:

![screenshot of this repo with links highlighted for navigation](docs/keyn-filter-empty.png)

Let's navigate to the issues page. `keyn` filters as you type - start with `is`:

![screenshot showing keyn hints filtered to only highlight links starting with the letters "is"](docs/keyn-filter-issues.png)

Finally select the link you want by typing the number next to it:

![screenshot showing one of the two issues links selected after typing "1"](docs/keyn-filter-select-link.png)

Follow the link with `Enter` (`Shift+Enter` for a new tab, `Alt+Enter` for a background tab).

## configuration

You can customize the activation key (default: `Ctrl+,`) in the addon settings screen.

* Go to: `about:addons`
* Select the cog at the top of the list
* Select "Manage Extension Shortcuts"

# developer documentation

## dev setup

You will need Firefox, Chrome, their respective Webdriver plugins (for testng), and the normal Node stuff.
For your convenience, `Containerfile` will set you up a sensible working environment:

```
podman build -t keyndev .
toolbox create -i keyndev -c keyndev
toolbox enter keyndev

# npm install, npm test, etc.
```

## building

Build using Mozilla's [`web-ext`](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) tool:

```
web-ext lint
web-ext build
```

Output will be under `web-ext-artifacts` and should be compatible with Firefox or
Chrome. 

## dependencies

`keyn` uses only one third-part dependency: [`webextension-polyfill`](https://github.com/mozilla/webextension-polyfill). 
It's used in [unbundled form](https://github.com/mozilla/webextension-polyfill#basic-setup),
downloaded into the `libs/` folder. Update by replacing with the latest version.