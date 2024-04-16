import * as utils from './utils.js';

function createFrameElement(title, url, desc, people, place, status) {
    let frameElement = utils.createElement('div', `frame ${status}`);

    let titleBarElement = utils.createElement('div', 'title-bar');
    titleBarElement.append(
        utils.createElement('span', `dot ${status}`),
        utils.createElement('div', 'title', title)
    );

    let imageElement = document.createElement('img');
    imageElement.src = url;

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

    frameElement.append(titleBarElement, imageElement, metadataLayoutElement);

    return frameElement;
}

export function loadAndDisplayImages(records, metadataMain, parentId) {
    let parentElement = document.getElementById(parentId);
    let fragment = document.createDocumentFragment();

    records.forEach((record) => {
        let shotIndexes = utils.parseShotIndex(record.shot);
        let ids = utils.getIdsFromShots(shotIndexes);
        let metadata = ids.map((id) =>
            utils.getMetadataFromId(metadataMain, id)
        );
        metadata = metadata.filter((metadata) => metadata !== undefined);

        let frame_element = createFrameElement(
            metadata[0].Title,
            `https://gradim.fh-potsdam.de/omeka-s/files/tiny/${ids[0]}.jpg`,
            metadata[0].Description,
            metadata[0].metaDepictedPeople,
            record.place,
            record.appears == 'yes' ? '' : 'disconnected'
        );

        fragment.appendChild(frame_element);
    });

    parentElement.appendChild(fragment);
}
