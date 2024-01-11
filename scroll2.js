const chronolinks = document.querySelectorAll('.chrono-link');

// Add the pallozzo span to each chrono-link
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
  }
}

// Attach the event listener to the scroll event for #right-side
document.getElementById('right-side').addEventListener('scroll', () => handleScroll('right-side', '.chrono-link'));

// Attach the event listener to the scroll event for #left-side
document.getElementById('left-side').addEventListener('scroll', () => handleScroll('left-side', '.frame'));

// Initial state
handleScroll('right-side', '.chrono-link');
handleScroll('left-side', '.frame');
