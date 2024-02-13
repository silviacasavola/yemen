

// Add the pallozzo span to each chrono-link
const chronolinks = document.querySelectorAll('.chrono-link');
chronolinks.forEach(chronolink => {
  chronolink.innerHTML += " <svg><circle cx='50%' cy='50%' r='50%'></circle></svg>";
});

let lastHighlightedElement = null;
let userStartedScrolling = false;

// Function to handle user scrolling
function handleUserScroll() {
  userStartedScrolling = true;

  // Remove the event listener after the user has started scrolling
  document.removeEventListener('wheel', handleUserScroll);
}

// Attach the event listener to the wheel event for the document to detect any scroll action
document.addEventListener('wheel', handleUserScroll);

// Function to handle user scrolling
function handleUserScroll() {
  userStartedScrolling = true;

  // Remove the event listener after the user has started scrolling
  document.removeEventListener('wheel', handleUserScroll);
}

// Attach the event listener to the wheel event for the document to detect any scroll action
document.addEventListener('wheel', handleUserScroll);

function handleScroll(containerId, elementSelector) {
  const container = document.getElementById(containerId);
  const elements = document.querySelectorAll(elementSelector);

  // Filter out .chrono-link elements that belong to .page or .frame elements that are .hidden
  const filteredElements = Array.from(elements).filter(element => {
    const closestPageOrFrame = element.closest('.page, .frame');
    return !closestPageOrFrame || !closestPageOrFrame.classList.contains('hidden');
  });

  // Only perform scroll behavior if the user has started scrolling
  if (userStartedScrolling) {
    // Sort the elements based on their distance from the top
    const sortedElements = filteredElements.sort((a, b) => {
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
    } else if (lastHighlightedElement) {
      // Keep the last highlighted element until it has been the third or fourth closest
      elements.forEach(element => {
        element.classList.toggle('highlighted', element === lastHighlightedElement);
      });
    }
  }
}

// Attach the event listener to the wheel event for #right-side
document.getElementById('right-side').addEventListener('wheel', () => handleScroll('right-side', '.chrono-link'));

// Attach the event listener to the wheel event for #left-side
document.getElementById('left-side').addEventListener('wheel', () => handleScroll('left-side', '.frame.connected'));

// Initial state
handleScroll('right-side', '.chrono-link');
handleScroll('left-side', '.frame');

function handleFilterSelection(event) {
  const filterLink = event.target.closest('.filter-link');
  if (!filterLink) return; // Ignore clicks outside of filter links

  const parentPage = filterLink.closest('.page');
  const parentFrame = filterLink.closest('.frame');

  if (parentPage) {
    // Filter out .chrono-link elements that belong to .page or .frame elements that are .hidden
    const filteredChronoLinks = Array.from(document.querySelectorAll('.chrono-link')).filter(element => {
      const closestPageOrFrame = element.closest('.page, .frame');
      return !closestPageOrFrame || !closestPageOrFrame.classList.contains('hidden');
    });

    // Scroll to the closest element inside "#left-side"
    handleScroll('left-side', '.frame.connected', filteredChronoLinks);
  } else if (parentFrame) {
    // Filter out .chrono-link elements that belong to .page or .frame elements that are .hidden
    const filteredChronoLinks = Array.from(document.querySelectorAll('.chrono-link')).filter(element => {
      const closestPageOrFrame = element.closest('.page, .frame');
      return !closestPageOrFrame || !closestPageOrFrame.classList.contains('hidden');
    });

    // Scroll to the closest element inside "#text-container"
    handleScroll('text-container', '.chrono-link', filteredChronoLinks);
  }
}

// Attach event listener for filter selection
document.querySelectorAll('.filter-link').forEach(filterLink => {
  filterLink.addEventListener('click', handleFilterSelection);
});
