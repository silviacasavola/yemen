// GRAPH WITH THE HEATMAP

let dragging = false;
let offsetY = 0;
let mappedPos = 0;

function setup() {
  const container = document.getElementById('graph-container');
  const canvas = createCanvas(container.offsetWidth / 2, container.offsetHeight);
  canvas.parent('graph-container');

  const pageElements = document.querySelectorAll('.page');
  pageElements.forEach(pageElement => {
  pages.push(pageElement);
  });
}

function draw() {
  background(220);

  // DRAW RECTANGLES AND SQUARE FOR EACH PAGE
  for (let i = 0; i < pages.length; i++) {
    // Get the number of chrono links and filter links elements in the current page
    const chronoLinks = pages[i].querySelectorAll('.chrono-link');
    const placeLinks = pages[i].querySelectorAll('.place-link');
    const chronoLinkCount = chronoLinks.length;
    const placeLinkCount = placeLinks.length;

    // Map chronoLinkCount to a color value
    const chronoColorValue = map(chronoLinkCount, 0, 4, 217, 0);
    const constrainedChronoColor = constrain(chronoColorValue, 0, 255);

    // Draw a colored rectangle for each page
    const rectWidth = width;
    const rectHeight = height / pages.length;
    const y = i * rectHeight;

    // Draw rectangle
    noStroke();
    fill(constrainedChronoColor);
    rect(0, y, rectWidth, rectHeight);

    // Draw square on top for pages with filter link
    if (placeLinkCount > 0) {
      fill('#0066FF');
      const squareSize = rectHeight;
      const squareX = width / 2 - squareSize / 2;
      rect(squareX, y, squareSize, squareSize);
    }
  }

// Draw a rectangle synced to the scroll position
let scrollPos = document.getElementById('right-side').scrollTop;
mappedPos = map(scrollPos, 0, document.getElementById('right-side').scrollHeight - window.innerHeight, 0, height - 10);
fill(0, 0, 255);
rect(0, mappedPos, width, 10);

// Display page number while dragging the rectangle
if (dragging) {
  let currentPage = int(map(mappedPos, 0, height - 10, 0, pages.length));
  fill(0);
  textSize(16);
  textAlign(CENTER, BOTTOM);
  text(`Page ${currentPage}`, width / 2, mappedPos - 5);
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
  }
}
