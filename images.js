import * as utils from './utils.js';
import * as scroll from './scroll.js';
import * as tutorial from './tutorial.js';
let allFramesGenerated = false;
let firstImageHeightVh;
let metadataArray = [];

// Function to set the width of title and metadata rows
function setElementWidths(imgContainer) {
    const width = imgContainer.clientWidth;
    const frame = imgContainer.closest('.frame');
    if (frame) {
        const titleRow = frame.querySelector('.title-row');
        const metadataLayoutElement = frame.querySelector('.metadata-layout');
        if (titleRow) titleRow.style.width = `${width}px`;
        if (metadataLayoutElement) metadataLayoutElement.style.width = `${width}px`;
    }
}

// Function to create each frame element
function createFrameElement(title, url, idx, people, place, isLast) {
    let frameElement = utils.createElement('div', 'frame');

    let imgContainer = utils.createElement('div', 'img-container');
    if (isLast) {
        imgContainer.classList.add('last');
    }
    let imageElement = document.createElement('img');
    imageElement.src = url;
    imageElement.className = `image-idx-${idx}`; // Assign class based on idx

    imageElement.onload = () => {
        setElementWidths(imgContainer);
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

// Function to create the first image frame element and set the height
function createFirstImageFrame(title, url, idx, people, place) {
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
        setElementWidths(imgContainer);
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

// Function to load images and return a promise that resolves when all images are loaded
function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = reject;
    });
}

// Function to load and display images
export async function loadAndDisplayImages(records, metadataMain, parentId) {
    let parentElement = document.getElementById(parentId);
    let fragment = document.createDocumentFragment();
    let imagePromises = [];

    for (let recordIndex = 0; recordIndex < records.length; recordIndex++) {
        let record = records[recordIndex];

        let frameContainer = utils.createElement('div', 'frame-container');
        let outerFrame = utils.createElement('div', 'outer-frame');

        let dotspan = utils.createElement('span', 'dot');

        frameContainer.append(outerFrame, dotspan);

        let shotIndexes = utils.parseShotIndex(record.shot);
        let ids = utils.getIdsFromShots(shotIndexes);

        if (ids.length > 0) {
            let id = ids[0];
            let currentMetadata = utils.getMetadataFromId(metadataMain, id);

            if (currentMetadata) {
                let firstFrameElement = createFirstImageFrame(
                    currentMetadata.Title,
                    `https://gradim.fh-potsdam.de/omeka-s/files/medium/${id}.jpg`,
                    0,
                    currentMetadata.metaDepictedPeople,
                    record.place
                );

                outerFrame.appendChild(firstFrameElement);

                if (recordIndex < 20) {
                imagePromises.push(loadImage(`https://gradim.fh-potsdam.de/omeka-s/files/medium/${id}.jpg`));
                }

                metadataArray.push({
                    element: firstFrameElement,
                    outerFrame: outerFrame,
                    photonumElement: null, // Placeholder, will be updated later if needed
                    arrowleftElement: null,
                    arrowrightElement: null,
                    metadata: {
                        title: currentMetadata.Title,
                        idx: 0, // Storing 0-based index
                        length: ids.length,
                        recordIndex: recordIndex // Store the record index for debugging
                    }
                });
            }
        }

        for (let i = 1; i < ids.length; i++) {
            let id = ids[i];
            let currentMetadata = utils.getMetadataFromId(metadataMain, id);
            const isLast = i === ids.length - 1;

            if (currentMetadata) {
                let frameElement = createFrameElement(
                    currentMetadata.Title,
                    `https://gradim.fh-potsdam.de/omeka-s/files/medium/${id}.jpg`,
                    i,
                    currentMetadata.metaDepictedPeople,
                    record.place,
                    isLast
                );

                outerFrame.appendChild(frameElement);

                frameElement.classList.add('invisible')
                imagePromises.push(loadImage(`https://gradim.fh-potsdam.de/omeka-s/files/medium/${id}.jpg`));

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
            }
        }

        if (ids.length > 1) {
            let scrollHandles = utils.createElement('div', 'scroll-handles');
            let arrowleft = utils.createElement('span', `arrow arrowleft`, '←');
            let arrowright = utils.createElement('span', `arrow arrowright`, '→');
            let photonum = utils.createElement('span', 'photonum', `(1/${ids.length})`);
            scrollHandles.append(arrowleft, photonum, arrowright);
            frameContainer.append(scrollHandles);

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

        fragment.appendChild(frameContainer);

        // Ensure .disconnected frames are also processed correctly
        if (record.appears === 'no') {
            frameContainer.classList.add('disconnected');
            frameContainer.classList.add('hidden');
            dotspan.classList.add('disconnected');
        } else {
            frameContainer.classList.add('connected');

            if (recordIndex === 0) {
                frameContainer.classList.add('active');
                dotspan.classList.add('active');
            }
        }
    }

    parentElement.appendChild(fragment);
    allFramesGenerated = true;

    if (allFramesGenerated) {
        toggleHidden();
        // addNumber();
        setImageHeights();
    }

    // Ensure metadata and title are correctly set after all frames are loaded
    metadataArray.forEach(meta => {
        if (meta.metadata.idx === 0) {
            updateMetadata(meta.photonumElement, meta.metadata.idx, meta.metadata.length);
        }
    });

    // Wait for all images to load before removing the loading overlay
    try {
        await Promise.all(imagePromises);
        removeLoadingOverlay();
        // tutorial.beginningtime();
        scroll.attachDotsEventListeners();
    } catch (error) {
        console.error('Error loading images', error);
    }
}

function updateMetadata(photonumElement, idx, length) {
    if (photonumElement) {
        photonumElement.textContent = `(${idx + 1}/${length})`; // Displaying 1-based index
    }
}

// Function to update metadata based on scroll position
function updateInformationOnScroll(outerFrame) {
    let scrollLeft = outerFrame.scrollLeft;
    let outerFrameWidth = outerFrame.clientWidth;
    let frameElements = outerFrame.querySelectorAll('.frame');

    let visibleFrameIdx = -1;
    let visibleFrameMiddleIdx = -1;
    let minDistance = Infinity;

    for (let i = 0; i < frameElements.length; i++) {
        let frameElement = frameElements[i];
        let rect = frameElement.getBoundingClientRect();
        let frameLeft = rect.left + scrollLeft - outerFrame.offsetLeft;

        // Check if frame is within view
        if (frameLeft < scrollLeft + outerFrameWidth && frameLeft + rect.width > scrollLeft) {
            visibleFrameIdx = i;
            // Find the frame closest to the middle of the view
            let frameMiddle = frameLeft + rect.width / 2;
            let distance = Math.abs(frameMiddle - (scrollLeft + outerFrameWidth / 2));
            if (distance < minDistance) {
                minDistance = distance;
                visibleFrameMiddleIdx = i;
            }
        }
    }

    let allframes = Array.from(outerFrame.querySelectorAll('.frame'));
    for (let y = 0; y < allframes.length; y++) {
        if (y != visibleFrameMiddleIdx) {
            allframes[y].classList.add('invisible');
        } else {
            allframes[y].classList.remove('invisible');
        }
    }

    if (visibleFrameMiddleIdx !== -1) {
        let metadata = metadataArray.find(meta => meta.outerFrame === outerFrame && meta.metadata.idx === visibleFrameMiddleIdx);
        if (metadata) {
            let photonumElement = metadata.photonumElement;
            let arrowleftElement = metadata.arrowleftElement;
            let arrowrightElement = metadata.arrowrightElement;

            updateMetadata(photonumElement, metadata.metadata.idx, metadata.metadata.length);

            if (arrowleftElement && arrowrightElement) {
                arrowleftElement.style.display = (metadata.metadata.idx === 0) ? 'none' : 'inline';
                arrowrightElement.style.display = (metadata.metadata.idx === metadata.metadata.length - 1) ? 'none' : 'inline';
            }
        } else {
            console.error(`Metadata not found for visibleFrameIdx: ${visibleFrameMiddleIdx} in outerFrame`);
        }
    } else {
        console.error(`No visible frame found in outerFrame`);
    }
}

function addNumber() {
    let connected = Array.from(document.querySelectorAll('.frame-container.connected'));
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

function removeLoadingOverlay() {
    document.getElementById('overlay1').classList.toggle('removed');
    const overlaytimeout = setTimeout(() => {
        document.getElementById('overlay1').remove();
        clearTimeout(overlaytimeout);
    }, 1600);
}
