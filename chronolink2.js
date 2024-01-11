const chronolinks = document.querySelectorAll('.chrono-link');

// Add the pallozzo span to each chrono-link
chronolinks.forEach(chronolink => {
  let linkcontent = chronolink.innerHTML;
  chronolink.innerHTML = linkcontent + ' <span class="pallozzo">●</span>';
});

function handleScroll() {
  let scrollPos = document.getElementById('right-side').scrollTop;
  let closestLink = null;
  let closestDistance = Infinity;

  // Iterate over each .chrono-link
  chronolinks.forEach(link => {
    const linkRect = link.getBoundingClientRect();
    const distance = linkRect.top;

    // Check if the link is the closest based on top edge
    if (distance < closestDistance && distance > 0) {
      closestLink = link;
      closestDistance = distance;
    }
  });

  // Remove 'highlighted' class from all links
  chronolinks.forEach(link => {
    link.classList.remove('highlighted');
  });

  // Add 'highlighted' class to the closest link
  if (closestLink !== null) {
    closestLink.classList.add('highlighted');
  }
}

// Attach the event listener to the scroll event
document.getElementById('right-side').addEventListener('scroll', handleScroll);

// Initial state
handleScroll();

const frames = document.querySelectorAll('.frame');

function handleLeftScroll() {
  let scrollPos = document.getElementById('left-side').scrollTop;
  let closestFrame = null;
  let closestDistance = Infinity;

  // Iterate over each .frame
  frames.forEach(frame => {
    const frameRect = frame.getBoundingClientRect();
    const distance = frameRect.top;

    // Check if the frame is the closest based on top edge
    if (distance < closestDistance && distance >= 0) {
      closestFrame = frame;
      closestDistance = distance;
    }
  });

  // Remove 'highlighted' class from all frames
  frames.forEach(frame => {
    frame.classList.remove('highlighted');
  });

  // Add 'highlighted' class to the closest frame
  if (closestFrame !== null) {
    closestFrame.classList.add('highlighted');
  }
}

// Attach the event listener to the scroll event for #left-side
document.getElementById('left-side').addEventListener('scroll', handleLeftScroll);

// Initial state
handleLeftScroll();
