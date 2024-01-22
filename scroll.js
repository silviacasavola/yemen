// Add the pallozzo span to each chrono-link
const chronolinks = document.querySelectorAll('.chrono-link');
chronolinks.forEach(chronolink => {
  chronolink.innerHTML += " <svg><circle cx='50%' cy='50%' r='50%'></circle></svg>";
});

let lastHighlightedElement = null;

function handleScroll(containerId, elementSelector) {
  const container = document.getElementById(containerId);
  const elements = document.querySelectorAll(elementSelector);

  let closestElement = elements[0];
  let closestDistance = Infinity;

  let elementFound = false; // Flag to check if any element is found within the specified range

  elements.forEach(element => {
    const distance = element.getBoundingClientRect().top;

    if (distance > 0 && distance < 50 && distance < closestDistance) {
      closestElement = element;
      closestDistance = distance;
      elementFound = true; // Set the flag to true when an element is found within the range
    }
  });

  // Only remove the class if an element is found within the specified range
  if (elementFound) {
    elements.forEach(element => {
      element.classList.toggle('highlighted', element === closestElement);
    });

    lastHighlightedElement = closestElement;

    if (closestElement) {
      const closestIndex = Array.from(elements).indexOf(closestElement);
      const targetContainerId = closestElement.classList.contains('chrono-link') ? 'left-side' : 'right-side';
      const targetElementSelector = closestElement.classList.contains('chrono-link') ? '.frame' : '.chrono-link';

      const targetElements = Array.from(document.querySelectorAll(targetElementSelector));
      const targetElement = targetElements[closestIndex];
      const targetOffsetTop = targetElement.offsetTop;

      document.getElementById(targetContainerId).scrollTo({
        top: targetOffsetTop,
        behavior: 'smooth'
      });

      // Add 'highlighted' class to the target element and remove it from its siblings
      targetElements.forEach((target, index) => {
        target.classList.toggle('highlighted', index === closestIndex);
      });
    }
  } else if (lastHighlightedElement) {
    // Keep the last highlighted element
    elements.forEach(element => {
      element.classList.toggle('highlighted', element === lastHighlightedElement);
    });
  }
}

// Attach the event listener to the wheel event for #right-side
document.getElementById('right-side').addEventListener('wheel', () => handleScroll('right-side', '.chrono-link'));

// Attach the event listener to the wheel event for #left-side
document.getElementById('left-side').addEventListener('wheel', () => handleScroll('left-side', '.frame.connected'));

// Initial state
handleScroll('right-side', '.chrono-link');
handleScroll('left-side', '.frame');
