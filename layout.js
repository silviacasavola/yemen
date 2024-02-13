
const pages = Array.from(document.querySelectorAll('#text-container p'));

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
}
