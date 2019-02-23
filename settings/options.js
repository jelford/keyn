function reportSettingsError(msg, e) {
    console.log("Error saving settings (", msg, ") : ", e);
    document.querySelector("#error-msg").classList.remove("hidden");
    updateFormFromShortcuts();
}

function hideError() {
    document.querySelector("#error-msg").classList.add("hidden");
}

const commandNamesToFormElements = {
    "pick-clickable": "#keyn-activation-shortcut"
};

const formElementsToCommanNames = {
    "#keyn-activation-shortcut": "pick-clickable"
}

function updateShortcutsFromForm() {
    for (let elSelector in formElementsToCommanNames) {
        let commandName = formElementsToCommanNames[elSelector];
        let keynShortcut = document.querySelector(elSelector).value;
        try {
            browser.commands.update({
                name: commandName,
                shortcut: keynShortcut
            }).catch(e => reportSettingsError("saving shortcut for " + commandName, e));
        } catch (e) {
            reportSettingsError("saving shortcut for " + commandName, e);
        }
    }
}

function updateFormFromShortcuts() {
    browser.commands.getAll().then(function(commands) {
        for (let c of commands) {
            let elSelector = commandNamesToFormElements[c.name];
            document.querySelector(elSelector).value = c.shortcut;
        }
    });
}

function saveOptions(e) {
    e.preventDefault();
    updateShortcutsFromForm();
}

function restoreOptions() {
    updateFormFromShortcuts();
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#hide-error").addEventListener("click", hideError);