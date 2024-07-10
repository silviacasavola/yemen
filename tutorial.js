const popup = document.getElementById('tut-box');
const overlay2 = document.getElementById("overlay2");

let object;
let i = 0;
let t, b, r, l;
let text;
let savedContent;

// export function beginningtime() {
//     const textContainer = document.getElementById('text-container');
//     const imagesColumn = document.getElementById('images-column');
//
//     function smoothScroll(element, top, duration) {
//         return new Promise(resolve => {
//             element.scrollTo({ top, behavior: 'smooth' });
//             setTimeout(resolve, duration);
//         });
//     }
//
//     async function executeScroll() {
//         await smoothScroll(textContainer, 200, 250); // Scroll down to 200px over 1000ms
//         await smoothScroll(textContainer, 0, 750);   // Scroll back to top over 1000ms
//         await smoothScroll(imagesColumn, 200, 1250);  // Scroll down to 200px over 1000ms
//         await smoothScroll(imagesColumn, 0, 1750);    // Scroll back to top over 1000ms
//     }
//
//     executeScroll();
// }



  document.getElementById('nextbtn').addEventListener('click', (event) => {

    if (i < 4) {

    if (i === 0) {
    overlay2.style.background = "none";
    overlay2.style.backdropFilter = "none";

    object = document.querySelector('#images-column .dot');
    text = "Filled circles mark a connection between<br>text and a photo series. Empty circles mark<br>photo series that were not mentioned in the text.";
    document.getElementById('arrowbtn').innerHTML = '↙'
    popup.style.transform = 'translate(0%,-110%)';
    }

    if (i === 1) {
    object = document.querySelector('.page .filter-link');
    text = "Click on the highlighted entities<br>both in the text and in the photo descriptions<br>to follow their story-line.<br>Click on the X to disable them.";
    document.getElementById('arrowbtn').innerHTML = '→';
    popup.style.transform = 'translate(-110%, -10%)';
    savedContent = object.closest('.page');
    }

        if (i < 2) {
        const rect = object.getBoundingClientRect();
          t = rect.top + window.scrollY;
          l = rect.left + window.scrollX;
          popup.style.top = `${t}px`;
          popup.style.left = `${l}px`;
        }

    if (i === 2) {
    object = document.querySelector('#images-column .disconnected');
    object.classList.toggle('fakehover')
    text = "Click on the collapsed elements<br>to make them unfold.";
    document.getElementById('arrowbtn').innerHTML = '↖';
    const rect = object.getBoundingClientRect();
    b = rect.bottom;
    document.getElementById('images-column').scrollTo({ top: t, behavior: 'smooth' });
    t = rect.top + window.scrollY;
    l = rect.left + window.scrollX;
    popup.style.bottom = `${b}px`;
    popup.style.left = `${l}px`;
    popup.style.transform = 'translate(50%,-110%)';
    savedContent = Array.from(object.querySelectorAll('div'));
    }

    if (i === 3) {
    object.classList.toggle('fakehover')
    document.getElementById('images-column').scrollTo({ top: 0, behavior: 'smooth' });
    object = document.querySelector('#images-column .disconnected');
    text = "Keep an eye on the scollbar<br>to monitor the changes.";
    document.getElementById('arrowbtn').innerHTML = '→';
    popup.style.right = '2vw';
    popup.style.left = '';
    popup.style.top = '40vh';
    popup.style.transform = 'translate(0%,0%)';
    document.getElementById('skipbtn').style.display = 'none';
    document.getElementById('nextbtn').innerHTML = 'Ready';
    savedContent = document.getElementById('graph-column');
    }


    document.getElementById('tutorial-text').innerHTML = text;
    i++;

    document.getElementById('tutorial-counter').innerHTML = (i+1) + '/5';

    let everything1 = Array.from(document.querySelectorAll('.frame-container div, #headline-section, .page, #graph-column')).filter(
        element => element !== object && element !== savedContent).forEach(element => {
              element.style.border = "";
              element.style.filter = 'blur(1px)';
            })

    object.style.filter = 'none';
    if (Array.isArray(savedContent)) {
    savedContent.forEach(element => {
      console.log("ao?")
          element.style.filter = 'none';
        })
      } else {
        savedContent.style.filter = 'none';
      }
  // });style.filter = 'none';

      // element => element !== object || !element.classList.contains('frame-container') && !element.closest('page')).forEach(element => {
      //       element.style.border = "";
      //       element.style.filter = 'blur(1px)';
    // });

  } else {

    removetutorial()
  }
  });


document.getElementById('skipbtn').addEventListener('click', removetutorial)



function removetutorial() {
          overlay2.classList.toggle('removed');
        Array.from(document.querySelectorAll('div')).forEach(element => {
              element.style.filter = 'none';
            })

          const overlaytimeout = setTimeout(() => {
        overlay2.remove();
            clearTimeout(overlaytimeout);
          }, 1400);
        }
