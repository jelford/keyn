
function init() {
    let state = {
        current_filter: [],
        chosen_link: [],
        last_modified: 'current_filter',

    }
    
    function show_keyboard_filter() {
        
    }
    
    function collect_links() {
        clear_hints();
        console.log("Collecting hints");

        let links = document.getElementsByTagName("a");
        for (let i=0; i<links.length; ++i) {
            let link = links[i];
            let link_label = document.createElement("span");
            link_label.style.position = 'absolute';
            let pos = link.getBoundingClientRect();
            link_label.style.left = link.style.position == 'static' ? pos.left : '0px';
            link_label.style.top = link.style.position == 'static' ? pos.top : '0px';
            link_label.style.zIndex = "999!important";
            link_label.style.font = "monospace!important";
            link_label.style.backgroundColor = "#FFFF00";
            link_label.style.color = "#000000";
            link_label.style.display = "flow";
            link_label.style.cssFloat = "left";
            link_label.innerText = `${i}`
            link_label.classList.add('link-picker');
            link_label.dataset.linkText = link.textContent.toLowerCase().replace(/[^a-z]/, '');
            link_label.dataset.linkLabel = i;
            link.dataset.previousOverflowX = link.style.overflowX;
            link.style.overflowX = 'visible'
            link.appendChild(link_label);
        }
        
        cull_links();
    }

    function remove_hint(h) {
        h.parentNode.style.overflowX = h.parentElement.dataset.previousOverflowX;
        h.remove();
    }

    function cull_links() {
        console.log("Culling hints");
        currentFilter = state.current_filter.join('');
        chosenLink = state.chosen_link.join('');
        var foundOne = false;
        Array.from(document.getElementsByClassName('link-picker'))
            .forEach((el, i) => {
                if (el.dataset.linkText.indexOf(currentFilter) < 0) {
                    console.log(`${el.dataset.linkText} doesn't match ${currentFilter}`);
                    remove_hint(el);
                    return;
                } else if (el.dataset.linkLabel.indexOf(chosenLink) < 0) {
                    console.log(`${el.dataset.linkLabel} doesn't match ${chosenLink}`);
                    remove_hint(el);
                    return;
                }

                if (foundOne) {
                    el.style.backgroundColor = '#FFFF00';
                } else {
                    el.style.backgroundColor = '#AAFF55';
                    foundOne = true;
                }
            });
    }

    function clear_hints() {
        console.log("Clearing hints");
        Array.from(
            document.getElementsByClassName('link-picker'))
                .forEach(el => remove_hint(el));
     
    }
    
    function go(isNewTab) {
        let selectedLink = document.getElementsByClassName('link-picker')[0];
        if (selectedLink) {
            selectedLink.parentElement.click();
        }
        abandon();
    }

    function abandon() {
        document.removeEventListener('keydown', on_key_pressed);
        clear_hints();
    }
    
    function on_key_pressed(event) {
        const keyName = event.key;
        console.log('Got key: ', keyName);
        if (keyName == 'Escape') {
            abandon();
        } else if ('abcdefghijklmnopqrstuvwxyz'.indexOf(keyName) >= 0) {
            state.current_filter.push(keyName);
            state.last_modified = 'current_filter';
            cull_links();
        } else if (/[0-9]/.test(keyName)) {
            state.chosen_link.push(keyName);
            state.last_modified = 'chosen_link';
            cull_links();
        } else if (keyName == 'Backspace') {
            state[state.last_modified].pop();
            collect_links();
        } else if (keyName == 'Enter') {
            go(false);
        } else {
            console.log("No action matched for:", keyName);
        }
    }

    document.addEventListener('keydown', on_key_pressed);
    collect_links();
}


init();