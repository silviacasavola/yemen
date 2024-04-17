import * as utils from './utils.js';

export async function loadText(url) {
    const file = await fetch(url);
    const text = await file.text();
    return text;
}

let pageElement;

function createPageElement(pageContent, index) {
    pageElement = utils.createElement('div', 'page');
    pageElement.append(
        utils.createElement('div', 'page-number', `pg. ${index + 1}`),
        utils.createElement('div', 'page-content', pageContent)
    );

    if (index %2 === 0) {
      pageElement.classList.add("pari");
    } else {
      pageElement.classList.add("dispari")
    }

    return pageElement;
}

function appendChronoLinkDots(page) {
    const chronoLinkRegex = /<\/span>/g;
    page = page.replace(chronoLinkRegex, '</span> <span class="dot scrollactivator"></span>');
    return page;
}

export async function loadAndDisplayPages(text, parentId) {
    let pages = text.split('\n\n');
    pages = pages.map(appendChronoLinkDots);

    const pagesElements = pages.map(createPageElement);
    let parentElement = document.getElementById(parentId);
    let fragment = document.createDocumentFragment();

    fragment.append(...pagesElements);
    parentElement.appendChild(fragment);

    return true;
}

const pages = Array.from(document.querySelectorAll('.page'))

export function notesindex() {
    fetch('data/notes.json')
        .then(response => response.json())
        .then(data => {
            const notes = data.notes;

            const textNotes = Array.from(document.querySelectorAll('.note'));
            for (let i = 0; i < textNotes.length; i++) {
                textNotes[i].innerHTML = i + 1;

                textNotes[i].addEventListener('click', function() {
                    const index = i;
                    const noteContent = notes[index];
                    const notesContainer = document.getElementById("notes-container");
                    notesContainer.innerHTML = i+1 + ") " + noteContent;

                    notesContainer.classList.add('shown');

                    // Reset the class after 30 seconds or if the user scrolls
                    const timeout = setTimeout(() => {
                        notesContainer.classList.remove('shown');
                        clearTimeout(timeout);
                    }, 30000);

                    const scrollHandler = () => {
                                            notesContainer.classList.remove('shown');
                                            clearTimeout(timeout);
                                            window.removeEventListener('scroll', scrollHandler);
                                        };
                                        window.addEventListener('scroll', scrollHandler);
                });
            }
        });
}
