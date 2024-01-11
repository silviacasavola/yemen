// Add the pallozzo span to each chrono-link
const chronolinks = document.querySelectorAll('.chrono-link');
chronolinks.forEach(chronolink => {
  let linkcontent = chronolink.innerHTML;
  chronolink.innerHTML = linkcontent + ' <span class="pallozzo">●</span>';
});

function handleScroll(containerId, elementSelector) {
  let scrollPos = document.getElementById(containerId).scrollTop;
  const elements = document.querySelectorAll(elementSelector);

  let closestElement = null;
  let closestDistance = Infinity;

  // Iterate over each element
  elements.forEach(element => {
    const elementRect = element.getBoundingClientRect();
    const distance = Math.abs(elementRect.top); // Use Math.abs to get absolute distance

    // Check if the element is the closest based on top edge
    if (distance < closestDistance) {
      closestElement = element;
      closestDistance = distance;
    }
  });

  // Remove 'highlighted' class from all elements
  elements.forEach(element => {
    element.classList.remove('highlighted');
  });

  // Add 'highlighted' class to the closest element
  if (closestElement !== null) {
    closestElement.classList.add('highlighted');

    // SyncScroll function inside handleScroll
    function syncScroll(containerId, elementSelector) {
    const closestIndex = Array.from(elements).indexOf(closestElement);

    if (closestIndex)

      const highlightedFrame = document.querySelector('.frame.highlighted');
      const highlightedChronoLink = document.querySelector('.chrono-link.highlighted');

      // Scroll containers to the highlighted elements
      const textContainer = document.getElementById('text-container');
      const leftSideContainer = document.getElementById('left-side');

      if (highlightedChronoLink !== null) {
        textContainer.scrollTop = highlightedChronoLink.offsetTop - textContainer.offsetTop;
      }

      if (highlightedFrame !== null) {
        leftSideContainer.scrollTop = highlightedFrame.offsetTop - leftSideContainer.offsetTop;
      }
    }

    // Call syncScroll
    syncScroll(containerId, elementSelector);
  }
}

// Attach the event listener to the scroll event for #right-side
document.getElementById('right-side').addEventListener('scroll', () => handleScroll('right-side', '.chrono-link'));

// Attach the event listener to the scroll event for #left-side
document.getElementById('left-side').addEventListener('scroll', () => handleScroll('left-side', '.frame'));

// Initial state
handleScroll('right-side', '.chrono-link');
handleScroll('left-side', '.frame');
