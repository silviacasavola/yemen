import * as utils from './utils.js';
let allFramesGenerated = false;

function createFrameElement(title, url, desc, people, place, status) {
    let frameElement = utils.createElement('div', `frame`);

    let titleBarElement = utils.createElement('div', 'title-bar');
    let infobtn =  utils.createElement('div', 'info-btn', '<span class="piu">( + )</span><span class="meno">( - )</span>');

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

export function loadAndDisplayImages(records, metadataMain, parentId) {
    let parentElement = document.getElementById(parentId);
    let fragment = document.createDocumentFragment();

    records.forEach((record) => {
        let frameContainer = utils.createElement('div', 'frame-container');
        let outerFrame = utils.createElement('div', 'outer-frame')

        let shotIndexes = utils.parseShotIndex(record.shot);
        let ids = utils.getIdsFromShots(shotIndexes);

      let dotspan = utils.createElement('span', `dot`, records.indexOf(record) + 1);
        if (record.appears === "no") {
            frameContainer.classList.add("disconnected"),
            dotspan.classList.add("disconnected"),
            frameContainer.classList.add("hidden")
          }
      frameContainer.append(outerFrame, dotspan)

      if (ids.length > 1) {frameContainer.append(
      utils.createElement('div', `corner-sfumato`),
        utils.createElement('span', `arrow`, '⭢'))
      }

        for (let i = 0; i < ids.length; i++) {
            // Get metadata for the current id
            let currentMetadata = utils.getMetadataFromId(metadataMain, ids[i]);

            if (currentMetadata) {
                let frame_element = createFrameElement(
                    currentMetadata.Title,
                    `https://gradim.fh-potsdam.de/omeka-s/files/large/${ids[i]}.jpg`,
                    currentMetadata.Description,
                    currentMetadata.metaDepictedPeople,
                    record.place,
                    record.appears == 'yes' ? '' : 'disconnected'
                );
                outerFrame.appendChild(frame_element);
            }
        }
        fragment.appendChild(frameContainer);
    });

    parentElement.appendChild(fragment);

          allFramesGenerated = true;

          if (allFramesGenerated) {
            toggleHidden();
            frameReplacement();
          }
}
