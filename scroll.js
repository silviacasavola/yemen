// Add the pallozzo span to each chrono-link
const chronolinks = document.querySelectorAll('.chrono-link');
chronolinks.forEach(chronolink => {
  let linkcontent = chronolink.innerHTML;
  chronolink.innerHTML = linkcontent + ' <span class="pallozzo">●</span>';
});

function handleScroll(containerId, elementSelector) {
  let scrollPos = document.getElementById(containerId).scrollTop;
  const elements = document.querySelectorAll(elementSelector);

  let closestElement = elements[0];
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

    // Get the index of closestElement in the elements array
    const closestIndex = Array.from(elements).indexOf(closestElement);

    // SyncScroll function inside handleScroll
    function syncScroll(containerId, elementSelector, index) {
      let targetContainerId, targetElementSelector;

      if (closestElement.classList.contains('chrono-link')) {
        targetContainerId = 'left-side';
        targetElementSelector = '.frame';
      } else if (closestElement.classList.contains('frame')) {
        targetContainerId = 'right-side';
        targetElementSelector = '.chrono-link';
      }

      const targetElements = document.querySelectorAll(targetElementSelector);
      const targetElement = targetElements[closestIndex];
      const targetOffsetTop = targetElement.offsetTop;

      document.getElementById(targetContainerId).scrollTo({
        top: targetOffsetTop,
        behavior: 'smooth'
      });

      closestElement = targetElement;
    }

    // Call syncScroll with the index
    syncScroll(containerId, elementSelector, closestIndex);
  }
}

// Attach the event listener to the scroll event for #right-side
document.getElementById('right-side').addEventListener('scroll', () => handleScroll('right-side', '.chrono-link'));

// Attach the event listener to the scroll event for #left-side
document.getElementById('left-side').addEventListener('scroll', () => handleScroll('left-side', '.frame'));

// Initial state
handleScroll('right-side', '.chrono-link');
handleScroll('left-side', '.frame');
