import * as utils from './utils.js';
let allFramesGenerated = false;
const maxRetries = 3;

function createFrameElement(title, url, desc, people, place, status, idx, length, outerFrame) {
    let frameElement = utils.createElement('div', `frame`);

    let titleBarElement = utils.createElement('div', 'title-bar');

    titleBarElement.append(
    utils.createElement('span', 'title', title)
  )

    let imageContainer = utils.createElement('div', `img-container`);
    let imageElement = document.createElement('img');
    imageElement.src = url;
    if (idx !== 0) {

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

    for (let record of records) {

        let frameContainer = utils.createElement('div', 'frame-container');

        let outerFrame = utils.createElement('div', 'outer-frame');
        let shotIndexes = utils.parseShotIndex(record.shot);
        let ids = utils.getIdsFromShots(shotIndexes);
        let dotspan = utils.createElement('span', `dot`);

        frameContainer.append(outerFrame, dotspan);

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
                        i,
                        ids.length,
                        outerFrame
                    );
                    outerFrame.appendChild(frame_element);

                    // Set the height of frameContainer based on the first image's height
                    if (i === 0) {
                        firstImageHeightVh = frame_element.querySelector('.img-container img').clientHeight / window.innerHeight * 100;
                    }

                    attachArrowEventListeners(frame_element, i, ids.length);
                    })
                .catch((error) => {
                    console.error(`Error loading image ${ids[i]}:`, error);
                });
            }
        }

        fragment.appendChild(frameContainer);

        frameContainer.append(
          utils.createElement('div', `corner-sfumato`)
        )

        // if (records.indexOf(record) === 0 ) {
        //     frameContainer.classList.add('active');
        // }

        if (record.appears === 'no') {
          frameContainer.classList.add('disconnected')
          frameContainer.classList.add('hidden');
          dotspan.classList.add('disconnected');
        }
    }

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
        // console.log(images[0].clientHeight)
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


function attachArrowEventListeners(frame_element, i, length) {
        if (length > 1) {

          let metadata = frame_element.querySelector('.metadata-layout');
          let scrollHandles = utils.createElement('div', 'scroll-handles');

          let arrowleft = utils.createElement('span', `arrow arrowleft`, '←');
          let arrowright = utils.createElement('span', `arrow arrowright`, '→');
          let photonum = utils.createElement('span', 'photonum', "(" + (i+1) + "/" + length + ")");

          if (i === 0) { arrowleft.style.display = "none" }
          if (i === (length-1)) { arrowright.style.display = "none" }

          // let scrollxpos = 0;
          let outerFrame = frame_element.closest('.outer-frame')

          let parentwidth = outerFrame.getBoundingClientRect().width + 5;

          let currentScrollX = 0;
          let scrollxpos = 0;

          arrowright.addEventListener("click", function(event) {
            currentScrollX = outerFrame.scrollLeft;
            scrollxpos = currentScrollX + parentwidth;
              console.log(scrollxpos)
            outerFrame.scrollTo({ left: scrollxpos, behavior: 'smooth' });
          })

          arrowleft.addEventListener("click", function(event) {
          currentScrollX = outerFrame.scrollLeft;
          scrollxpos = outerFrame.scrollLeft - parentwidth;
            console.log(scrollxpos)
          outerFrame.scrollTo({ left: scrollxpos, behavior: 'smooth' });
          })

          scrollHandles.append(arrowleft, photonum, arrowright)
          metadata.append(scrollHandles)
      }
    }

  //   const arrowleft = outerFrame.querySelector('.frame .metadata-layout .arrowleft');
  //   const arrowright = outerFrame.querySelector('.frame .metadata-layout .arrowright');
  //   const parentwidth = outerFrame.getBoundingClientRect().width + 5;
  //   console.log(arrowright)
  //
  //   if (arrowleft && arrowright) {
  //   arrowright.addEventListener("click", function(event) {
  //       const currentScrollX = outerFrame.scrollLeft;
  //       const scrollxpos = currentScrollX + parentwidth;
  //       console.log(`Right arrow clicked: currentScrollX = ${currentScrollX}, scrollxpos = ${scrollxpos}`);
  //       outerFrame.scrollTo({ left: scrollxpos, behavior: 'smooth' });
  //   });
  //
  //   arrowleft.addEventListener("click", function(event) {
  //       const currentScrollX = outerFrame.scrollLeft;
  //       const scrollxpos = currentScrollX - parentwidth;
  //       console.log(`Left arrow clicked: currentScrollX = ${currentScrollX}, scrollxpos = ${scrollxpos}`);
  //       outerFrame.scrollTo({ left: scrollxpos, behavior: 'smooth' });
  //   });
  // } else {
  //       // If arrows are not found, retry after a short delay
  //       setTimeout(() => {
  //           attachArrowEventListeners(outerFrame);
  //       }, 1000); // Retry after 1 second
  //   }
