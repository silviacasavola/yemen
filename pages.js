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
    return pageElement;
}

function appendChronoLinkDots(page) {
    const chronoLinkRegex = /<\/span>/g;
    page = page.replace(chronoLinkRegex, '</span> <span class="dot"></span>');
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
