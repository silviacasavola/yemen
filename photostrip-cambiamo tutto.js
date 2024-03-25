



        let dataPromise1 = d3.csv("./data.csv");
        let container = d3.select("#left-side");

        dataPromise1.then(function (data1) {
          // Create a container for all frames
          let framesContainer = container.append("div");

          // Iterate through each row in the data
          data1.forEach(function (d, i) {
            // Create a frame for each row
            let frame = framesContainer.append("div").attr("class", "frame");

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
                  return "carousel-item" + (url === d.id ? " active" : "");
                });

                let titlerow = carouselItems.append("div").attr("class", "photo-title");
                let pallo = titlerow.append("div").attr("class", "title-col").html("<div class='circle-container'><svg><circle cx='50%' cy='50%' r='48%'></circle></svg></div>");
                let name = titlerow.append("p").attr("class", "title-col")

              carouselItems
                .append("img")
                .attr("class", "d-block w-100")
                .attr("src", function (url) {
                  return `https://gradim.fh-potsdam.de/omeka-s/files/tiny/${url}.jpg`;
                })
                .attr("id", function (url) {
                  return url;
                })
          .on("error", function (event) {
            event.preventDefault(); // Cancel the default error behavior
            d3.select(this.parentNode).remove(); // Remove the parent element containing the image
          });

            let photodetails = carouselItems.append("div").attr("class", "photo-details");
            let descriptioncol = photodetails.append("div").attr("class", "info-col description-col");

              carouselItems.each(function (url) {
                  d3.csv("./assets_data.csv").then(function (data2) {
                      let matchingRow = data2.find(function (row) {
                          return row.Name === url + ".jpg";
                      });

              // name.html(() => (matchingRow ? matchingRow.Name : "N/A"));
              name.html(() => (matchingRow ? matchingRow.Title : "N/A"));
              descriptioncol.html(() => (matchingRow ? matchingRow.Description : "N/A"));

              if (matchingRow && matchingRow.metaDepictedPeople) {
                // Check if 'people-col' already exists
                            let peoplecol = photodetails.select(".people-col");
                            if (peoplecol.empty()) {
                                peoplecol = photodetails.append("div").attr("class", "info-col people-col");
                            }
                            peoplecol.html("People: " + matchingRow.metaDepictedPeople);
                        }
                  });
              });

              let datecol = photodetails.append("div").attr("class", "info-col date-col");
              let placecol = photodetails.append("div").attr("class", "info-col place-col");

              datecol.html(() => "Date: " + d.date);
              placecol.html(() => "Place: " + d.place);

              // Add carousel controls
              carouselDiv.append("button").attr("class", "carousel-control-prev").attr("type", "button").attr("data-bs-target", `#carousel-${i}`).attr("data-bs-slide", "prev").html("<span class='carousel-control-prev-icon' aria-hidden='true'></span><span class='visually-hidden'>Previous</span>");
              carouselDiv.append("button").attr("class", "carousel-control-next").attr("type", "button").attr("data-bs-target", `#carousel-${i}`).attr("data-bs-slide", "next").html("<span class='carousel-control-next-icon' aria-hidden='true'></span><span class='visually-hidden'>Next</span>");

            } else {
              // If there's only one URL, create a single img element

              let titlerow = frame.append("div").attr("class", "photo-title");
              let pallo = titlerow.append("div").attr("class", "title-col").html("<div class='circle-container'><svg><circle cx='50%' cy='50%' r='48%'></circle></svg></div>");
              let name = titlerow.append("p").attr("class", "title-col")

              frame
                .append("img")
                .attr("class", "card-img-top")
                .attr("src", function () {
                  return `https://gradim.fh-potsdam.de/omeka-s/files/tiny/${imageUrls[0]}.jpg`;
                })
                .attr("id", function () {
                  return imageUrls[0];
                })
                .on("error", function () {
                  d3.select(this).remove();
                });

                let photodetails = frame.append("div").attr("class", "photo-details");
                let descriptioncol = photodetails.append("div").attr("class", "info-col description-col");


              // Retrieve data for single photo
              d3.csv("./assets_data.csv").then(function (data2) {
                let matchingRow = data2.find(function (row) {
                  return row.Name === imageUrls[0] + ".jpg";
                });


                name.html(() => (matchingRow ? matchingRow.Title : "N/A"));
                descriptioncol.html(() => (matchingRow ? matchingRow.Description : "N/A"));

                if (matchingRow && matchingRow.metaDepictedPeople) {
                  // Check if 'people-col' already exists
                              let peoplecol = photodetails.select(".people-col");
                              if (peoplecol.empty()) {
                                  peoplecol = photodetails.append("div").attr("class", "info-col people-col");
                              }
                              peoplecol.html("People: " + matchingRow.metaDepictedPeople);
                          }
                    });

                    let datecol = photodetails.append("div").attr("class", "info-col date-col");
                    let placecol = photodetails.append("div").attr("class", "info-col place-col");

                    datecol.html(() => "Date: " + d.date);
                    placecol.html(() => "Place: " + d.place);
            }
              // Add classes based on the value of d.appears
              if (d.appears === "yes") {
                frame.classed("frame connected", true);
              } else if (d.appears === "no") {
                frame.classed("frame not-connected hidden", true)
              }

        allFramesGenerated = true;

    if (allFramesGenerated) {
        frameReplacement();
    }
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
                        return url;
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
        });
