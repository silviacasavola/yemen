import * as pages from './pages.js';
import * as images from './images.js';
import * as scroll from './scroll.js';
import * as filter from './scroll.js';
import * as graph from './graph.js';

//////////////////////////////////   MAIN   ///////////////////////////////////

const records = await d3.csv('./data/data.csv');
const pictureMetadata = await d3.csv('./data/YEM_data.csv');
const entities = await d3.json('./data/data.json');
const text = await pages.loadText('./data/text.md');

let textColumn = document.getElementById('text-column');
let picsColumn = document.getElementById('images-column');

await pages.loadAndDisplayPages(text, 'text-container').then(() => {
    graph.setupGraph();
    textReplacement();
    pages.notesindex();
    scroll.attachDotsEventListeners();
});

// await images.loadAndDisplayImages(records, pictureMetadata, 'images-container').then(() => {
//   requestAnimationFrame(() => {
//   images.resizeframes();
// })
// });

await images.loadAndDisplayImages(records, pictureMetadata, 'images-container').then(() => {
  frameReplacement();
  // images.attachArrowEventListeners();
})

textColumn.addEventListener('wheel', scroll.scrollHandler);
picsColumn.addEventListener('wheel', scroll.scrollHandler);
// textColumn.addEventListener('scroll', scroll.scrollHandler);
// picsColumn.addEventListener('scroll', scroll.scrollHandler);

let hiddenContainers;

// images.resizeframes();

////////////////////////////   WORK IN PROGRESS   /////////////////////////////

// function computeNameCombinations(name, surname, extra) {
//     let nameCombinations = [];
//
//     for (let nameVariant of name) {
//         for (let surnameVariant of surname) {
//             for (let extraVariant of extra) {
//                 nameCombinations.push([
//                     surnameVariant,
//                     `${nameVariant} ${surnameVariant}`,
//                     `${surnameVariant} ${nameVariant}`,
//                     `${surnameVariant}, ${nameVariant}`,
//                     extraVariant,
//                     `${extraVariant} ${nameVariant}`,
//                     `${extraVariant} ${surnameVariant}`,
//                     `${extraVariant} ${nameVariant} ${surnameVariant}`
//                 ]);
//             }
//         }
//     }
//
//     nameCombinations = nameCombinations.flat()
//     nameCombinations = nameCombinations.filter((string) => string !== '')
//     nameCombinations = nameCombinations.map((string) => string.trim())
//     nameCombinations = [...new Set(nameCombinations)]
//     nameCombinations = nameCombinations.sort((a, b) => b.length - a.length)
//
//     return nameCombinations;
// }
//
// for (let people of entities.people) {
//     let nameCombinations = computeNameCombinations(people.firstName, people.lastName, people.extra);
//     // console.log(nameCombinations);
//
// }
