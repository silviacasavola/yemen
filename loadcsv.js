data = d3.csv("./data.csv")

let container = d3.select("#left-side");

data.then(function(data) {
  let frame = container.selectAll("div")
  .data(data)
  .join("div")
  // .attr("class", "frame")
  .attr("class", function(_, i) { return "frame" + (i === 0 ? ' highlighted' : ''); }) // Add 'highlighted' class to the first frame

  // .attr("id", function(_, i) {"frame-" + (i+1)})

  frame.append("img")
  .attr("class", "card-img-top")
  .attr("src", function(d) {
    let path = "https://gradim.fh-potsdam.de/omeka-s/files/tiny/" + d.id + ".jpg";
      return path;
      console.log(path + filename)
  })

  let photodetails = frame.append("div")
  .attr("class", "photo-details row")

  let firstcol = photodetails.append("div")
  .attr("class", "photo-pallozzo")
  .html("●")


  let secondcol = photodetails.append("div")
  .attr("class", "photo-description")
  secondcol.append("p").html(function(d) {return d.id})
  secondcol.append("p").html(function(d) {return "Date: " + d.date})


  let thirdcol = photodetails.append("div")
  .attr("class", "photo-description")
  thirdcol.append("p").html(function(d) {return "Place: " + d.place})
  thirdcol.append("p").html(function(_, i) {return "Index: " + (i+1)})
})
