const popups = Array.from(document.querySelectorAll('.tut-box'));
for (let i = 0; i < popups.length; i++) {
  if (i > 0) {
  popups[i].style.display = 'none';
  }

// object1.style.border = 'solid';
//   let x1 = object1.getBoundingClientRect().left;
//   let y1 = object1.getBoundingClientRect().bottom;

  // popups[i]

let object1;

  popups[i].addEventListener('click', (event) => {
    if (i < (popups.length-1)) {
        if (i === 0) {
          document.getElementById("overlay2").style.background = "none";
          document.getElementById("overlay2").style.backdropFilter = "none";
          object1 = document.querySelector('.page .filter-link');
          // object1.style.border ="solid red";
        }

    let x1 = object1.getBoundingClientRect().left;
    let y1 = object1.getBoundingClientRect().top;

    popups[i+1].style.top = (y1 + 20) + 'px';
    popups[i+1].style.left = (x1 + 20) + 'px';
    popups[i+1].style.transform = 'translate(-100%, 0)';
    event.target.style.display = 'none';
    popups[i+1].style.display = 'block';

  } else {
    document.getElementById('overlay2').remove();
  }
  });
}
// popups.forEach(p => {
