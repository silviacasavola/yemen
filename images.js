import * as utils from './utils.js';
let allFramesGenerated = false;
const maxRetries = 3;

function createFrameElement(title, url, desc, people, place, status) {
    let frameElement = utils.createElement('div', `frame`);

    let titleBarElement = utils.createElement('div', 'title-bar');
    let infobtn =  utils.createElement('div', 'info-btn', '<span class="piu">( ... )</span><span class="meno">( ... )</span>');

        infobtn.addEventListener('click', function () {
          Array.from(document.querySelectorAll('.frame-container')).forEach(container => {
            if (container.contains(event.target) && !container.classList.contains('showninfo')) {
              container.classList.add('showninfo');
            } else {
              container.classList.remove('showninfo');
          }
        })
      })

    titleBarElement.append(
    utils.createElement('span', 'title', title),
    infobtn)

    let imageContainer = utils.createElement('div', `img-container`);
    let imageElement = document.createElement('img');
    imageElement.src = url;
    imageContainer.append(imageElement)

    let metadataLayoutElement = utils.createElement('div', 'metadata-layout');

    if (desc) { metadataLayoutElement.append(
        utils.createElement('span', 'description metadata-row', 'DESCRIPTION: ' + desc + '<br>')
      )}
    if (place) { metadataLayoutElement.append(
        utils.createElement('span', 'place metadata-row', 'PLACE: ' + place + '<br>')
    )}
    if (people) { metadataLayoutElement.append(
        utils.createElement('span', 'people metadata-row', 'PEOPLE: ' + people + '<br>')
    )}

    frameElement.append(titleBarElement, imageContainer, metadataLayoutElement);

    return frameElement;
}

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
        let frameContainer = utils.createElement('div', 'frame-container');
        let outerFrame = utils.createElement('div', 'outer-frame');
        let shotIndexes = utils.parseShotIndex(record.shot);
        let ids = utils.getIdsFromShots(shotIndexes);
        let dotspan = utils.createElement('span', `dot`);

        // Your existing code for setting up frame containers and dots

        frameContainer.append(outerFrame, dotspan);

        if (ids.length > 1) {
            frameContainer.append(
                utils.createElement('div', `corner-sfumato`),
                // utils.createElement('span', `arrow`, '⭢')
            );
        }

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
                        record.appears == 'yes' ? '' : 'disconnected'
                    );
                    outerFrame.appendChild(frame_element);
                })
                .catch((error) => {
                    console.error(`Error loading image ${ids[i]}:`, error);
                    // Handle the error (e.g., show a placeholder image)
                });
            }
        }
        fragment.appendChild(frameContainer);

        if (records.indexOf(record) === 0) {
            frameContainer.classList.add('active');
        }
    });

    parentElement.appendChild(fragment);

    allFramesGenerated = true;

    if (allFramesGenerated) {
      toggleHidden();
      frameReplacement();
      addnumber()
    }
}

function addnumber() {
        let connected = Array.from(document.querySelectorAll('#images-container .dot')).filter(
            (d) => !d.classList.contains('disconnected'));
        connected.forEach((d) => {
          d.innerHTML = (connected.indexOf(d) + 1)
        });

        // resizeyourself()
}



    // function resizeyourself() {
    // console.log(document.querySelectorAll('.frame'))
    //
    //         Array.from(document.querySelectorAll('.outer-frame')).forEach((fc) => {
    //           let imgcnt = Array.from(fc.querySelectorAll('.frame'));
    //           console.log(imgcnt)
    //         //   if (imgcnt.length > 0) {
    //         //   imgcnt.forEach((ic) => {
    //         //     ic.style.maxHeight = imgcnt[0].offsetHeight + "px";
    //         //   })
    //         // }
    //         });
    // }
