// MAP WITH CIRCLES AND SQUARES

let dragging = false;
let offsetY = 0;
let mappedPos = 0;
let shapes = [];

function setup() {
  const container = document.getElementById('graph-container');
  const canvas = createCanvas(container.offsetWidth / 2, windowHeight);
  canvas.parent('graph-container');

  // QUERY LINK ELEMENTS
  const chronoLinks = document.querySelectorAll('#text-container .chrono-link');
  const personLinks = document.querySelectorAll('#text-container .person-link');

  // MAP CHRONO LINKS POSITION RELATIVELY TO THE TEXT CONTAINER
  chronoLinks.forEach(chronoLink => {
    mapAndAddShape(chronoLink, 'chrono');
  });

  // MAP CHRONO FILTER LINKS POSITION RELATIVELY TO THE TEXT CONTAINER
  personLinks.forEach(personLink => {
    mapAndAddShape(personLink, 'person');
  })

  // Add event listener for scrolling on the right-side container
  // document.getElementById('right-side').addEventListener('scroll', () => {
  //   let scrollPos = document.getElementById('right-side').scrollTop;
  //   mappedPos = map(scrollPos, 0, document.getElementById('right-side').scrollHeight - window.innerHeight, 0, height - 10);
  // });
}

function draw() {
  background(217);

  // Assign circle shape to chrono and square shape filter
  for (const shape of shapes) {
    fill(shape.fillColor);
    noStroke();
    if (shape.type === 'chrono') {
      ellipse(shape.x, shape.y, shape.size, shape.size);
    } else if (shape.type === 'person') {
      rect(shape.x - shape.size / 2, shape.y - shape.size / 2, shape.size, shape.size);
    }
  }

  // DRAW RECTANGLE SYNCHED TO SCROLL POSITION
  fill(0);
  rect(0, mappedPos, width, 10);

  // Change cursor if mouse is over the scroll rect
  if (mouseX >= 0 && mouseX <= width && mouseY >= mappedPos && mouseY <= mappedPos + 10) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }
}

// function mousePressed() {
//   // Check if the mouse is pressed and over the rectangle
//   if (mouseX >= 0 && mouseX <= width && mouseY >= mappedPos && mouseY <= mappedPos + 10) {
//     dragging = true;
//     offsetY = mouseY - mappedPos;
//   }
// }
//
// function mouseReleased() {
//   dragging = false;
// }
//
// function mouseDragged() {
//   // If dragging, update the rectangle's position based on mousY
//   if (dragging) {
//     mappedPos = mouseY - offsetY;
//     mappedPos = constrain(mappedPos, 0, height - 10);
//     let scrollValue = map(mappedPos, 0, height - 10, 0, document.getElementById('right-side').scrollHeight - window.innerHeight);
//     document.getElementById('right-side').scrollTop = scrollValue;
//   }
// }

function mapAndAddShape(link, type) {
  const rect = link.getBoundingClientRect();
  const containerRect = document.getElementById('text-container').getBoundingClientRect();
  const mappedX = map(rect.left - containerRect.left, 0, containerRect.width, 0, width);
  const mappedY = map(rect.top - containerRect.top, 0, containerRect.height, 0, height);
  const size = type === 'chrono' ? 6 : 6; // Adjust size for different types
  const fillColor = type === 'chrono' ? [0] : [0, 0, 255]; // Adjust color for different types

  shapes.push({ x: mappedX, y: mappedY, type, size, fillColor });
}
