import { handleP5Scroll } from './scroll.js';

// Define the setupGraph function
export function setupGraph() {
    const pages = Array.from(document.querySelectorAll('.page'));
    let totalPageHeight;

    // Initialize p5.js sketch
    const sketch = new p5((p) => {
        let dragging = false;
        let offsetY = 0;
        let mappedPos = 0;

        p.setup = function() {
            const canvas = p.createCanvas(p.windowWidth / 12, p.windowHeight);
            canvas.parent(document.getElementById('graph-column'));

            // Add an event listener for the scroll event on the text container
            document.getElementById('text-column').addEventListener('scroll', () => {
                mappedPos = p.map(document.getElementById('text-column').scrollTop, 0, document.getElementById('text-column').scrollHeight - window.innerHeight, 0, p.height - 10);
            });
        };

        p.draw = function() {
            const containerRect = document.getElementById('text-column').getBoundingClientRect();
            totalPageHeight = pages.reduce((acc, page) => acc + page.getBoundingClientRect().height, 0);

            p.background(248, 248, 248);

            // DRAW RECTANGLES AND SQUARE FOR EACH PAGE
            let totalHeight = 0;
            p.strokeWeight(0.5);

            let yPos = 0;

            for (let i = 0; i < pages.length; i++) {
                const chronoLinks = pages[i].querySelectorAll('.chrono-link');
                const chronoLinkCount = chronoLinks.length;

                p.fill(248, 248, 248);

                const pageRect = pages[i].getBoundingClientRect();
                const rectHeight = p.map(pageRect.height, 0, totalPageHeight, 0, p.height);

                p.strokeWeight(0.4);
                p.stroke(88, 88, 88);
                p.rect(0, yPos, p.width, rectHeight);

                yPos += rectHeight;
            }

            // Display page number while dragging the rectangle
            if (dragging) {
                let currentPage = parseInt(p.map(mappedPos, 0, p.height - 10, 0, pages.length)) + 1;
                p.fill(0);
                p.textSize(16);
                p.textAlign(p.CENTER, p.BOTTOM);
                p.text(`Page ${currentPage}`, p.width / 2, mappedPos - 5);
            }

            // Draw a rectangle synced to the scroll position
            p.push();
            p.fill(0);
            p.noStroke();
            p.rect(0, mappedPos, p.width, 10);
            p.pop();

            // Change cursor if the mouse is over the scroll rect
            if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= mappedPos && p.mouseY <= mappedPos + 10) {
                p.cursor(p.HAND);
            } else {
                p.cursor(p.ARROW);
            }
        };

        p.mousePressed = function() {
            // Check if the mouse is pressed and over the rectangle
            if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= mappedPos && p.mouseY <= mappedPos + 10) {
                dragging = true;
                offsetY = p.mouseY - mappedPos;
            }
        };

        p.mouseReleased = function() {
            dragging = false;
            let textColumn = document.getElementById('text-column');

            // Trigger the scrollHandler with the mock event
            handleP5Scroll(textColumn);
        };

        p.mouseDragged = function() {
            // If dragging, update the rectangle's position based on the mouseY
            if (dragging) {
                mappedPos = p.mouseY - offsetY;
                mappedPos = p.constrain(mappedPos, 0, p.height - 10);
                let scrollValue = p.map(mappedPos, 0, p.height - 10, 0, document.getElementById('text-column').scrollHeight - window.innerHeight);
                document.getElementById('text-column').scrollTop = scrollValue;
            }
        };

        p.windowResized = function() {
            p.resizeCanvas(p.windowWidth / 12, p.windowHeight);
        };
    });
}
