import * as utils from './utils.js';

function createFrameElement(title, url, desc, people, place, status) {
    let frameElement = utils.createElement('div', `frame ${status}`);

    let titleBarElement = utils.createElement('div', 'title-bar', title)

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

        let metadata = ids.map((id) =>
            utils.getMetadataFromId(metadataMain, id)
        );
        metadata = metadata.filter((metadata) => metadata !== undefined);

        let dotspan = utils.createElement('span', `dot`);
          if (record.appears === "no") {
              frameContainer.classList.add("disconnected"),
              dotspan.classList.add("disconnected"),
              frameContainer.classList.add("hidden")}
        frameContainer.append(outerFrame, dotspan)

        if (ids.length > 1) {frameContainer.append(
          utils.createElement('span', `arrow`, '⭢'),
          utils.createElement('div', `corner-sfumato`))
        }

        for (let i = 0; i < ids.length; i++) {
            // Get metadata for the current id
            let currentMetadata = utils.getMetadataFromId(metadataMain, ids[i]);

            if (currentMetadata) {

        let frame_element = createFrameElement(
            currentMetadata.Title,
            `https://gradim.fh-potsdam.de/omeka-s/files/tiny/${ids[i]}.jpg`,
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
}
