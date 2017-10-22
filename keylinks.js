document.body.style.border = "5px solid red";

browser.commands.onCommand.addListener(function(command) {
	if (command == "toggle-feature") {
		browser.tabs.executeScript({
			file: "/link-picker.js"
		}).then(function(result) {
		}, function(failure) {
			console.log("Script injection failed:", failure);
		});
	}
});
