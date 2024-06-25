function getDotPositions(parent) {
    const parentElement = document.getElementById(parent.id);
    let allDots = Array.from(parentElement.querySelectorAll('span.dot'));
    let connected = allDots.filter(
        (d) => !d.classList.contains('disconnected') && !d.classList.contains('active')
    );
    let scrollOffset = parentElement.parentNode.scrollTop;

    let dotPositions = Array.from(allDots).map((dot, index) => ({
        element: dot,
        position: dot.getBoundingClientRect().top + scrollOffset,
        all_index: index,
        connected_index: connected.indexOf(dot)
    }));

    return dotPositions;
}

function findClosestElement(positions, scrollTop, isImageColumn) {
    return positions.reduce((closest, item, index) => {
        const distance = Math.abs(item.position - scrollTop);
        if (closest === null || distance < closest.distance) {
            return { ...item, distance, index };
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

function findMatchingDot(container, index) {
    let allDots = Array.from(container.querySelectorAll('span.dot'));
    let connectedDots = allDots.filter(
        (dot) => !dot.classList.contains('disconnected') && !dot.classList.contains('active'));
    return connectedDots[index];
}

function highlightElement(container, element) {
    let allDots = Array.from(container.querySelectorAll('span.dot'));
    allDots.forEach((dot) => dot.classList.remove('active'));
    element.classList.add('active');

    Array.from(document.querySelectorAll('.frame-container')).forEach(frameContainer => {
        if (frameContainer.contains(element)) {
            frameContainer.classList.add('active');
        } else {
            frameContainer.classList.remove('active');
        }
    });
}

function scrollToElement(container, element) {
    const column = container.parentNode;
    const position = element.getBoundingClientRect().top + column.scrollTop;
    column.scrollTo({ top: position - 64, behavior: 'smooth' });
}

export function scrollHandler(event) {
    const scrollTop = this.scrollTop + 64;

    let { sourceContainer, targetContainer } = getSourceAndTargetContainers(event);
    let sourceDotsPositions = getDotPositions(sourceContainer);
    let sourceDot = findClosestElement(sourceDotsPositions, scrollTop, false);

    if (sourceDot.element.classList.contains('disconnected') && sourceDot.element.classList.contains('active')) {
        return;
    }

    let targetContainerPositions = getDotPositions(targetContainer);
    let targetElement = findClosestElement(targetContainerPositions, sourceDot.position, true);

    if (targetElement) {
        let targetContainerParent = targetElement.element.closest('.frame-container') || targetElement.element.closest('.page');
        let sourceContainerParent = sourceDot.element.closest('.frame-container') || sourceDot.element.closest('.page');

        if (!targetContainerParent.classList.contains('hidden') && !sourceContainerParent.classList.contains('hidden')) {
            // scrollToElement(targetContainer, targetElement.element);
        }

        highlightElement(sourceContainer, sourceDot.element);
        highlightElement(targetContainer, targetElement.element);
    }

    let allDots = Array.from(document.querySelectorAll('.chrono-link .dot'));
    allDots.forEach(dot => {
        dot.addEventListener('click', dotClickHandler);
    });
}

function dotClickHandler(event) {
    let textColumn = document.getElementById('text-column');
    let imagesColumn = document.getElementById('images-column');

    let sourceContainer = textColumn.children[0];
    let targetContainer = imagesColumn.children[0];

    let clickedDotId = event.target.dataset.dotId;

    // scrollToElement(sourceContainer, event.target);

    highlightElement(sourceContainer, event.target);

    let matchingDot = targetContainer.querySelector(`span.dot[data-dot-id="${clickedDotId}"]`);

    if (matchingDot) {
        // scrollToElement(targetContainer, matchingDot);
        highlightElement(targetContainer, matchingDot);
    }
}

export function handleP5Scroll(element) {
    const scrollTop = element.scrollTop + 64;

    let sourceContainer = element.children[0];
    let targetContainerId = element.id === 'text-column' ? 'images-column' : 'text-column';
    let targetContainer = document.getElementById(targetContainerId).children[0];

    let sourceDotsPositions = getDotPositions(sourceContainer);
    let sourceDot = findClosestElement(sourceDotsPositions, scrollTop, false);

    if (sourceDot.element.classList.contains('disconnected') && sourceDot.element.classList.contains('active')) {
        return;
    }

    let targetContainerPositions = getDotPositions(targetContainer);
    let targetElement = findClosestElement(targetContainerPositions, sourceDot.position, true);

    if (targetElement) {
        let targetContainerParent = targetElement.element.closest('.frame-container') || targetElement.element.closest('.page');
        let sourceContainerParent = sourceDot.element.closest('.frame-container') || sourceDot.element.closest('.page');

        if (!targetContainerParent.classList.contains('hidden') && !sourceContainerParent.classList.contains('hidden')) {
            // scrollToElement(targetContainer, targetElement.element);
        }

        highlightElement(sourceContainer, sourceDot.element);
        highlightElement(targetContainer, targetElement.element);
    }
}
