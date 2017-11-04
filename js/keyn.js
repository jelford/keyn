
function activateLinkPicker() {
	browser.tabs.executeScript({
		file: "/js/link-picker.js"
	}).then(function(result) {
	}, function(failure) {
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
	browser.tabs.create({
		url: url,
		active: !openLinkParams.background
	}).catch(reason => {
		console.log("Unable to service new tab request because", reason)
	});
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