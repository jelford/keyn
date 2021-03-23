function _keyn_activate_link_picker() {
    const _keyn_browser_ctl = {
        openLink(linkElement, isNewTab, isBackground) {
            if (!isNewTab) {
                linkElement.click();
            } else {
                browser.runtime.sendMessage({
                    apiCall: {
                        action: 'open-in-tab',
                        url: linkElement.href,
                        background: isBackground
                    }
                });
            }
        }
    }

    function fresh_state() {
        return { 
            current_filter: [],
            chosen_link: [],
            last_modified: 'current_filter',
            hints: {} 
        };
    }

    let state = fresh_state();

    function clear_state() {
        state = fresh_state();
    }

    function target_element(hint) {
        return state.hints[hint.dataset.linkLabel].clickable;
    }

    function activate(target, isNewTab, isBackground) {
        const tagName = target.tagName.toUpperCase();
        if (tagName == 'INPUT') {
            target.focus();
            if (target.type == 'radio' || target.type == 'checkbox' || target.type == 'submit') {
                target.click();
            }
        } else if (tagName == 'BUTTON') {
            target.click();
        } else {
            _keyn_browser_ctl.openLink(target, isNewTab, isBackground);
        }
    }

    function positionOnTopOf(a, b) {
        b.style.position = 'absolute';
        let pos = a.getBoundingClientRect();
        b.style.left = `${pos.left + window.scrollX}px`;
        b.style.top = `${pos.top + window.scrollY}px`;
        b.style.zIndex = "2147483647"; // max int - put it on top of everything
    }

    function createHintElement() {
        let hint = document.createElement("span");
        hint.style.fontSize = '12px';
        hint.style.font = "monospace";
        hint.style.backgroundColor = "rgba(255,255,0,255)";
        hint.style.color = "rgba(0,0,0,255)";
        hint.style.display = "flow";
        hint.classList.add('keyn-link-picker');
        return hint;
    }

    function linkTextForElement(element) {
        const tagName = element.tagName.toUpperCase();
        if (tagName == 'A' || tagName == 'BUTTON') {
            return element.textContent.toLowerCase().replace(/[^a-z]/, '');
        } else if (tagName == 'IMG') {
            return element.title;
        } else {
            return null;
        }
    }
    
    function addHintTo(clickable, label) {
        
        let hint = createHintElement(label);
        hint.innerText = label
        hint.dataset.linkText = linkTextForElement(clickable);
        positionOnTopOf(clickable, hint);

        hint.dataset.linkLabel = label;
        
        document.body.appendChild(hint);

        hint.parentElement.dataset.previousOverflowX = hint.parentElement.style.overflowX;
        hint.parentElement.style.overflowX = 'visible'

        state.hints[hint.dataset.linkLabel] = {
            clickable: clickable
        }
    }

    function isOnScreen(element) {
        let elRect = element.getBoundingClientRect();
        
        return (elRect.top < window.innerHeight)
            && (elRect.bottom > 0)
            && (elRect.left < window.innerWidth)
            && (elRect.right > 0);
    }
    
    function collect_links() {
        clear_hints();

        let clickables = Array.from(document.getElementsByTagName("A"))
                            .concat(Array.from(document.getElementsByTagName('INPUT')))
                            .concat(Array.from(document.getElementsByTagName('BUTTON')))
                            .filter(e => isOnScreen(e));

        for (let i=0; i<clickables.length; ++i) {
            let clickable = clickables[i];
            addHintTo(clickable, `${i}`);
        }
        
        cull_links();
    }

    function remove_hint(h) {
        let container = h.parentElement;
        container.style.overflowX = container.dataset.previousOverflowX;
        h.remove();
    }

    function cull_links() {
        currentFilter = state.current_filter.join('');
        chosenLink = state.chosen_link.join('');
        var foundOne = false;
        hints().forEach((el, i) => {
            if (el.dataset.linkText && el.dataset.linkText.indexOf(currentFilter) < 0) {
                remove_hint(el);
                return;
            } else if (!el.dataset.linkText && currentFilter) {
                remove_hint(el);
                return;
            } else if (el.dataset.linkLabel.indexOf(chosenLink) != 0) {
                remove_hint(el);
                return;
            }

            if (foundOne) {
                el.style.backgroundColor = 'rgba(255,255,0,255)';
            } else {
                el.style.backgroundColor = 'rgba(200, 255, 150, 255)';
                foundOne = true;
            }
        });
    }

    function hints() {
        return Array.from(
            document.getElementsByClassName('keyn-link-picker'));
    }

    function clear_hints() {
        hints().forEach(el => remove_hint(el));
     
    }
    
    function go(isNewTab, isBackground) {
        let selectedHint = hints()[0];
        if (selectedHint) {
            let target = target_element(selectedHint);
            activate(target, isNewTab, isBackground);
        } else {
            console.log("Nothing selected");
        }
    }

    function abandon() {
        document.removeEventListener('keydown', on_key_pressed, true);
        clear_hints();
        clear_state();
    }
    
    function on_key_pressed(event) {
        const keyName = event.key;
        if (event.isComposing || event.keyCode === 229) {
            console.log("Ignoring key press due to composing");
            // This event is part of IME composition and should be left alone
            return;
        }
        event.stopPropagation();
        event.preventDefault();

        if (keyName == 'Escape') {
            abandon();
        } else if (keyName == 'Backspace') {
            state[state.last_modified].pop();
            collect_links();
        } else if (keyName == 'Enter') {
            go(event.shiftKey, event.altKey);
            abandon();
        } else if (/^[a-z]$/.test(keyName)) {
            state.current_filter.push(keyName);
            state.last_modified = 'current_filter';
            cull_links();
        } else if (/^[0-9]$/.test(keyName)) {
            state.chosen_link.push(keyName);
            state.last_modified = 'chosen_link';
            cull_links();
        }
    }

    document.addEventListener('keydown', on_key_pressed, true);
    collect_links();
}

_keyn_activate_link_picker();
