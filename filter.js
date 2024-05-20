let pages;
let thingshappened;

function toggleHidden() {
  hiddenContainers = document.querySelectorAll('.hidden');

  hiddenContainers.forEach(hidden => {
    hidden.addEventListener('click', () => {
      hidden.classList.remove('hidden');
    });
  });
}

// Function to generate combinations of names, surnames, and extras
function generateNameCombinations(names, surnames, extras) {
    const shortNameCombinations = [];
    const longNameCombinations = [];

    names.forEach(name => {
        surnames.forEach(surname => {
            shortNameCombinations.push(`${surname}`);
            longNameCombinations.push(`${name} ${surname}`);
            longNameCombinations.push(`${surname} ${name}`);
            longNameCombinations.push(`${surname}, ${name}`);

            if (extras) {
                extras.forEach(extra => {
                    shortNameCombinations.push(`${extra}`);
                    longNameCombinations.push(`${extra} ${name}`);
                    longNameCombinations.push(`${extra} ${surname}`);
                    longNameCombinations.push(`${extra} ${name} ${surname}`);
                });
            }
        });
    });

    names.forEach(name => {
        shortNameCombinations.push(`${name}`);
    });

    // Return both short and long combinations
    return { shortNameCombinations, longNameCombinations };
}

// Function to replace people entities in an HTML element
function replacePeopleInElement(element, jsonData) {
    if (!element) return;

    const people = jsonData.people;
    if (people && Array.isArray(people)) {
        people.forEach((person, index) => {
            if (person && person.firstName && person.lastName) {
                const nameVariants = person.firstName.split('; ').map(name => name.trim());
                const surnameVariants = person.lastName.split('; ').map(surname => surname.trim());
                const extraVariants = person.extra ? person.extra.split('; ').map(extra => extra.trim()) : null;
                const personId = `person${index}`;

                // Generate both short and long combinations
                const { shortNameCombinations, longNameCombinations } = generateNameCombinations(nameVariants, surnameVariants, extraVariants);

                // Sort long combinations by length in descending order
                longNameCombinations.sort((a, b) => b.length - a.length);

                // Replace each combination in the element
                longNameCombinations.forEach(combination => {
                    const regex = new RegExp(`\\b${combination}\\b`, 'gi');
                    // Create a new element to hold the modified content
                    const newElement = document.createElement('div');
                    newElement.innerHTML = element.innerHTML.replace(regex, match => {
                        return `<span class="filter-link person-link" id='${personId}'>${match}</span>`;
                    });
                    // Replace the existing content with the modified element
                    element.innerHTML = newElement.innerHTML;
                });

                // Replace short combinations
                shortNameCombinations.forEach(combination => {
                    const regex = new RegExp(`\\b${combination}\\b`, 'gi');
                    // Create a new element to hold the modified content
                    const newElement = document.createElement('div');
                    newElement.innerHTML = element.innerHTML.replace(regex, match => {
                        return `<span class="filter-link person-link" id='${personId}'>${match}</span>`;
                    });
                    // Replace the existing content with the modified element
                    if (!element.querySelector('.filter-link')) {
                    element.innerHTML = newElement.innerHTML;
                  }
                });
          }
        });
    }
}


// Function to replace place entities in an HTML element
function replacePlacesInElement(element, jsonData) {
    if (!element) return;

    const places = jsonData.places;
    if (places && Array.isArray(places)) {
        places.forEach((place, index) => {
            const placeVariants = place.split('; ').map(place => place.trim());
            const placeId = `place${index}`;

            placeVariants.forEach(placeVariant => {
                const regex = new RegExp(`\\b${placeVariant}\\b`, 'gi');

                // Create a new element to hold the modified content
                const newElement = document.createElement('div');
                newElement.innerHTML = element.innerHTML.replace(regex, match => {
                    return `<span class="filter-link place-link" id='${placeId}'>${match}</span>`;
                });

                // Replace the existing content with the modified element
                element.innerHTML = newElement.innerHTML;
            });
        });
    }
}

// Function to replace keyword entities in an HTML element
function replaceKeywordsInElement(element, jsonData) {
    if (!element) return;

    const keywords = jsonData.keywords;
    if (keywords && Array.isArray(keywords)) {
        keywords.forEach((keyword, index) => {
            const keywordVariants = keyword.split('; ').map(keyword => keyword.trim());
            const keywordId = `keyword${index}`;

            keywordVariants.forEach(keywordVariant => {
                const regex = new RegExp(`\\b${keywordVariant}\\b`, 'gi');

                // Create a new element to hold the modified content
                const newElement = document.createElement('div');
                newElement.innerHTML = element.innerHTML.replace(regex, match => {
                    return `<span class="filter-link keyword-link" id='${keywordId}'>${match}</span>`;
                });

                // Replace the existing content with the modified element
                element.innerHTML = newElement.innerHTML;
            });
        });
    }
}

// Fetch JSON data and replace people entities in elements
let jsonData; // Define jsonData in the outer scope

function textReplacement() {
  pages = Array.from(document.querySelectorAll('.page'));
  // console.log(pages)
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        jsonData = data; // Assign fetched JSON data to jsonData

        // Replace people entities in .page elements
        pages.forEach(page => {
            replacePeopleInElement(page, jsonData);
            replacePlacesInElement(page, jsonData);
            replaceKeywordsInElement(page, jsonData);
        });

        const nestedLinks = document.querySelectorAll('.filter-link .filter-link');
            nestedLinks.forEach(span => {
              span.parentNode.replaceChild(span.firstChild, span);
            });
        // Add event listeners after replacing elements
        addEvent(jsonData);
    })
    // .catch(error => console.error('Error fetching or parsing JSON:', error));
}

function frameReplacement() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            // Replace people entities in .people-col elements
            const metadatacells = document.querySelectorAll('.metadata-layout')

            metadatacells.forEach(element => {
                replacePeopleInElement(element, jsonData);
                replacePlacesInElement(element, jsonData);
                replaceKeywordsInElement(element, jsonData);
            });

            const nestedLinks = document.querySelectorAll('.filter-link .filter-link');
                nestedLinks.forEach(span => {
                  span.parentNode.replaceChild(span.firstChild, span);
                });
            // Add event listeners after replacing elements
            addEvent(jsonData);
            attachArrowEventListeners()
        })
        // .catch(error => console.error('Error fetching or parsing JSON:', error));

        // function findarrows() {
        // }
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
              const officialName = selectedPerson.firstName.split('; ').map(name => name.trim())[0]
              const officialSurname = selectedPerson.lastName.split('; ').map(surname => surname.trim())[0]
              officialIdentificator = officialName + " " + officialSurname;
            }
          }

          if (flink.classList.contains('place-link')) {
              const placeIndex = parseInt(flink.id.replace('place', ''), 10);
              if (!isNaN(placeIndex) && jsonData.places && jsonData.places[placeIndex]) {
              const selectedPlace = jsonData.places[placeIndex]
              officialIdentificator = selectedPlace.split('; ').map(place => place.trim())[0]
            }
          }

          if (flink.classList.contains('keyword-link')) {
              const keywordIndex = parseInt(flink.id.replace('keyword', ''), 10);
              if (!isNaN(keywordIndex) && jsonData.keywords && jsonData.keywords[keywordIndex]) {
              const selectedKeyword = jsonData.keywords[keywordIndex]
              officialIdentificator = selectedKeyword.split('; ').map(keyword => keyword.trim())[0]
            }
          }

          selectionIndicator.style.display = "flex";
          nameIndicator.innerHTML = "X " + officialIdentificator;

          handleClick(jsonData, flink);
        });
      });

      function handleClick(jsonData, flink) {
          const activeId = selectionIndicator.dataset.selector;

          filterLinks.forEach(otherFlink => {
              if (otherFlink.id === activeId) {
                otherFlink.classList.add('selected');
          } else {
            otherFlink.classList.remove('selected');
          }
        })


        const scPhotos = document.getElementById("selection-counter-photo");
        const scText = document.getElementById("selection-counter-text");
        let wordsSelected = Array.from(document.querySelectorAll('.page .selected'));
        let imgsSelected = Array.from(document.querySelectorAll('.frame .selected'));
        scPhotos.innerHTML = imgsSelected.length + " photos";
        scText.innerHTML = wordsSelected.length + " text mentions";

          // Determine visibility of pages based on selected filter links
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

          // Update page visibility based on selected filter links
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
                      frame.classList.remove('hidden')
                  } else {
                      frame.classList.toggle('hidden', !selectedLinksContainers.has(frame));
                  }
          });

          toggleHidden();

          const timeout = setTimeout(() => {
            thenScroll(flink);
            clearTimeout(timeout);
          }, 1200);
        }

      // Event delegation for removing selection indicators
      selectionIndicator.addEventListener('click', (event) => {
        selectionIndicator.style.display = "none";
        selectionIndicator.removeAttribute('data-selector');
        filterSelected = false;
          handleClick(jsonData);
      });


    }

    function thenScroll(flink) {

      let targetContainer;
      let scrollPosition;

      if (filterSelected === true) {
        targetContainer = flink.closest('#images-column') || flink.closest('#text-column');
        const target = flink.closest('.frame-container') || flink.closest('.page');
        // target.style.border = "solid red";

        const targetRect = target.getBoundingClientRect();
        const targetTop = targetRect.top;

        // scrollPosition = targetTop + targetContainer.scrollTop;

        let columnToScroll; let filtered;
         if (targetContainer.id === 'text-column') {
                        columnToScroll = document.getElementById('images-column');
                        filtered = Array.from(columnToScroll.querySelectorAll('.frame-container')).filter((f) => !f.classList.contains('hidden'));
                        scrollPosition = targetTop + targetContainer.scrollTop;
                        // filtered[0].classList.add('showninfo');
         } else if (targetContainer.id === 'images-column') {
                        columnToScroll = document.getElementById('text-column');
                        filtered = Array.from(columnToScroll.querySelectorAll('.page')).filter((f) => !f.classList.contains('hidden'));
                        scrollPosition = targetTop;
         }

         if (filtered && filtered.length > 0) {
           // filtered[0].style.border = "solid green";
             let filteredRect = filtered[0].getBoundingClientRect();
             columnToScroll.scrollTo({
                 top: filteredRect.top,
                 behavior: 'smooth'
               })
             }

       targetContainer.scrollTo({
       top: scrollPosition,
       behavior: 'smooth'
      });
    } else {
      let dotactive = document.querySelectorAll('.dot.active');
      console.log(dotactive)
      dotactive.forEach((da) => {
        targetContainer = da.closest('#images-column') || da.closest('#text-container');
        const target = da.closest('.frame-container') || da.closest('.page');
                const targetRect = target.getBoundingClientRect();
                const targetTop = targetRect.top;

          // target.style.border = "solid green";
          // scrollPosition = targetTop+targetContainer.scrollTop;
          scrollPosition = targetTop-64;

          console.log(scrollPosition)

          targetContainer.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
          });
         })
    }
}

    // function highlightFilter(checkbox) {
    //   let classname = checkbox.value + "-link";
    //   let elements = document.getElementsByClassName(classname);
    //
    //   if (checkbox.checked) {
    //     // If the checkbox is checked, add the 'selectable' class to the elements
    //     for (let i = 0; i < elements.length; i++) {
    //       elements[i].classList.add('selectable');
    //     }
    //   } else {
    //     // If the checkbox is not checked, remove the 'selectable' class from the elements
    //     for (let i = 0; i < elements.length; i++) {
    //       elements[i].classList.remove('selectable');
    //     }
    //   }
    // }

    // function attachArrowEventListeners() {
    //   let scrollHandles = document.querySelectorAll('.scroll-handles');
    //
    //   // if (scrollHandles.length < 537) {
    //   //     attachArrowEventListeners()
    //   //   } else {
    //   scrollHandles.forEach(sh => {
    //     const outerFrame = sh.closest('.outer-frame');
    //     const arrowR = sh.querySelector('.arrowright')
    //     const arrowL = sh.querySelector('.arrowleft')
    //
    //     arrowR.addEventListener("click", function(event) {
    //       const framewidth = outerFrame.getBoundingClientRect().width + 5;
    //       const currentScrollX = outerFrame.scrollLeft;
    //       const scrollxpos = currentScrollX + framewidth;
    //       outerFrame.scrollTo({ left: scrollxpos, behavior: 'smooth' });
    //     });
    //
    //     arrowL.addEventListener("click", function(event) {
    //       const framewidth = outerFrame.getBoundingClientRect().width + 5;
    //       const currentScrollX = outerFrame.scrollLeft;
    //       const scrollxpos = currentScrollX - framewidth;
    //       outerFrame.scrollTo({ left: scrollxpos, behavior: 'smooth' });
    //     });
    //   })
    //  }

    function attachArrowEventListeners() {
      let scrollHandles = document.querySelectorAll('.scroll-handles');

      // if (scrollHandles.length < 537) {
      //     attachArrowEventListeners()
      //   } else {
      scrollHandles.forEach(sh => {
        const outerFrame = sh.closest('.outer-frame');

        const arrows = sh.querySelectorAll('.arrow')
        arrows.forEach(arrow => {
          arrow.addEventListener("click", function(event) {
            const framewidth = outerFrame.getBoundingClientRect().width + 5;
            const currentScrollX = outerFrame.scrollLeft;
            let scrollpos = 0;

            if (arrow.classList.contains('arrowright')) {
          scrollxpos = currentScrollX + framewidth;
          } else if (arrow.classList.contains('arrowleft')) {
          scrollxpos = currentScrollX - framewidth;
        }
            outerFrame.scrollTo({ left: scrollxpos, behavior: 'smooth' });
          });
        })
      })
     }
