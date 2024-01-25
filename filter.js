const people = ['Jean', 'Myriam'];
const places = ['Beit Sinan', 'Sanaa'];
const keywords = ['shechita', 'qat'];
const pages = Array.from(document.querySelectorAll('#text-container p'))

for (const [index, page] of pages.entries()) {
  const pageContainer = document.createElement('div');
  pageContainer.className = 'page';
  document.getElementById('text-container').appendChild(pageContainer);
  pageContainer.appendChild(page);

  // ADD ID
  const pageId = "page-" + (index + 1);
  pageContainer.id = pageId;

  // ADD PAGE INDEX
  const newDiv = document.createElement('div');
  newDiv.className = 'page-number';
  newDiv.innerHTML = 'pg. ' + (index + 1);
  pageContainer.insertBefore(newDiv, pageContainer.firstChild);

  // ADD FILTER
  let pageContent = page.innerHTML;

  people.forEach(person => {
    const regex = new RegExp(`\\b${person}\\b`, 'gi');
    pageContent = pageContent.replace(regex, `<span class="filter-link person-link">${person}</span>`);
  });

  places.forEach(place => {
    const regex = new RegExp(`\\b${place}\\b`, 'gi');
    pageContent = pageContent.replace(regex, `<span class="filter-link place-link">${place}</span>`);
  });

  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    pageContent = pageContent.replace(regex, `<span class="filter-link keyword-link">${keyword}</span>`);
  });

  page.innerHTML = pageContent;
}

// ADD CLICK EVENT LISTENERS TO THE LINK
const filterLinks = document.querySelectorAll('.filter-link');
const selectionIndicatorsContainer = document.getElementById("selection-indicators-container");

filterLinks.forEach(flink => {
  flink.addEventListener('click', () => {
    const clickedInnerHTML = flink.innerHTML;

    // Toggle class for the clicked link
    flink.classList.toggle('selected');

    // Create a new div for the selection indicator
    const selectionIndicator = document.createElement('div');
    selectionIndicator.className = 'selection-indicator';
    selectionIndicator.innerHTML = clickedInnerHTML + ' X';

    // Append the selection indicator to the specified container
    selectionIndicatorsContainer.appendChild(selectionIndicator);

    // Iterate over all filter links to decide visibility
    filterLinks.forEach(otherFlink => {
      const parentPage = otherFlink.closest('.page');

      if (parentPage) {
        if (otherFlink.innerHTML === clickedInnerHTML) {
          otherFlink.classList.add('selected', flink.classList.contains('selected'));
        } else {
          otherFlink.classList.remove('selected');
        }
      }
    });

    // Determine visibility of pages based on selected filter links
    const pagesWithSelectedLinks = new Set();
    filterLinks.forEach(link => {
      if (link.classList.contains('selected')) {
        const parentPage = link.closest('.page');
        if (parentPage) {
          pagesWithSelectedLinks.add(parentPage);
        }
      }
    });

    pages.forEach(page => {
      const pageContainer = page.closest('.page');
      if (pageContainer) {
        pageContainer.classList.toggle('hidden', !pagesWithSelectedLinks.has(pageContainer));
      }
    });

    resetclick();
  });
});

function resetclick() {
  const hiddenPages = document.querySelectorAll('.page.hidden');

  hiddenPages.forEach(hiddenPage => {
    hiddenPage.addEventListener('click', () => {
      hiddenPage.classList.remove('hidden');
      hiddenPage.classList.add('shown');
    });
  });
}

// function resetclick() {
//   const hiddenThings = document.querySelectorAll('.hidden');
//
//   hiddenThings.forEach(hiddenThing => {
//     hiddenThing.addEventListener('click', () => {
//       hiddenThing.classList.remove('hidden');
//       hiddenThing.classList.add('shown');
//     });
//   });
// }

function highlightFilter(checkbox) {
  let classname = checkbox.value + "-link";
  let elements = document.getElementsByClassName(classname);

  if (checkbox.checked) {
    // If the checkbox is checked, add the 'selectable' class to the elements
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.add('selectable');
    }
  } else {
    // If the checkbox is not checked, remove the 'selectable' class from the elements
    for (let i = 0; i < elements.length; i++) {
      elements[i].classList.remove('selectable');
    }
  }
}

// Event delegation for removing selection indicators
selectionIndicatorsContainer.addEventListener('click', (event) => {
  const selectionIndicator = event.target.closest('.selection-indicator');

  if (selectionIndicator) {
    // Remove the class 'hidden' from all elements with the class 'page'
    pages.forEach(page => {
      page.classList.remove('hidden');
    });

    // Remove the class 'selected' from all elements with the class 'filter-link'
    const allFilterLinks = document.querySelectorAll('.filter-link');
    allFilterLinks.forEach(link => {
      link.classList.remove('selected');
    });

    // Remove the selection-indicator itself
    selectionIndicator.remove();
  }
});
