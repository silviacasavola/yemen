const people = ['Jean'];
const places = ['Beit Sinan', 'Sanaa'];
const keywords = ['schechita', 'khat'];

const pages = Array.from(document.getElementsByClassName('page-text'));

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

  // ADD CLICK EVENT LISTENERS TO THE LINK
  const spans = document.querySelectorAll('.filter-link');

  spans.forEach(span => {
    span.addEventListener('click', () => {
      console.log("oh")
      const clickedInnerHTML = span.innerHTML;

      spans.forEach(otherSpan => {
        const parentpage = otherSpan.parentElement.parentElement;

        if (parentpage) {
          if (otherSpan.innerHTML === clickedInnerHTML) {
            parentpage.classList.toggle('hidden', false);
          } else {
            parentpage.classList.toggle('hidden', true);
          }
        }
      });
    resetclick()
    });
  });

  const hiddenPages = document.getElementsByClassName('page hidden');

  function resetclick() {
  Array.from(hiddenPages).forEach(hiddenPage => {
    // Add click event listener to each hidden page
    hiddenPage.addEventListener('click', () => {
      hiddenPage.classList.toggle('hidden', false);
      hiddenPage.classList.toggle('shown', true);
    });
  });
}
}
