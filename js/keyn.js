"use strict";

function activateLinkPicker() {
	browser.tabs.executeScript({
		file: "/lib/browser-polyfill.js"
	});
	browser.tabs.executeScript({
		file: "/js/link-picker.js"
	}).then(function(result) {
		return browser.tabs.executeScript({
			code: "_keyn_activate_link_picker();"
		});
	}).error(function(failure) {
		console.log("Script injection failed:", failure);
	});
}

function handleCommand(command) {
	if (command == "pick-clickable") {
        activateLinkPicker();
    }
}

function handleOpenInTab(openLinkParams, requester) {
	let url = openLinkParams.url;
	browser.tabs.query({
		active: true,
		windowId: browser.windows.WINDOW_ID_CURRENT
	}).then(function (activeTabs) {
		let activeTab = activeTabs.length > 0 ? activeTabs[0] : undefined;
		console.log("Currently active tab:", activeTab);
		let activeTabId = activeTab ? activeTab.id : undefined;
		let newTabParams = {
			url: url,
			active: !openLinkParams.background,
			openerTabId: activeTabId
		};

		browser.tabs.create(newTabParams).catch(reason => {
			console.log("Unable to service new tab request because", reason)
		});
	})
	
}

function handleApiRequest(apiCall, sender, sendResponse) {
	if (apiCall.action = 'open-in-tab') {
		handleOpenInTab(apiCall, sender);
	}
}

function handleMessage(request, sender, sendResponse) {
	if (request.apiCall) {
		handleApiRequest(request.apiCall, sender, sendResponse);
	}
}

browser.commands.onCommand.addListener(handleCommand);
browser.runtime.onMessage.addListener(handleMessage);