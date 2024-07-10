function getPositions(parent, selector) {
    const parentElement = document.getElementById(parent.id);
    let allElements = Array.from(parentElement.querySelectorAll(selector));
    let connected = allElements.filter(
        (el) => !el.classList.contains('active')
    );
    let scrollOffset = parentElement.parentNode.scrollTop;

    let elementPositions = allElements.map((element, index) => ({
        element: element,
        position: element.getBoundingClientRect().top + scrollOffset - 10,
        all_index: index,
        connected_index: connected.indexOf(element)
    }));

    return elementPositions;
}

function findClosestElement(positions, scrollTop) {
    return positions.reduce((closest, item) => {
        const distance = Math.abs(item.position - scrollTop);
        if (closest === null || distance < closest.distance) {
            return { ...item, distance };
        }
        return closest;
    }, null);
}

function getSourceAndTargetContainers(event) {
    const columns = ['text-column', 'images-column'];
    const sourceColumn = event.target.closest('.layout-column');

    const targetId = columns.filter((col) => col !== sourceColumn.id)[0];
    const targetColumn = document.getElementById(targetId);

    const sourceContainer = sourceColumn.children[0];
    const targetContainer = targetColumn.children[0];

    return { sourceContainer, targetContainer };
}

function findMatchingElement(container, index, selector) {
    let allElements = Array.from(container.querySelectorAll(selector));
    let connectedElements = allElements.filter(
        (el) => !el.classList.contains('active')
    );
    return connectedElements[index];
}

function highlightElement(container, element) {
    let allElements = Array.from(container.querySelectorAll('.active'));
    allElements.forEach((el) => el.classList.remove('active'));
    element.classList.add('active');
}

function scrollToElement(container, element) {
    const column = container.parentNode;
    const position = element.getBoundingClientRect().top + column.scrollTop;
    column.scrollTo({ top: position - 50, behavior: 'smooth' });
}

export function scrollHandler(event) {
    const scrollTop = this.scrollTop - 50;

    let { sourceContainer, targetContainer } = getSourceAndTargetContainers(event);

    let sourceSelector = sourceContainer.closest('.layout-column').id === 'text-column' ? '.chrono-link' : '.frame-container.connected';
    let targetSelector = sourceContainer.closest('.layout-column').id === 'text-column' ? '.frame-container.connected' : '.chrono-link';

    let sourcePositions = getPositions(sourceContainer, sourceSelector);
    let sourceElement = findClosestElement(sourcePositions, scrollTop);

    if (sourceElement.element.classList.contains('active')) {
        return;
    }

    let targetElement = findMatchingElement(targetContainer, sourceElement.connected_index, targetSelector);

    if (targetElement) {
        let targetContainerParent = targetElement.closest('.frame-container') || targetElement.closest('.page');
        let sourceContainerParent = sourceElement.element.closest('.frame-container') || sourceElement.element.closest('.page');

        if (!targetContainerParent.classList.contains('hidden') && !sourceContainerParent.classList.contains('hidden')) {
            scrollToElement(targetContainer, targetElement);
        }

        highlightElement(sourceContainer, sourceElement.element);
        highlightElement(targetContainer, targetElement);
    }
}

export function attachDotsEventListeners() {
    setTimeout(() => {
        let allDots = Array.from(document.querySelectorAll('.dot')).filter(
            (d) => !d.classList.contains('disconnected')
        );


        allDots.forEach(dot => {
            dot.addEventListener('click', function(event) {
                elementClickHandler(event);
            });
        });
    }, 1000);
}

function elementClickHandler(event) {
    let textColumn = document.getElementById('text-column');
    let imagesColumn = document.getElementById('images-column');

    let sourceColumn, targetColumn;
    if (event.target.closest('#text-column')) {
        sourceColumn = textColumn;
        targetColumn = imagesColumn;
    } else {
        sourceColumn = imagesColumn;
        targetColumn = textColumn;
    }

    let sourceContainer = sourceColumn.children[0];
    let targetContainer = targetColumn.children[0];

    // let clickedElement = event.target.closest('.dot');
    let dataSelector = event.target.getAttribute('data-dot-id');

    if (dataSelector !== null) {
        let matchingDot = targetContainer.querySelector(`.dot[data-dot-id="${dataSelector}"]`);
        let matchingElement = matchingDot.closest('.frame-container.connected') || matchingDot.closest('.page') ;
        console.log(matchingDot, matchingElement)

        if (matchingElement) {
            scrollToElement(sourceContainer, event.target);
            scrollToElement(targetContainer, matchingElement);
            highlightElement(sourceContainer, event.target);
            highlightElement(targetContainer, matchingElement);
        }
    }
}

export function handleP5Scroll(element) {
    const scrollTop = element.scrollTop - 50;

    let sourceContainer = element.children[0];
    let targetContainerId = element.id === 'text-column' ? 'images-column' : 'text-column';
    let targetContainer = document.getElementById(targetContainerId).children[0];

    let sourceSelector = element.id === 'text-column' ? '.chrono-link' : '.frame-container.connected';
    let targetSelector = element.id === 'text-column' ? '.frame-container.connected' : '.chrono-link';

    let sourcePositions = getPositions(sourceContainer, sourceSelector);
    let sourceElement = findClosestElement(sourcePositions, scrollTop);

    if (sourceElement.element.classList.contains('active')) {
        return;
    }

    let targetElement = findMatchingElement(targetContainer, sourceElement.connected_index, targetSelector);

    if (targetElement) {
        let targetContainerParent = targetElement.closest('.frame-container') || targetElement.closest('.page');
        let sourceContainerParent = sourceElement.element.closest('.frame-container') || sourceElement.element.closest('.page');

        if (!targetContainerParent.classList.contains('hidden') && !sourceContainerParent.classList.contains('hidden')) {
            scrollToElement(targetContainer, targetElement);
            scrollToElement(sourceContainer,  sourceElement.element);
        }

        highlightElement(sourceContainer, sourceElement.element);
        highlightElement(targetContainer, targetElement);
    }
}
