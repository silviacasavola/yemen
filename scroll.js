function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}


// Add the pallozzo span to each chrono-link
const chronolinks = document.querySelectorAll('.chrono-link');

// chronolinks.forEach(chronolink => {
//   chronolink.innerHTML += "<svg><circle cx='50%' cy='50%' r='50%'></circle></svg>";
// });

let lastHighlightedElement = null;
let userStartedScrolling = false;

// Function to handle user scrolling
function handleUserScroll() {
  console.log("Sto handlando lo scroll dell'user")
  userStartedScrolling = true;

  // Remove the event listener after the user has started scrolling
  document.removeEventListener('wheel', handleUserScroll);
}

// Attach the event listener to the wheel event for the document to detect any scroll action
document.addEventListener('wheel', handleUserScroll);

function handleScroll(containerId, elementSelector) {
  // container id : colonna che sta scrollando (testo oppure immagini)
  // elementSelector: elemento da scrollare

  const container = document.getElementById(containerId);
  const elements = document.querySelectorAll(elementSelector);

  // Only perform scroll behavior if the user has started scrolling
  if (userStartedScrolling && filterSelected === false) {
    // Sort the elements based on their distance from the top
    const sortedElements = Array.from(elements).sort((a, b) => {
      const distanceA = Math.abs(a.getBoundingClientRect().top);
      const distanceB = Math.abs(b.getBoundingClientRect().top);
      return distanceA - distanceB;
    });

    const closestElement = sortedElements[0];

    // Only remove the class if an element is found within the specified range
    if (closestElement) {
      elements.forEach(element => {
        element.classList.toggle('highlighted', element === closestElement);
      });

      lastHighlightedElement = closestElement;

      const closestIndex = Array.from(elements).indexOf(closestElement);
      const targetContainerId = closestElement.classList.contains('chrono-link') ? 'left-side' : 'right-side';
      const targetElementSelector = closestElement.classList.contains('chrono-link') ? '.frame.connected' : '.chrono-link';
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
    } else if (lastHighlightedElement) {
      // Keep the last highlighted element until it has been the third or fourth closest
      elements.forEach(element => {
        element.classList.toggle('highlighted', element === lastHighlightedElement);
      });
    }
  }
}
const timeout = 10;
const debouncedHandleScrollRightSide = debounce(() => handleScroll('right-side', '.chrono-link'), timeout);
const debouncedHandleScrollLeftSide = debounce(() => handleScroll('left-side', '.frame.connected'), timeout);

// Attach the event listener to the wheel event for #right-side with debounce
document.getElementById('right-side').addEventListener('wheel', debouncedHandleScrollRightSide);

// Attach the event listener to the wheel event for #left-side with debounce
document.getElementById('left-side').addEventListener('wheel', debouncedHandleScrollLeftSide);

// Initial state - it's usually not necessary to debounce these as they are one-time initializations
handleScroll('right-side', '.chrono-link');
handleScroll('left-side', '.frame.connected');
