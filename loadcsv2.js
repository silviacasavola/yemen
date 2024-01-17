data = d3.csv("./data_pazzi.csv");

let container = d3.select("#left-side");

data.then(function (data) {
  // Create a container for all frames
  let framesContainer = container.append("div");

  // Iterate through each row in the data
  data.forEach(function (d, i) {
    // Create a frame for each row
    let frame = framesContainer
      .append("div")
      .attr("class", "frame" + (i === 0 ? " highlighted" : ""));

    // Call generateImageUrls for each entry in the data
    let imageUrls = generateImageUrls(d.shot);

    // If there are multiple URLs, create a Bootstrap carousel
    if (imageUrls.length > 1) {
      // Create a div inside the frame for the carousel
      let carouselDiv = frame.append("div").attr("id", `carousel-${i}`).attr("class", "carousel slide");

      let carouselInner = carouselDiv.append("div").attr("class", "carousel-inner");

      // Create carousel items based on the generated URLs
      let carouselItems = carouselInner
        .selectAll("div")
        .data(imageUrls)
        .join("div")
        .attr("class", function (_, j) {
          return "carousel-item" + (j === 0 ? " active" : "");
        });

      // Update the code here to set the src attribute for each image
      carouselItems
        .append("img")
        .attr("class", "d-block w-100")
        .attr("src", function (url) {
          return url;
        })
  .attr("id", function (url) {
    // Extract identifier from the URL and use it as the id
    const identifier = extractIdentifier(url);
    return identifier;
  })
        .on("error", function () {
          d3.select(this).remove();
        });


      // Add carousel controls
      carouselDiv.append("button").attr("class", "carousel-control-prev").attr("type", "button").attr("data-bs-target", `#carousel-${i}`).attr("data-bs-slide", "prev").html("<span class='carousel-control-prev-icon' aria-hidden='true'></span><span class='visually-hidden'>Previous</span>");

      carouselDiv.append("button").attr("class", "carousel-control-next").attr("type", "button").attr("data-bs-target", `#carousel-${i}`).attr("data-bs-slide", "next").html("<span class='carousel-control-next-icon' aria-hidden='true'></span><span class='visually-hidden'>Next</span>");

      // Add event listener for slid.bs.carousel event
      carouselDiv.on("slid.bs.carousel", function (event) {
        // Retrieve the identifier of the active item
        const activeItemId = d3.select(`#carousel-${i} .carousel-item.active img`)

        // Update the field inside secondcol with the identifier
        d3.select(`#frame-${i} .photo-description .identifier`).html(() => "Identifier: " + activeItemId);
      });
    } else {
      // If there's only one URL, create a single img element
      frame
        .append("img")
        .attr("class", "card-img-top")
        .attr("src", imageUrls[0]) // Retrieve the URL from generateImageUrls
        .attr("id", function (url) {
  // Extract identifier from the URL and use it as the id
  const identifier = extractIdentifier(imageUrls[0]);
  return identifier;
})
        .on("error", function () {
          d3.select(this).remove();
        });

    }

    let photodetails = frame.append("div")
      .attr("class", "photo-details row")

    let firstcol = photodetails.append("div").attr("class", "photo-pallozzo").html("●")

    let secondcol = photodetails.append("div").attr("class", "photo-description")
    secondcol.append("p").attr("class", "identifier").html(() => d.id)
    secondcol.append("p").html(() => "Date: " + d.date)

    let thirdcol = photodetails.append("div").attr("class", "photo-description")
    thirdcol.append("p").html(() => "Place: " + d.place)
    thirdcol.append("p").html(function(_, i) {return "Index: " + (i+1)})
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
            const identifier = `FB_P_YEM_86002_0${folder}_${paddedNumber}`;
            const url = `https://gradim.fh-potsdam.de/omeka-s/files/small/${identifier}.jpg`;
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
                const identifier = `FB_P_YEM_86002_0${folder}_${paddedNumber}`;
                const url = `https://gradim.fh-potsdam.de/omeka-s/files/small/${identifier}.jpg`;
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

  function extractIdentifier(url) {
    // Extract the identifier from the URL
    const matches = url.match(/FB_P_YEM_86002_\d+_(\d+)\.jpg/);
    if (matches) {
      return matches[1];
    }
    return null;
  }
});
