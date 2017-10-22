
function init() {
    let state = {
        current_filter: [],
        chosen_link: [],
        last_modified: 'current_filter',
        hints: {}
    }
    
    function show_keyboard_filter() {
        
    }

    function target_element(hint) {
        return state.hints[hint.dataset.linkLabel].clickable;
    }

    function activate(target) {
        if (target.tagName.toUpperCase() == 'INPUT') {
            target.focus();
        } else {
            target.click();
        }
    }

    function positionOnTopOf(a, b) {
        b.style.position = 'absolute';
        let pos = a.getBoundingClientRect();
        b.style.left = `${pos.left}px`;
        b.style.top = `${pos.top}px`;
        b.style.zIndex = "2147483647"; // max int - put it on top of everything
    }
    
    function collect_links() {
        clear_hints();

        let clickables = Array.from(document.getElementsByTagName("A")).concat(Array.from(document.getElementsByTagName('INPUT')));

        for (let i=0; i<clickables.length; ++i) {
            let clickable = clickables[i];
            let hint = document.createElement("span");
            positionOnTopOf(clickable, hint);
            
            hint.style.fontSize = '12px';
            hint.style.font = "monospace";
            hint.style.backgroundColor = "rgba(255,255,0,255)";
            hint.style.color = "rgba(0,0,0,255)";
            hint.style.display = "flow";

            hint.innerText = `${i}`
            hint.classList.add('link-picker');
            if (clickable.tagName.toUpperCase() == 'A') {
                hint.dataset.linkText = clickable.textContent.toLowerCase().replace(/[^a-z]/, '') 
            }
            hint.dataset.linkLabel = ''+i;
            
            document.body.appendChild(hint);

            hint.parentElement.dataset.previousOverflowX = hint.parentElement.style.overflowX;
            hint.parentElement.style.overflowX = 'visible'

            state.hints[hint.dataset.linkLabel] = {
                clickable: clickable
            }
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
        Array.from(document.getElementsByClassName('link-picker'))
            .forEach((el, i) => {
                if (el.dataset.linkText && el.dataset.linkText.indexOf(currentFilter) < 0) {
                    remove_hint(el);
                    return;
                } else if (el.dataset.linkLabel.indexOf(chosenLink) < 0) {
                    remove_hint(el);
                    return;
                }

                if (foundOne) {
                    el.style.backgroundColor = 'rgba(255,255,0,255)';
                } else {
                    el.style.backgroundColor = 'rgba(200, 255, 150, 255)';
                    let theLink = target_element(el);
                    if (theLink.tagName.toUpperCase() == 'A') {
                        theLink.focus();
                    } else {
                        // Don't give focus to input elements, but we still want to see what we're selecting
                        el.scrollIntoView()
                    }
                    foundOne = true;
                }
            });
    }

    function clear_hints() {
        Array.from(
            document.getElementsByClassName('link-picker'))
                .forEach(el => remove_hint(el));
     
    }
    
    function go(isNewTab) {
        let selectedHint = document.getElementsByClassName('link-picker')[0];
        if (selectedHint) {
            let target = target_element(selectedHint);
            activate(target);
        }
        abandon();
    }

    function abandon() {
        document.removeEventListener('keydown', on_key_pressed);
        clear_hints();
    }
    
    function on_key_pressed(event) {
        const keyName = event.key;
        if (keyName == 'Escape') {
            event.preventDefault();
            abandon();
        } else if ('abcdefghijklmnopqrstuvwxyz'.indexOf(keyName) >= 0) {
            event.preventDefault();
            state.current_filter.push(keyName);
            state.last_modified = 'current_filter';
            cull_links();
        } else if (/[0-9]/.test(keyName)) {
            event.preventDefault();
            state.chosen_link.push(keyName);
            state.last_modified = 'chosen_link';
            cull_links();
        } else if (keyName == 'Backspace') {
            event.preventDefault();
            state[state.last_modified].pop();
            collect_links();
        } else if (keyName == 'Enter') {
            go(false);
            event.preventDefault();
        } else {
        }
    }

    document.addEventListener('keydown', on_key_pressed);
    collect_links();
}


init();