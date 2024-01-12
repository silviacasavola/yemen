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
  // let closestElement = null;
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
      if (closestElement.classList.contains('chrono-link')) {

        let frameArray = Array.from(document.querySelectorAll('.frame'));
        frameArray.forEach(frame => {
          if (frame.classList.contains('highlighted') && frameArray.indexOf(frame) != closestIndex) {
            let frameIndex = frameArray.indexOf(frame)
            if (frameIndex != closestIndex) {
              document.getElementById('left-side').scrollTop = document.querySelectorAll('.frame')[closestIndex].offsetTop;
          }
        }
        })
        }
      }
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
