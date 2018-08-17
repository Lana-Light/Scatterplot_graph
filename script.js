let req = new XMLHttpRequest();
req.open(
  "GET",
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
  true
);
req.send();
req.onload = function() {
  let json = JSON.parse(req.responseText);
  console.log(json);
  const w = 1000;
  const h = 1000;
  const padding = 100;
  const svg = d3
    .select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(json, d => d.Year - 1), d3.max(json, d => d.Year + 1)])
    .range([padding, w - padding]);
  const ft = d3.timeFormat("%M:%S");
  let date1 = new Date(d3.min(json, d => d.Seconds - 5) * 1000);
  let date2 = new Date(d3.max(json, d => d.Seconds + 5) * 1000);
  const yScale = d3
    .scaleTime()
    .domain([date1, date2])
    .range([padding, h - padding]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d => d);
  const yAxis = d3.axisLeft(yScale).tickFormat(ft);
  let tool = document.querySelector("#tooltip");
  svg
    .append("text")
    .attr("x", padding / 2)
    .attr("y", h / 2)
    .attr("class", "text-y")
    .attr("transform", "rotate(-90,50,500)")
    .text("Time in minutes");
  svg
    .append("foreignObject")
    .attr("x", 200)
    .attr("y", 0)
    .attr("width", 600)
    .attr("height", 60)
    .attr("id", "title")
    .html(
      "<h1>Doping in Professional Bicycle Racing</h1><h2>35 Fastest times up Alpe d'Huez</h2>"
    );
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${h - padding})`)
    .call(xAxis);
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding},0)`)
    .call(yAxis);
  let colorText = [
    ["green", "Without doping use"],
    ["red", "Alleged doping use"]
  ];
  svg
    .selectAll(".dot")
    .data(json)
    .enter()
    .append("circle")
    .attr(
      "class",
      d => (d.Doping ? colorText[1][0] + " dot" : colorText[0][0] + " dot")
    )
    .attr("cx", (d, i) => xScale(d.Year))
    .attr("cy", (d, i) => yScale(new Date(d.Seconds * 1000)))
    .attr("r", 10)
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => new Date(new Date(d.Seconds * 1000)))
    .on("mouseover", function(d) {
      let x = parseInt(this.getAttribute("cx")) + 20;
      let y = parseInt(this.getAttribute("cy")) - 10;
      let html = `${d.Name} : ${d.Nationality}, ${d.Year}; <br> Place: ${
        d.Place
      }, Time: ${d.Time}`;
      if (d.Doping) {
        y -= 15;
        html += ` <br> ${d.Doping}`;
      }
      tool.style.display = "block";
      tool.style.top = y + "px";
      tool.style.left = x + "px";
      tool.setAttribute("data-year", this.getAttribute("data-xvalue"));
      tool.innerHTML = html;
    })
    .on("mouseout", function() {
      tool.style.display = "none";
    });

  let legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(700,100)`);
  legend
    .selectAll("rect")
    .data(colorText)
    .enter()
    .append("rect")
    .attr("x", 150)
    .attr("y", (d, i) => i * 30)
    .attr("width", 20)
    .attr("height", 20)
    .attr("class", d => d[0]);
  legend
    .selectAll("text")
    .data(colorText)
    .enter()
    .append("text")
    .attr("x", 10)
    .attr("y", (d, i) => i * 30 + 15)
    .attr("class", d => d[0])
    .text(d => d[1]);
};
