let pages;
let thingshappened;

function toggleHidden() {
  const hiddenContainers = document.querySelectorAll('.hidden');
  hiddenContainers.forEach(hidden => {
    hidden.addEventListener('click', () => {
      hidden.classList.remove('hidden');
    });
  });
}

function replacePeopleInElement(element, jsonData) {
  if (!element) return;

  const people = jsonData.people;
  if (people && Array.isArray(people)) {
    people.forEach((person, index) => {
      const personVariants = person.split('; ').map(person => person.trim());
      const personId = `person${index}`;

      personVariants.sort((a, b) => b.length - a.length);

      personVariants.forEach(personVariant => {
        const regex = new RegExp(`\\b${personVariant}\\b`, 'gi');
        const newElement = document.createElement('div');
        newElement.innerHTML = element.innerHTML.replace(regex, match => {
          return `<span class="filter-link person-link" id='${personId}'>${match}<span class="closebtn">X</span></span>`;
        });
        element.innerHTML = newElement.innerHTML;
      });
    });
  }
}

function replacePlacesInElement(element, jsonData) {
  if (!element) return;

  const places = jsonData.places;
  if (places && Array.isArray(places)) {
    places.forEach((place, index) => {
      const placeVariants = place.split('; ').map(place => place.trim());
      const placeId = `place${index}`;

      placeVariants.forEach(placeVariant => {
        const regex = new RegExp(`\\b${placeVariant}\\b`, 'gi');
        const newElement = document.createElement('div');
        newElement.innerHTML = element.innerHTML.replace(regex, match => {
          return `<span class="filter-link place-link" id='${placeId}'>${match}<span class="closebtn">X</span></span>`;
        });
        element.innerHTML = newElement.innerHTML;
      });
    });
  }
}

function replaceKeywordsInElement(element, jsonData) {
  if (!element) return;

  const keywords = jsonData.keywords;
  if (keywords && Array.isArray(keywords)) {
    keywords.forEach((keyword, index) => {
      const keywordVariants = keyword.split('; ').map(keyword => keyword.trim());
      const keywordId = `keyword${index}`;

      keywordVariants.forEach(keywordVariant => {
        const regex = new RegExp(`\\b${keywordVariant}\\b`, 'gi');
        const newElement = document.createElement('div');
        newElement.innerHTML = element.innerHTML.replace(regex, match => {
          return `<span class="filter-link keyword-link" id='${keywordId}'>${match}<span class="closebtn">X</span></span>`;
        });
        element.innerHTML = newElement.innerHTML;
      });
    });
  }
}

function textReplacement() {
  pages = Array.from(document.querySelectorAll('.page'));
  fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
      jsonData = data;

      pages.forEach(page => {
        replacePeopleInElement(page, jsonData);
        replacePlacesInElement(page, jsonData);
        replaceKeywordsInElement(page, jsonData);
      });

      const nestedLinks = document.querySelectorAll('.filter-link .filter-link');
      nestedLinks.forEach(span => {
        span.parentNode.replaceChild(span.firstChild, span);
      });

      addEvent(jsonData);
    });
}

function frameReplacement() {
  fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
      jsonData = data;

      const metadatacells = document.querySelectorAll('.metadata-layout');
      const titlecells = document.querySelectorAll('.frame .title');

      metadatacells.forEach(element => {
        replacePeopleInElement(element, jsonData);
        replacePlacesInElement(element, jsonData);
        replaceKeywordsInElement(element, jsonData);
      });

      const nestedLinks = document.querySelectorAll('.filter-link .filter-link');
      nestedLinks.forEach(span => {
        span.parentNode.replaceChild(span.firstChild, span);
      });

      addEvent(jsonData);
    })
    .catch(error => console.error('Error fetching or parsing JSON:', error));
}

let filterSelected = false;

function addEvent(jsonData) {
  const selectionIndicator = document.getElementById("selection-indicator");
  const nameIndicator = document.getElementById("name-selection");
  const filterLinks = document.querySelectorAll('.filter-link');

  filterLinks.forEach(flink => {
    flink.addEventListener('click', () => {
      filterSelected = true;
      const selectorId = flink.id;
      selectionIndicator.dataset.selector = selectorId;
      let officialIdentificator;

      if (flink.classList.contains('person-link')) {
        const personIndex = parseInt(flink.id.replace('person', ''), 10);
        if (!isNaN(personIndex) && jsonData.people && jsonData.people[personIndex]) {
          const selectedPerson = jsonData.people[personIndex];
          officialIdentificator = selectedPerson.split('; ').map(person => person.trim())[0];
        }
      }

      if (flink.classList.contains('place-link')) {
        const placeIndex = parseInt(flink.id.replace('place', ''), 10);
        if (!isNaN(placeIndex) && jsonData.places && jsonData.places[placeIndex]) {
          const selectedPlace = jsonData.places[placeIndex];
          officialIdentificator = selectedPlace.split('; ').map(place => place.trim())[0];
        }
      }

      if (flink.classList.contains('keyword-link')) {
        const keywordIndex = parseInt(flink.id.replace('keyword', ''), 10);
        if (!isNaN(keywordIndex) && jsonData.keywords && jsonData.keywords[keywordIndex]) {
          const selectedKeyword = jsonData.keywords[keywordIndex];
          officialIdentificator = selectedKeyword.split('; ').map(keyword => keyword.trim())[0];
        }
      }

      selectionIndicator.style.display = "flex";
      nameIndicator.innerHTML = "X " + officialIdentificator;

      flink.classList.add('animated');
      const animationtimeout = setTimeout(() => {
        flink.classList.remove('animated');
        clearTimeout(animationtimeout);
      }, 4000);

      handleClick(jsonData, flink);
    });
  });

  document.querySelectorAll('.closebtn').forEach(x => {
    x.addEventListener('click', (event) => {
      removeeverything();
      event.stopPropagation(); // Prevent the event from triggering the parent's click event
    });
  });

  selectionIndicator.addEventListener('click', (event) => {
    removeeverything();
  });

  function removeeverything() {
    selectionIndicator.style.display = "none";
    selectionIndicator.removeAttribute('data-selector');
    filterSelected = false;
    handleClick(jsonData);
  }

  function handleClick(jsonData, flink) {
    const activeId = selectionIndicator.dataset.selector;

    filterLinks.forEach(otherFlink => {
      if (otherFlink.id === activeId) {
        otherFlink.classList.add('selected');
      } else {
        otherFlink.classList.remove('selected');
      }
    });

    const scPhotos = document.getElementById("selection-counter-photo");
    const scText = document.getElementById("selection-counter-text");
    let wordsSelected = Array.from(document.querySelectorAll('.page .selected'));
    let seriesofimages = Array.from(document.querySelectorAll('.frame-container')).filter(f => f.querySelector('.selected'));
    let imgsSelected = Array.from(document.querySelectorAll('.frame .selected'));
    scPhotos.innerHTML = imgsSelected.length + " photos in " + seriesofimages.length + " series depict";
    scText.innerHTML = " is mentioned " + wordsSelected.length + " times";

    const selectedLinksContainers = new Set();
    filterLinks.forEach(link => {
      if (link.classList.contains('selected')) {
        const parentFrame = link.closest('.frame-container');
        const parentPage = link.closest('.page');

        if (parentFrame) {
          selectedLinksContainers.add(parentFrame);
        } else if (parentPage) {
          selectedLinksContainers.add(parentPage);
        }
      }
    });

    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
      if (activeId === undefined) {
        page.classList.remove('hidden');
      } else {
        page.classList.toggle('hidden', !selectedLinksContainers.has(page));
      }
    });

    const frames = document.querySelectorAll('.frame-container');
    frames.forEach(frame => {
      if (activeId === undefined && !frame.classList.contains('disconnected')) {
        frame.classList.remove('hidden');
      } else {
        frame.classList.toggle('hidden', !selectedLinksContainers.has(frame));
      }
    });

    toggleHidden();
    thenScroll(flink);
  }
}

function thenScroll(flink) {
  let columnToScroll;
  if (filterSelected === true) {
    let clickContainer = flink.closest('#images-column') || flink.closest('#text-column');
    const click = flink.closest('.frame-container') || flink.closest('.page');

    let initialDistanceFromTop = flink.getBoundingClientRect().top;

    if (clickContainer.id === 'text-column') {
      columnToScroll = document.getElementById('images-column');
    } else if (clickContainer.id === 'images-column') {
      columnToScroll = document.getElementById('text-column');
    }

    let counterpart = columnToScroll.querySelector('.dot.active');
    let counterRect;
    if (counterpart) {
      counterRect = counterpart.closest('.frame-container') || counterpart.closest('.page');
    }

    setTimeout(() => {
      const newFlinkRect = flink.getBoundingClientRect();
      const newScrollPosition = clickContainer.scrollTop + (newFlinkRect.top - initialDistanceFromTop);

      clickContainer.scrollTo({
        top: newScrollPosition,
        behavior: 'smooth'
      });

      if (counterRect) {
        let counterRectPos = counterRect.getBoundingClientRect();
        columnToScroll.scrollTo({
          top: columnToScroll.scrollTop + counterRectPos.top - 70,
          behavior: 'smooth'
        });
      }
    }, 1000);
  } else {
    const textColumn = document.getElementById('text-column');
    const imagesColumn = document.getElementById('images-column');

    const getClosestElement = (container, selector) => {
      const elements = Array.from(container.querySelectorAll(selector));
      const viewportTop = container.getBoundingClientRect().top;
      if (elements.length === 0) {
        return null; // Return null if there are no elements to avoid error
      }
      return elements.reduce((closest, el) => {
        const elTop = el.getBoundingClientRect().top;
        const distance = Math.abs(elTop - viewportTop);
        if (closest === null || distance < closest.distance) {
          return { element: el, distance };
        }
        return closest;
      }, { element: null, distance: Infinity }).element;
    };

    const closestPage = getClosestElement(textColumn, '.page');
    const closestDot = getClosestElement(imagesColumn, '.image-container.connected');

    setTimeout(() => {
      if (closestPage) {
        const pageTop = closestPage.getBoundingClientRect().top + textColumn.scrollTop - 70;
        textColumn.scrollTo({
          top: pageTop,
          behavior: 'smooth'
        });
      }

      if (closestDot) {
        const dotTop = closestDot.getBoundingClientRect().top + imagesColumn.scrollTop - 70;
        imagesColumn.scrollTo({
          top: dotTop,
          behavior: 'smooth'
        });
      }
    }, 1000);
  }
}
