import * as utils from './utils.js';

function createFrameElement(title, url, desc, people, place, status) {
    let frameElement = utils.createElement('div', `frame ${status}`);

    let titleBarElement = utils.createElement('div', 'title-bar');
      titleBarElement.append(
        utils.createElement('span', `dot ${status}`),
        utils.createElement('div', 'title', title)
      );

    let imageContainer = utils.createElement('div', `img-container`);
    let imageElement = document.createElement('img');
    imageElement.src = url;
    imageContainer.append(imageElement)

    let descriptionrow;
    let placerow;
    let peoplerow;

    let metadataLayoutElement = utils.createElement('div', 'metadata-layout');
    metadataLayoutElement.append(
        descriptionrow = utils.createElement('div', 'description metadata-row'),
        placerow = utils.createElement('div', 'place metadata-row'),
        peoplerow = utils.createElement('div', 'people metadata-row')
    );

    descriptionrow.append(
        utils.createElement('div', 'metadata-cell', 'DESCRIPTION: '),
        utils.createElement('div', 'metadata-cell', desc)
      );

    placerow.append(
        utils.createElement('div', 'metadata-cell', 'PLACE: '),
        utils.createElement('div', 'metadata-cell', place)
      );

    peoplerow.append(
        utils.createElement('div', 'metadata-cell', 'PEOPLE: '),
        utils.createElement('div', 'metadata-cell', people)
      );

    frameElement.append(titleBarElement, imageContainer, metadataLayoutElement);

    return frameElement;
}

export function loadAndDisplayImages(records, metadataMain, parentId) {
    let parentElement = document.getElementById(parentId);
    let fragment = document.createDocumentFragment();

    records.forEach((record) => {
        let outerFrame = utils.createElement('div', 'outer-frame scrollactivator');

        let shotIndexes = utils.parseShotIndex(record.shot);
        let ids = utils.getIdsFromShots(shotIndexes);

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

        fragment.appendChild(outerFrame);
    });

    parentElement.appendChild(fragment);
}
