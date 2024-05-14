import * as utils from './utils.js';
let allFramesGenerated = false;
const maxRetries = 3;

function createFrameElement(title, url, desc, people, place, status, idx) {
    let frameElement = utils.createElement('div', `frame`);

    let titleBarElement = utils.createElement('div', 'title-bar');
    // let infobtn =  utils.createElement('div', 'info-btn', '<span class="piu">( i )</span><span class="meno">( - )</span>');

      //   infobtn.addEventListener('click', function () {
      //     Array.from(document.querySelectorAll('.frame-container')).forEach(container => {
      //       if (container.contains(event.target) && !container.classList.contains('showninfo')) {
      //         container.classList.add('showninfo');
      //       } else {
      //         container.classList.remove('showninfo');
      //     }
      //   })
      // })

    titleBarElement.append(
    utils.createElement('span', 'title', title),
    // infobtn
  )

    let imageContainer = utils.createElement('div', `img-container`);
    let imageElement = document.createElement('img');
    imageElement.src = url;
    if (idx !== 0) {
      // console.log("heyo" + firstImageHeightVh)
    imageElement.style.maxHeight = firstImageHeightVh + "vh";
  }
    imageContainer.append(imageElement)

    let metadataLayoutElement = utils.createElement('div', 'metadata-layout');

    if (desc) { metadataLayoutElement.append(
        utils.createElement('span', 'description metadata-row', '<span class="lil-title">DESCRIPTION:</span> ' + desc + '<br>')
      )}
    if (place) { metadataLayoutElement.append(
        utils.createElement('span', 'place metadata-row', '<span class="lil-title">PLACE:</span> ' + place + '<br>')
    )}
    if (people) { metadataLayoutElement.append(
        utils.createElement('span', 'people metadata-row', '<span class="lil-title">PEOPLE:</span> ' + people + '<br>')
    )}

    frameElement.append(titleBarElement, imageContainer, metadataLayoutElement);

    return frameElement;
}

let firstImageHeightVh;

// Function to load and display images
export async function loadAndDisplayImages(records, metadataMain, parentId) {

    function loadImage(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = (error) => reject(error);
            img.src = url;
        });
    }

    function loadImageWithRetry(url, retries) {
        return new Promise((resolve, reject) => {
            let retryCount = 0;

            function load() {
                loadImage(url)
                    .then((image) => resolve(image))
                    .catch((error) => {
                        retryCount++;
                        if (retryCount <= retries) {
                            console.log(`Retrying (${retryCount}/${retries}) for URL: ${url}`);
                            load();
                        } else {
                            reject(new Error(`Failed to load image after ${retries} retries: ${url}`));
                        }
                    });
            }

            load();
        });
    }

    let parentElement = document.getElementById(parentId);
    let fragment = document.createDocumentFragment();

    records.forEach((record) => {

    //   let indexino =
    //   rows.forEach(function(row, index) {
    //     console.log("Row index of record", index + 1); // Add 1 to convert from zero-based index to 1-based row number
    // });

        let frameContainer = utils.createElement('div', 'frame-container');
        let outerFrame = utils.createElement('div', 'outer-frame');
        let shotIndexes = utils.parseShotIndex(record.shot);
        let ids = utils.getIdsFromShots(shotIndexes);
        let dotspan = utils.createElement('span', `dot`);
        // console.log(records.indexOf(record))

        // Your existing code for setting up frame containers and dots

        frameContainer.append(outerFrame, dotspan);


        if (ids.length > 1) {
            let arrowleft =  utils.createElement('span', `arrow arrowleft`, '←')
            let arrowright =  utils.createElement('span', `arrow arrowright`, '→')
            outerFrame.append(arrowleft, arrowright);
            let scrollxpos = 0;
            let parentframe;
            let parentwidth;

            arrowright.addEventListener("click", function(event) {
            parentframe = event.target.closest('.outer-frame');
            parentwidth = parentframe.getBoundingClientRect().width;
            scrollxpos = scrollxpos + parentwidth + 100;
            horizontalscroll(parentframe, scrollxpos)
           })

           arrowleft.addEventListener("click", function(event) {
           parentframe = event.target.closest('.outer-frame');
           parentwidth = parentframe.getBoundingClientRect().width;
           scrollxpos = scrollxpos - parentwidth - 100;
           horizontalscroll(parentframe, scrollxpos)
          })

          function horizontalscroll(parentframe, scrollxpos) {
            console.log(scrollxpos)
            parentframe.scrollTo({ left: scrollxpos, behavior: 'smooth' });
            if (scrollxpos < parentwidth) {
              arrowleft.style.display = "none"
            } else {
              arrowleft.style.display = "block"
            }
          }
        }

        let firstImageHeight;
        for (let i = 0; i < ids.length; i++) {
            let currentMetadata = utils.getMetadataFromId(metadataMain, ids[i]);

            if (currentMetadata) {
                loadImageWithRetry(
                    `https://gradim.fh-potsdam.de/omeka-s/files/large/${ids[i]}.jpg`,
                    maxRetries
                )
                .then(() => {
                    let frame_element = createFrameElement(
                        currentMetadata.Title,
                        `https://gradim.fh-potsdam.de/omeka-s/files/large/${ids[i]}.jpg`,
                        currentMetadata.Description,
                        currentMetadata.metaDepictedPeople,
                        record.place,
                        record.appears == 'yes' ? '' : 'disconnected',
                        [i]
                    );
                    outerFrame.appendChild(frame_element);

                    // Set the height of frameContainer based on the first image's height
                    if (i === 0) {
                        firstImageHeightVh = frame_element.querySelector('.img-container img').clientHeight / window.innerHeight * 100; // Convert to vh
                        // setImageHeights(frame_element, firstImageHeightVh);
                    }
                    })
                .catch((error) => {
                    console.error(`Error loading image ${ids[i]}:`, error);
                    // Handle the error (e.g., show a placeholder image)
                });
            }
        }
        fragment.appendChild(frameContainer);

        // if (records.indexOf(record) === 0 ) {
        //     frameContainer.classList.add('active');
        // }

        if (record.appears === 'no') {
          frameContainer.classList.add('disconnected')
          frameContainer.classList.add('hidden');
          dotspan.classList.add('disconnected');
        }
    });

    parentElement.appendChild(fragment);

    allFramesGenerated = true;

    if (allFramesGenerated) {
      toggleHidden();
      frameReplacement();
      addnumber();
      updateImageHeights();
    }
}

function addnumber() {
        let connected = Array.from(document.querySelectorAll('#images-container .dot')).filter(
            (d) => !d.classList.contains('disconnected'));
        connected.forEach((d) => {
          d.innerHTML = (connected.indexOf(d) + 1)
        });
}


// Function to update image heights based on the tallest image in each frame-container
function updateImageHeights() {
    let frameContainers = document.querySelectorAll('.frame-container');
    frameContainers.forEach(container => {
        let outerFrame = container.querySelector('.outer-frame');
        let firstImage = outerFrame.querySelector('.img-container img');
        if (firstImage) {
            let firstImageHeightVh = firstImage.clientHeight / window.innerHeight * 100; // Convert to vh
            setImageHeights(outerFrame, firstImageHeightVh);
        }
    });
}
//
// // Listen for resize event to update image heights
window.addEventListener('resize', function updateImageHeights() {
    let frameContainers = document.querySelectorAll('.outer-frame');
    frameContainers.forEach(container => {
        let images = Array.from(container.querySelectorAll('img'));
        if (images) {
        console.log(images[0].clientHeight)
        firstImageHeightVh = images[0].clientHeight / window.innerHeight * 100;
        images.forEach(image => {
          if (images.indexOf(image) !== 0) {
        image.style.maxHeight = `${firstImageHeightVh}vh`;
        image.style.height = `${firstImageHeightVh}vh`;
      }
      })
    }
  })
})
