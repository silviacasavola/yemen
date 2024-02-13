let dragging = false;
let offsetY = 0;
let mappedPos = 0;

// const pages = document.querySelectorAll('.page');

function setup() {
  const container = document.getElementById('graph-container');
  const canvas = createCanvas(container.offsetWidth / 2, container.offsetHeight);
  canvas.parent('graph-container');

  // Add an event listener for the scroll event on the text container
  document.getElementById('right-side').addEventListener('scroll', () => {
    // Update mappedPos based on the scroll position
    mappedPos = map(document.getElementById('right-side').scrollTop, 0, document.getElementById('right-side').scrollHeight - window.innerHeight, 0, height - 10);
  });
}

function draw() {
  background(220);

  // DRAW RECTANGLES AND SQUARE FOR EACH PAGE
  let totalHeight = 0;

  for (let i = 0; i < pages.length; i++) {
    // Get the number of chrono links and filter links elements in the current page
    const chronoLinks = pages[i].querySelectorAll('.chrono-link');
    const chronoLinkCount = chronoLinks.length;

    // Map chronoLinkCount to a color value
    let chronoColorValue = map(chronoLinkCount, 0, 4, 217, 0);
    const constrainedChronoColor = constrain(chronoColorValue, 0, 255);

    // console.log(pages)

    // Check if the current page contains an element with the class "highlighted"
    // const highlightedElement = pages[i].querySelector('.highlighted');
    // if (highlightedElement) {
      // Set a specific color for the highlighted page
      // chronoColorValue = color('#FF5C00').levels;
    // }

    fill(chronoColorValue);
    const rectWidth = width;

    const containerRect = document.getElementById('text-container').getBoundingClientRect();
    const pageRect = pages[i].getBoundingClientRect();
    const rectHeight = map(pageRect.height, 0, containerRect.height, 0, height);

    const y = totalHeight;
    strokeWeight(0.5)
    rect(0, y, rectWidth, rectHeight);

    totalHeight += rectHeight;

 // console.log("containerRect height = " + containerRect.height + ", pageRect height = " + pageRect.height + ", rectHeight = " + rectHeight)
  }


    // Display page number while dragging the rectangle
    if (dragging) {
      let currentPage = int(map(mappedPos, 0, height - 10, 0, pages.length)) + 1;
      fill(0);
      textSize(16);
      textAlign(CENTER, BOTTOM);
      text(`Page ${currentPage}`, width / 2, mappedPos - 5);
    }

  // Draw a rectangle synced to the scroll position
  push();
  fill(0, 0, 255);
  noStroke();
  rect(0, mappedPos, width, 10);
  pop();

  // Change cursor if the mouse is over the scroll rect
  if (mouseX >= 0 && mouseX <= width && mouseY >= mappedPos && mouseY <= mappedPos + 10) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

function mousePressed() {
  // Check if the mouse is pressed and over the rectangle
  if (mouseX >= 0 && mouseX <= width && mouseY >= mappedPos && mouseY <= mappedPos + 10) {
    dragging = true;
    offsetY = mouseY - mappedPos;
  }
}

function mouseReleased() {
  dragging = false;
}

function mouseDragged() {
  // If dragging, update the rectangle's position based on the mouseY
  if (dragging) {
    mappedPos = mouseY - offsetY;
    mappedPos = constrain(mappedPos, 0, height - 10);
    let scrollValue = map(mappedPos, 0, height - 10, 0, document.getElementById('right-side').scrollHeight - window.innerHeight);
    document.getElementById('right-side').scrollTop = scrollValue;

    handleScroll('right-side', '.chrono-link')
  }
}
