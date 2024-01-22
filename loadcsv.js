data = d3.csv("./data_pazzi.csv");

let container = d3.select("#left-side");

data.then(function (data) {
  // Create a container for all frames
  let framesContainer = container.append("div");

  // Iterate through each row in the data
  data.forEach(function (d, i) {
    // Create a frame for each row
    let frame = framesContainer.append("div")

    let phototitle = frame.append("div").attr("class", "photo-title row")
    let firstcol1 = phototitle.append("div").attr("class", "first-col").html("<svg><circle cx='50%' cy='50%' r='50%'></circle></svg>")
    let secondcol = phototitle.append("div").attr("class", "second-col")
    secondcol.append("p").attr("class", "identifier").html(() => d.id)

    // Call generateImageUrls for each entry in the data
    let imageUrls = generateImageUrls(d.shot);

    // If there are multiple URLs, create a Bootstrap carousel
    if (imageUrls.length > 1) {
      // Create a div inside the frame for the carousel
      let carouselDiv = frame.append("div").attr("id", `carousel-${i}`).attr("class", "carousel slide");
      carouselDiv.attr("data-bs-interval", false);

      let carouselInner = carouselDiv.append("div").attr("class", "carousel-inner");

      // Create carousel items based on the generated URLs
      let carouselItems = carouselInner
        .selectAll("div")
        .data(imageUrls)
        .join("div")
        .attr("class", function (url, j) {
        // Check if the image's ID matches d.id, add "active" class if true
        return "carousel-item" + (url === d.id ? " active" : "");
      });

// Update the code here to set the src attribute for each image
carouselItems
  .append("img")
  .attr("class", "d-block w-100")
  .attr("src", function (url) {
    return `https://gradim.fh-potsdam.de/omeka-s/files/small/` + url + `.jpg`;
  })
  .attr("id", function (url) {
    return url;
  })
  .on("error", function () {
    d3.select(this).remove();
  });

      // Add carousel controls
      carouselDiv.append("button").attr("class", "carousel-control-prev").attr("type", "button").attr("data-bs-target", `#carousel-${i}`).attr("data-bs-slide", "prev").html("<span class='carousel-control-prev-icon' aria-hidden='true'></span><span class='visually-hidden'>Previous</span>");
      carouselDiv.append("button").attr("class", "carousel-control-next").attr("type", "button").attr("data-bs-target", `#carousel-${i}`).attr("data-bs-slide", "next").html("<span class='carousel-control-next-icon' aria-hidden='true'></span><span class='visually-hidden'>Next</span>");

      carouselDiv.on("slide.bs.carousel", function (event) {
        console.log("provaprova")
});
    } else {
      // If there's only one URL, create a single img element
      frame
        .append("img")
        .attr("class", "card-img-top")
        .attr("src", function (url) {return `https://gradim.fh-potsdam.de/omeka-s/files/small/` + imageUrls[0] + `.jpg`})
        // .attr("id", function (url) {return imageUrls[0];})
        .attr("id", function (url) {return url;})
        .on("error", function () {
          d3.select(this).remove();
        });
    }

    // Add classes based on the value of d.appears
    if (d.appears === "yes") {
      frame.classed("frame connected", true);
    } else if (d.appears === "no") {
      frame.classed("frame not-connected", true);
    }

    let photodetails = frame.append("div").attr("class", "photo-details row")

    let firstcol2 = photodetails.append("div").attr("class", "first-col")

    let secondcol2 = photodetails.append("div").attr("class", "second-col")
    secondcol2.append("p").html(() => "Date: " + d.date)

    let thirdcol2 = photodetails.append("div").attr("class", "third-col")
    thirdcol2.append("p").html(() => "Place: " + d.place)
  });

  function generateImageUrls(inputString) {
    // Split the input string by spaces to separate folder and shot information
    const parts = inputString.split(" ");

    // Iterate through each part (folder-shot pairs)
    const urls = parts.flatMap((part) => {
      // Extract folder and shots from the part using regular expressions
      const folderMatches = part.match(/(\d+)\(([^)]+)\)/);

      if (folderMatches) {
        const folder = folderMatches[1];
        const shots = folderMatches[2].split(";");

        // Construct URLs for each shot in the folder
        const shotUrls = shots.flatMap((shot) => {
          if (!shot.includes("-")) {
            // If there is no dash, treat it as a single shot
            const paddedNumber = shot.toString().padStart(3, "0");
            const url = `FB_P_YEM_86002_0${folder}_${paddedNumber}`;
            return [url];
          } else {
            // Extract start and end from the range
            const [start, end] = shot.split("-").map((s) => s.trim());

            // Check if start is a valid number
            if (!isNaN(start)) {
              // Generate URLs for all numbers within the range
              const range = Array.from({ length: end - start + 1 }, (_, i) => +start + i);
              return range.map((number) => {
                const paddedNumber = number.toString().padStart(3, "0");
                const url = `FB_P_YEM_86002_0${folder}_${paddedNumber}`;
                return [url];
              });
            }
          }

          // Log invalid format
          console.log(`Invalid format: ${part}`);
          return null; // Handle invalid format if needed
        });

        return shotUrls;
      }

      // Log invalid format
      console.log(`Invalid format: ${part}`);
      return null; // Handle invalid format if needed
    });

    return urls.flat();
  }
})

// document.addEventListener("slid.bs.carousel", function (event) {
//     const carouselId = event.relatedTarget.parentElement.id;
//     const frameId = carouselId.replace("carousel-", "frame-");
//     const activeItemId = d3.select(`#${carouselId} .carousel-item.active img`).attr("id");
//     d3.select(`#${frameId} .photo-description .identifier`).html(() => "Identifier: " + activeItemId);
// });
