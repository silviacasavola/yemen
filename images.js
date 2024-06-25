import * as utils from './utils.js';
let allFramesGenerated = false;
const maxRetries = 3;
let firstImageHeightVh;
let metadataArray = [];

// Function to create each frame element
function createFrameElement(title, url, idx, people, place) {
    let frameElement = utils.createElement('div', 'frame');

    let imgContainer = utils.createElement('div', 'img-container');
    let imageElement = document.createElement('img');
    imageElement.src = url;
    imageElement.className = `image-idx-${idx}`; // Assign class based on idx
    imageElement.onload = () => {
        if (!firstImageHeightVh) {
            firstImageHeightVh = imageElement.clientHeight / window.innerHeight * 100;
            setImageHeights(firstImageHeightVh);
        }
    };
    imgContainer.append(imageElement);
    imgContainer.append(utils.createElement('div', 'sfumatura-verticale'));


    let titleRow = utils.createElement('div', 'title-row', title);

    let metadataLayoutElement = utils.createElement('div', 'metadata-layout');

    if (place) {
        metadataLayoutElement.append(
            utils.createElement('span', 'place metadata-row', `Taken in ${place} `)
        );
    }
    if (people) {
        metadataLayoutElement.append(
            utils.createElement('span', 'people metadata-row', `with ${people}`)
        );
    }

    frameElement.append(imgContainer, titleRow, metadataLayoutElement);
    return frameElement;
}

// Function to load and display images
export async function loadAndDisplayImages(records, metadataMain, parentId) {
    let parentElement = document.getElementById(parentId);
    let fragment = document.createDocumentFragment();

    for (let recordIndex = 0; recordIndex < records.length; recordIndex++) {
        let record = records[recordIndex];

        let frameContainer = utils.createElement('div', 'frame-container');
        let outerFrame = utils.createElement('div', 'outer-frame');

        let dotspan = utils.createElement('span', 'dot');

        frameContainer.append(outerFrame, dotspan);

        let shotIndexes = utils.parseShotIndex(record.shot);
        let ids = utils.getIdsFromShots(shotIndexes);

        for (let i = 0; i < ids.length; i++) {
            let id = ids[i];
            let currentMetadata = utils.getMetadataFromId(metadataMain, id);
            // console.log(`Processing image id: ${id}, index: ${i}, recordIndex: ${recordIndex}`); // Debug log

            if (currentMetadata) {
                let frameElement = createFrameElement(
                    currentMetadata.Title,
                    `https://gradim.fh-potsdam.de/omeka-s/files/large/${id}.jpg`,
                    i,
                    currentMetadata.metaDepictedPeople,
                    record.place
                );

                // Append the frame element
                outerFrame.appendChild(frameElement);

                // Store metadata in an array for easy access during scroll
                metadataArray.push({
                    element: frameElement,
                    outerFrame: outerFrame,
                    photonumElement: null, // Placeholder, will be updated later if needed
                    arrowleftElement: null,
                    arrowrightElement: null,
                    metadata: {
                        title: currentMetadata.Title,
                        idx: i, // Storing 0-based index
                        length: ids.length,
                        recordIndex: recordIndex // Store the record index for debugging
                    }
                });
            // } else {
            //     console.error(`Metadata not found for image id: ${id} in record ${recordIndex}`);
            }
        }

        if (ids.length > 1) {
            let scrollHandles = utils.createElement('div', 'scroll-handles');
            let arrowleft = utils.createElement('span', `arrow arrowleft`, '←');
            let arrowright = utils.createElement('span', `arrow arrowright`, '→');
            let photonum = utils.createElement('span', 'photonum', `(1/${ids.length})`);
            scrollHandles.append(arrowleft, photonum, arrowright);
            frameContainer.append(scrollHandles);
            // DA SISTEMARE!!!!!!!!!!!!!!!

            frameContainer.append(utils.createElement('div', 'sfumatura-sinistra'));
            frameContainer.append(utils.createElement('div', 'sfumatura-destra'));

            // Update the metadata array with the photonum element
            metadataArray.filter(meta => meta.outerFrame === outerFrame).forEach(meta => {
                meta.photonumElement = photonum;
                meta.arrowleftElement = arrowleft;
                meta.arrowrightElement = arrowright;
            });

            // Add scroll event listener to this outer-frame
            outerFrame.addEventListener('scroll', () => {
                updateInformationOnScroll(outerFrame);
            });
        }


        // frameContainer.append(utils.createElement('div', 'sfumatura-verticale'));

        fragment.appendChild(frameContainer);

        // Ensure .disconnected frames are also processed correctly
        if (record.appears === 'no') {
            frameContainer.classList.add('disconnected');
            frameContainer.classList.add('hidden');
            dotspan.classList.add('disconnected');
        } else {
            frameContainer.classList.add('connected');
        }

        if (recordIndex === 0) {
            frameContainer.classList.add('active');
            dotspan.classList.add('active');
          }
    }

    parentElement.appendChild(fragment);
    allFramesGenerated = true;

    if (allFramesGenerated) {
        toggleHidden();
        addNumber();
        setImageHeights();
    }

    // Ensure metadata and title are correctly set after all frames are loaded
    metadataArray.forEach(meta => {
        if (meta.metadata.idx === 0) {
            updateMetadata(meta.photonumElement, meta.metadata.idx, meta.metadata.length);
        }
    });
}

function updateMetadata(photonumElement, idx, length) {
    if (photonumElement) {
        photonumElement.textContent = `(${idx + 1}/${length})`; // Displaying 1-based index
        // console.log(`Updated photonum: (${idx + 1}/${length})`);
    }
}

// Function to update metadata based on scroll position
function updateInformationOnScroll(outerFrame) {
    let scrollLeft = outerFrame.scrollLeft;
    let outerFrameWidth = outerFrame.clientWidth;
    let frameElements = outerFrame.querySelectorAll('.frame');

    let visibleFrameIdx = -1;
    for (let i = 0; i < frameElements.length; i++) {
        let frameElement = frameElements[i];
        let rect = frameElement.getBoundingClientRect();
        let frameLeft = rect.left + scrollLeft -1;

        // Check if frame is within view
        if (frameLeft >= scrollLeft && frameLeft < scrollLeft + outerFrameWidth) {
            visibleFrameIdx = i;
        }
    }

    if (visibleFrameIdx !== -1) {
        let metadata = metadataArray.find(meta => meta.outerFrame === outerFrame && meta.metadata.idx === visibleFrameIdx);
        if (metadata) {
            let photonumElement = metadata.photonumElement;
            let arrowleftElement = metadata.arrowleftElement;
            let arrowrightElement = metadata.arrowrightElement;

            updateMetadata(photonumElement, metadata.metadata.idx, metadata.metadata.length);

            // console.log(`Scroll - Index: ${visibleFrameIdx}, Length: ${metadata.metadata.length}, RecordIndex: ${metadata.metadata.recordIndex}`); // Debug log

            if (arrowleftElement && arrowrightElement) {
                arrowleftElement.style.display = (metadata.metadata.idx === 0) ? 'none' : 'inline';
                arrowrightElement.style.display = (metadata.metadata.idx === metadata.metadata.length - 1) ? 'none' : 'inline';
            }
        } else {
            console.error(`Metadata not found for visibleFrameIdx: ${visibleFrameIdx} in outerFrame`);
        }
    } else {
        console.error(`No visible frame found in outerFrame`);
    }
}

function addNumber() {
    let connected = Array.from(document.querySelectorAll('#images-container.connected'));
    connected.forEach((d) => {
        d.querySelector('.dot').innerHTML = (connected.indexOf(d) + 1);
        d.querySelector('.dot').setAttribute('data-dot-id', (connected.indexOf(d) + 1));
    });
}

function setImageHeights(firstImageHeightVh) {
    let frameContainers = document.querySelectorAll('.frame-container');
    frameContainers.forEach(container => {
        let outerFrame = container.querySelector('.outer-frame');
        let images = outerFrame.querySelectorAll('img');
        images.forEach(image => {
            image.style.maxHeight = `${firstImageHeightVh}vh`;
        });
    });
}

window.addEventListener('resize', setImageHeights);
