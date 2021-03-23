# keyn

`keyn` is a browser extension that adds keyboard navigation.

Install it from [here](https://addons.mozilla.org/en-GB/firefox/addon/keyn).

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
* Select `keyn`
* Select the "Preferences" tab
* Pick a new shortcut (according to the rules on extension shortcuts [here](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/commands#Shortcut_values))

For example, the default combination of `Ctrl+,` is specified as `Ctrl+Comma`.