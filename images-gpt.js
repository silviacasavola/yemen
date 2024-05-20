import * as utils from './utils.js';
let allFramesGenerated = false;
const maxRetries = 3;

function createFrameElement(title, url, desc, people, place, status, idx, length, outerFrame) {
    let frameElement = utils.createElement('div', `frame`);

    let titleBarElement = utils.createElement('div', 'title-bar');
    titleBarElement.append(utils.createElement('span', 'title', title));

    let imageContainer = utils.createElement('div', `img-container`);
    let imageElement = document.createElement('img');
    imageElement.src = url;
    // if (idx !== 0) {
    //     imageElement.style.maxHeight = firstImageHeightVh + "vh";
    // }
    imageContainer.append(imageElement);

    let metadataLayoutElement = utils.createElement('div', 'metadata-layout');

    if (desc) {
        metadataLayoutElement.append(utils.createElement('span', 'description metadata-row', '<span class="lil-title">DESCRIPTION:</span> ' + desc + '<br>'));
    }
    if (place) {
        metadataLayoutElement.append(utils.createElement('span', 'place metadata-row', '<span class="lil-title">PLACE:</span> ' + place + '<br>'));
    }
    if (people) {
        metadataLayoutElement.append(utils.createElement('span', 'people metadata-row', '<span class="lil-title">PEOPLE:</span> ' + people + '<br>'));
    }

    if (length > 1) {
        let scrollHandles = utils.createElement('div', 'scroll-handles');

        let arrowleft = utils.createElement('span', `arrow arrowleft`, '←');
        let arrowright = utils.createElement('span', `arrow arrowright`, '→');
        let photonum = utils.createElement('span', 'photonum', "(" + (Number(idx) + 1) + "/" + length + ")");
        scrollHandles.append(arrowleft, photonum, arrowright);
        metadataLayoutElement.append(scrollHandles);

        if (Number(idx) === 0) { arrowleft.style.display = "none"; }
        if (Number(idx) === (length - 1)) { arrowright.style.display = "none"; }

        let parentwidth = outerFrame.getBoundingClientRect().width + 5;

        arrowright.addEventListener("click", function(event) {
            let currentScrollX = outerFrame.scrollLeft;
            let scrollxpos = currentScrollX + parentwidth;
            console.log(`Right arrow clicked: currentScrollX = ${currentScrollX}, scrollxpos = ${scrollxpos}`);
            outerFrame.scrollTo({ left: scrollxpos, behavior: 'smooth' });
        });

        arrowleft.addEventListener("click", function(event) {
            let currentScrollX = outerFrame.scrollLeft;
            let scrollxpos = currentScrollX - parentwidth;
            console.log(`Left arrow clicked: currentScrollX = ${currentScrollX}, scrollxpos = ${scrollxpos}`);
            outerFrame.scrollTo({ left: scrollxpos, behavior: 'smooth' });
        });
    }

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

        for (let i = 0; i < ids.length; i++) {
            let currentMetadata = utils.getMetadataFromId(metadataMain, ids[i]);

            if (currentMetadata) {
                try {
                    await loadImageWithRetry(
                        `https://gradim.fh-potsdam.de/omeka-s/files/large/${ids[i]}.jpg`,
                        maxRetries
                    );

                    let frame_element = createFrameElement(
                        currentMetadata.Title,
                        `https://gradim.fh-potsdam.de/omeka-s/files/large/${ids[i]}.jpg`,
                        currentMetadata.Description,
                        currentMetadata.metaDepictedPeople,
                        record.place,
                        record.appears === 'yes' ? '' : 'disconnected',
                        i,
                        ids.length,
                        outerFrame
                    );
                    outerFrame.appendChild(frame_element);

                    // if (i === 0) {
                    //     firstImageHeightVh = frame_element.querySelector('.img-container img').clientHeight / window.innerHeight * 100;
                    // }
                } catch (error) {
                    console.error(`Error loading image ${ids[i]}:`, error);
                }
            }
        }

        fragment.appendChild(frameContainer);
        frameContainer.append(utils.createElement('div', `corner-sfumato`));

        if (record.appears === 'no') {
            frameContainer.classList.add('disconnected', 'hidden');
            dotspan.classList.add('disconnected');
        }
    }

    parentElement.appendChild(fragment);

    allFramesGenerated = true;

    if (allFramesGenerated) {
        toggleHidden();
        frameReplacement();
        addnumber();
        // updateImageHeights();
    }
}

function addnumber() {
    let connected = Array.from(document.querySelectorAll('#images-container .dot')).filter(
        (d) => !d.classList.contains('disconnected')
    );
    connected.forEach((d, index) => {
        d.innerHTML = (index + 1);
    });
}

// function updateImageHeights() {
//     let frameContainers = document.querySelectorAll('.frame-container');
//     frameContainers.forEach(container => {
//         let outerFrame = container.querySelector('.outer-frame');
//         let firstImage = outerFrame.querySelector('.img-container img');
//         if (firstImage) {
//             let firstImageHeightVh = firstImage.clientHeight / window.innerHeight * 100; // Convert to vh
//             setImageHeights(outerFrame, firstImageHeightVh);
//         }
//     });
// }

// window.addEventListener('resize', updateImageHeights);

// function setImageHeights(outerFrame, heightVh) {
//     let images = Array.from(outerFrame.querySelectorAll('img'));
//     images.forEach(image => {
//         if (images.indexOf(image) !== 0) {
//             image.style.maxHeight = `${heightVh}vh`;
//             image.style.height = `${heightVh}vh`;
//         }
//     });
// }
