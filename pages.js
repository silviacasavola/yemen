import * as utils from './utils.js';

export async function loadText(url) {
    const file = await fetch(url);
    const text = await file.text();
    return text;
}

let pageElement;

function createPageElement(pageContent, index) {
    pageElement = utils.createElement('div', 'page', `<span class="page-number">page ${index + 1}</span> ${pageContent}`);
    return pageElement;
}

// function appendChronoLinkDots(page) {
//     // const chronoLinkRegex = /<\/span>/g;
//     // page = page.replace(chronoLinkRegex, '</span> <span class="dot"></span>');
//     // return page;
//     //
//     // let dots = document.querySelectorAll('.text-container .dot');
//     // console.log(dots)
//     // dots.innerHTML("ciao")
//     let chronoLinks = document.querySelectorAll('.chrono-link');
//     // console.log(chronoLinks)
//     // chronoLinks.append(
//     //   utils.createElement('span', `dot`)
//     // )
// }

export async function loadAndDisplayPages(text, parentId) {
    let pages = text.split('\n\n');
    // pages = pages.map(appendChronoLinkDots);

    const pagesElements = pages.map(createPageElement);
    let parentElement = document.getElementById(parentId);
    let fragment = document.createDocumentFragment();

    fragment.append(...pagesElements);
    parentElement.appendChild(fragment);

    let chronoLinks = Array.from(document.querySelectorAll('.chrono-link'));

    chronoLinks.forEach((link) => {
    let index = chronoLinks.indexOf(link);
    let dot = utils.createElement('span', `dot`, index + 1);
    dot.setAttribute('data-dot-id', index+1);
    link.append(dot)
    if (index === 0) {link.classList.add('active')}
  })

    return true;
}

const pages = Array.from(document.querySelectorAll('.page'))


// export function clickOnDots() {
//   let dots = document.querySelectorAll('.chrono-link .dot')
//   dots.forEach((dot) => {
//     // dot.style.color = "red"
//   dot.addEventListener('click', function() {
//     console.log("porcatroia")
//   })
// })
// }

export function notesindex() {
    fetch('data/notes.json')
        .then(response => response.json())
        .then(data => {
            const notes = data.notes;

            const textNotes = Array.from(document.querySelectorAll('.note'));
            for (let i = 0; i < textNotes.length; i++) {
                // textNotes[i].innerHTML = "&nbsp;" + (i + 1);
                textNotes[i].innerHTML = "*";

                textNotes[i].addEventListener('click', function() {
                    const index = i;
                    const noteContent = notes[index];
                    const notesContainer = document.getElementById("notes-container");
                    notesContainer.innerHTML = "*" + (i+1) + ")&nbsp;" + noteContent;

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
