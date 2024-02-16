// Function to generate combinations of names, surnames, and extras
function generateCombinations(names, surnames, extras) {
    const shortCombinations = [];
    const longCombinations = [];

    names.forEach(name => {
        surnames.forEach(surname => {
            shortCombinations.push(`${surname}`);
            longCombinations.push(`${name} ${surname}`);
            longCombinations.push(`${surname} ${name}`);
            longCombinations.push(`${surname}, ${name}`);

            if (extras) {
                extras.forEach(extra => {
                    shortCombinations.push(`${extra}`);
                    longCombinations.push(`${extra} ${name}`);
                    longCombinations.push(`${extra} ${surname}`);
                    longCombinations.push(`${extra} ${name} ${surname}`);
                });
            }
        });
    });

    names.forEach(name => {
        shortCombinations.push(`${name}`);
    });

    // Return both short and long combinations
    return { shortCombinations, longCombinations };
}

let allFramesGenerated = false;

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
                const { shortCombinations, longCombinations } = generateCombinations(nameVariants, surnameVariants, extraVariants);

                // Sort long combinations by length in descending order
                longCombinations.sort((a, b) => b.length - a.length);

                // Replace each combination in the element
                longCombinations.forEach(combination => {
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
                shortCombinations.forEach(combination => {
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

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        jsonData = data; // Assign fetched JSON data to jsonData

        // Replace people entities in .page elements
        const pages = document.querySelectorAll('.page');
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
    .catch(error => console.error('Error fetching or parsing JSON:', error));

    function frameReplacement() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            // Replace people entities in .people-col elements
            const peopleColumns = document.querySelectorAll('.people-col');
            peopleColumns.forEach(element => {
                replacePeopleInElement(element, jsonData);
            });

            const placesColumns = document.querySelectorAll('.place-col');
            placesColumns.forEach(element => {
                replacePlacesInElement(element, jsonData);
            });

            const descriptionColumns = document.querySelectorAll('.description-col');
            descriptionColumns.forEach(element => {
                replaceKeywordsInElement(element, jsonData);
            });

            const nestedLinks = document.querySelectorAll('.filter-link .filter-link');
                nestedLinks.forEach(span => {
                  span.parentNode.replaceChild(span.firstChild, span);
                });
            // Add event listeners after replacing elements
            addEvent(jsonData);
        })
        .catch(error => console.error('Error fetching or parsing JSON:', error));
    }

    let selectionIndicatorCounter = 0; // Counter for unique IDs

    function addEvent(jsonData) {
      const selectionIndicatorsContainer = document.getElementById("selection-indicators-container");
      const filterLinks = document.querySelectorAll('.filter-link');

      filterLinks.forEach(flink => {
        flink.addEventListener('click', () => {
          const selectorId = flink.id;

          // Remove existing selection indicators with the same selectorId
          const existingIndicators = document.querySelectorAll(`.selection-indicator[data-selector="${selectorId}"]`);
          existingIndicators.forEach(indicator => indicator.remove());

          // Create a new div for the selection indicator with a unique ID
          const selectionIndicator = document.createElement('div');
          selectionIndicator.className = 'selection-indicator';
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

          // Append the selection indicator to the specified container
          selectionIndicator.innerHTML = officialIdentificator + ' X';
          selectionIndicatorsContainer.appendChild(selectionIndicator);

          handleClick(jsonData);
        });
      });

      function handleClick(jsonData) {
          const currentIndicators = document.querySelectorAll(`.selection-indicator`);
          const accumulatedFilters = new Set();

          currentIndicators.forEach(currentIndicator => {
              const activeId = currentIndicator.dataset.selector;

              filterLinks.forEach(otherFlink => {
                  if (otherFlink.id === activeId) {
                      accumulatedFilters.add(otherFlink); // Add filter link to accumulated set
                  }
              });
          });

          accumulatedFilters.forEach(filterLink => {
              filterLink.classList.add('selected');
          });

          // Determine visibility of pages based on selected filter links
          const selectedLinksContainers = new Set();
          filterLinks.forEach(link => {
              if (link.classList.contains('selected')) {
                  const parentFrame = link.closest('.frame');
                  const parentPage = link.closest('.page');

                  if (parentFrame) {
                      selectedLinksContainers.add(parentFrame);
                  } else if (parentPage) {
                      selectedLinksContainers.add(parentPage);
                  }
              }
          });

          // Remove 'selected' class from corresponding filter links not in the accumulated set
          filterLinks.forEach(link => {
              if (!accumulatedFilters.has(link)) {
                  link.classList.remove('selected');
              }
          });

          // Update page visibility based on selected filter links
          const pages = document.querySelectorAll('.page');
          pages.forEach(page => {
                  if (currentIndicators.length !== 0) {
                      page.classList.toggle('hidden', !selectedLinksContainers.has(page));
                  } else {
                      page.classList.remove('hidden');
                      page.classList.remove('shown');
                  }
          });

          const frames = document.querySelectorAll('.frame');
          frames.forEach(frame => {
                  if (currentIndicators.length !== 0) {
                      frame.classList.toggle('hidden', !selectedLinksContainers.has(frame));
                  } else {
                      frame.classList.remove('hidden');
                      frame.classList.remove('shown');
                  }
          });

          toggleHidden();
      }


      // Event delegation for removing selection indicators
      selectionIndicatorsContainer.addEventListener('click', (event) => {
        const selectionIndicator = event.target.closest('.selection-indicator');

        if (selectionIndicator) {
          const selectorId = selectionIndicator.dataset.selector;

          selectionIndicator.remove();

          // Update page visibility based on selected filter links
          handleClick(jsonData);
        }
      });

      function toggleHidden() {
        const hiddenContainers = document.querySelectorAll('.hidden');

        hiddenContainers.forEach(hidden => {
          hidden.addEventListener('click', () => {
            hidden.classList.remove('hidden');
            hidden.classList.add('shown');
          });
        });
      }
    }



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
