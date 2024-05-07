function getDotPositions(parent) {
    const parentElement = document.getElementById(parent.id);
    let allDots = Array.from(parentElement.querySelectorAll('span.dot'));
    let connected = allDots.filter(
        (d) => !d.classList.contains('disconnected') && !d.classList.contains('hidden') && !d.classList.contains('active')
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
        (dot) => !dot.classList.contains('disconnected') && !dot.classList.contains('hidden') && !dot.classList.contains('active'))
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
    column.scrollTo({ top: position - 64, behavior: 'smooth' });
}

export function scrollHandler(event, viewportOffset = 64) {
    const scrollTop = this.scrollTop + viewportOffset;

    let { sourceContainer, targetContainer } = getSourceAndTargetContainers(event);
    let sourceDotsPositions = getDotPositions(sourceContainer);
    let sourceDot = findClosestDot(sourceDotsPositions, scrollTop);

    if (sourceDot.element.classList.contains('disconnected') && sourceDot.element.classList.contains('hidden') && sourceDot.element.classList.contains('active')) {
        return;
    }
    let targetDot = findMatchingDot(targetContainer, sourceDot.connected_index);

    if (targetDot && filterSelected === false) {
    scrollToDot(targetContainer, targetDot);

    highlightDot(sourceContainer, sourceDot.element);
    highlightDot(targetContainer, targetDot);
  }
}

// document.querySelectorAll(".title-bar").addEventListener("click", )
