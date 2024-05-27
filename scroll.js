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

function findClosestDot(dotPositions, scrollTop) {
    return dotPositions.reduce((closest, dot, index) => {

        const distance = Math.abs(dot.position - scrollTop);
        // UNCOMMENT TO EXCLUDE OUT-OF-VIEWPORT DOTS
        // const distance = dot.position - scrollTop;
        // if (distance < 0) return closest; // Ignore dots above the viewportOffset
        if (closest === null || distance < closest.distance) {
            return { ...dot, distance, index };
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
        (dot) => !dot.classList.contains('disconnected') && !dot.classList.contains('active'))
    return connectedDots[index];
}

function highlightDot(container, dot) {
    let allDots = Array.from(container.querySelectorAll('span.dot'));
    allDots.forEach((dot) => dot.classList.remove('active'));
    dot.classList.add('active');

    Array.from(document.querySelectorAll('.frame-container')).forEach(container => {
      if (container.contains(dot)) {
        container.classList.add('active')
      } else {container.classList.remove('active')
    }
  })

    // dot.closest('.frame-container').classList.add('active');
}

function scrollToDot(container, dot) {
    const column = container.parentNode;
    const position = dot.getBoundingClientRect().top + column.scrollTop;
    // console.log("Position:", position + " dot:", dot);
    column.scrollTo({ top: position - 64, behavior: 'smooth' });
}

export function scrollHandler(event) {
    const scrollTop = this.scrollTop + 64;

    let { sourceContainer, targetContainer } = getSourceAndTargetContainers(event);
    let sourceDotsPositions = getDotPositions(sourceContainer);
    let sourceDot = findClosestDot(sourceDotsPositions, scrollTop);

    if (sourceDot.element.classList.contains('disconnected') && sourceDot.element.classList.contains('active')) {
        return;
    }

    let targetDot = findMatchingDot(targetContainer, sourceDot.connected_index);

    if (targetDot) {

    let targetcontainer = targetDot.closest('.frame-container') || targetDot.closest('.page');
    let sourcecontainer = sourceDot.element.closest('.frame-container') || sourceDot.element.closest('.page');

    if (!targetcontainer.classList.contains('hidden') && !sourcecontainer.classList.contains('hidden')) {
    scrollToDot(targetContainer, targetDot);
  }

    highlightDot(sourceContainer, sourceDot.element);
    highlightDot(targetContainer, targetDot);
  }

  // if (attachedevents === false) {
      let allDots = Array.from(document.querySelectorAll('.chrono-link .dot'))
      allDots.forEach(dot => {
      dot.addEventListener('click', dotClickHandler);
  });
  // }
}

function dotClickHandler(event) {
    let textColumn = document.getElementById('text-column');
    let imagesColumn = document.getElementById('images-column');

    let sourceContainer = textColumn.children[0];
    let targetContainer = imagesColumn.children[0];

    // Find the unique identifier of the clicked dot in the source container
    let clickedDotId = event.target.dataset.dotId;

    // Scroll the source container to the clicked dot
    scrollToDot(sourceContainer, event.target);

    // Highlight the clicked dot in the source container
    highlightDot(sourceContainer, event.target);

    // Find the matching dot in the target container based on the unique identifier
    let matchingDot = targetContainer.querySelector(`span.dot[data-dot-id="${clickedDotId}"]`);

    // If a matching dot is found in the target container, scroll the target container to it and highlight it
    if (matchingDot) {
        scrollToDot(targetContainer, matchingDot);
        highlightDot(targetContainer, matchingDot);
    }
}




export function handleP5Scroll(element) {
    const scrollTop = element.scrollTop + 64;

    let sourceContainer = element.children[0];
    let targetContainerId = element.id === 'text-column' ? 'images-column' : 'text-column';
    let targetContainer = document.getElementById(targetContainerId).children[0];

    let sourceDotsPositions = getDotPositions(sourceContainer);
    let sourceDot = findClosestDot(sourceDotsPositions, scrollTop);

    if (sourceDot.element.classList.contains('disconnected') && sourceDot.element.classList.contains('active')) {
        return; // Skip processing if the dot is disconnected or already active
    }

    let targetDot = findMatchingDot(targetContainer, sourceDot.connected_index);
    // console.log(targetDot)

    if (targetDot) {
        let targetContainerParent = targetDot.closest('.frame-container') || targetDot.closest('.page');
        let sourceContainerParent = sourceDot.element.closest('.frame-container') || sourceDot.element.closest('.page');

        // Only scroll if both source and target containers are visible
        if (!targetContainerParent.classList.contains('hidden') && !sourceContainerParent.classList.contains('hidden')) {
            scrollToDot(targetContainer, targetDot);
        }

        highlightDot(sourceContainer, sourceDot.element);
        highlightDot(targetContainer, targetDot);
    }
}
