//https://www.d3-graph-gallery.com/graph/interactivity_brush.html

function labcode(data, x_var, y_var, sp_svg, tooltip) {

  //Task 5.1.1  -- Create the x-axis
  var x = d3.scaleLinear().domain([
    d3.min(data, function (d) {
      return +d[x_var];
    }),
    d3.max(data, function (d) {
      return +d[x_var];
    })
  ])
  .range([0, width*0.5]);

  //Task 5.1.2  -- Append the axes to the svg
  var xAxis= sp_svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  //Task 5.1.3  -- Create y-axis
  var y = d3.scaleLinear().domain([
    d3.min(data, function (d) {
      return +d[y_var];
    }),
    d3.max(data, function (d) {
      return +d[y_var];
    })
  ])
  .range([height, 0]);

  // Task 5.1.4 -- Append the axis to svg
  var yAxis = sp_svg.append("g")
  .call(d3.axisLeft(y));

  // Task 5.1.5 -- Append circles to svg
  var myCircles = sp_svg.append("g")
  .selectAll("circle")
  .data(data).enter().append("circle")

    // Task 5.1.6 -- Add attributes to the circles
    myCircles
    .attr("cx", function (d) {
      return x(d[x_var]);
    }) 
    .attr("cy", function(d) {
      return y(d[y_var])
    })
    .attr("r", 6)
    .style("fill", "darkturquoise")
    .style("opacity", "0.3");

  // Task 5.1.7 -- Adding hovering
  hovering(myCircles, tooltip);

  return [x, xAxis, y, yAxis, myCircles];
}

function sp(data) {

  const features = data.columns;
  // Take the second column as default (exclude first column)
  const defaultX = features[1].toString();
  const defaultY = features[1].toString();

  var x_var = defaultX;
  var y_var = defaultY;

  var vars = []
  // skipping the first feature
  for (i = 1; i < features.length; i++) {
    vars.push(features[i])
  }

  var dropDownX = d3.select("#dropdownX")
    .selectAll("myOptions")
    .data(vars)
    .enter()
    .append('option')
    .property("selected", function (d) {
      return d === defaultX;
    })
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  var dropDownY = d3.select("#dropdownY")
    .selectAll("myOptions")
    .data(vars)
    .enter()
    .append('option')
    .property("selected", function (d) {
      return d === defaultY;
    })
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // Original code
  var margin = { top: 10, right: 40, bottom: 10, left: 40 },
    width = $('div.sp-container').width(),
    height = $('div.sp-container').height();

  var sp_svg = d3.select("#sp")
    .append("svg")
    .attr('viewBox', '0 0 ' + (
      width + margin.left + margin.right)
      + ' ' + (height + margin.top + margin.bottom))
    .attr('width', '100%')
    .attr('height', height)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  //Tooltip
  var tooltip = d3.select("#sp").append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  /**
   * Scatter Plot 1 (Here is where your code is used for the first scatter plot)
   */
  var values = labcode(data, x_var, y_var, sp_svg, tooltip);

   /**NECESSARY FUNCTION. DO NOT TOUCH */
  var x = values[0];
  var xAxis = values[1];
  var y = values[2];
  var yAxis = values[3];
  var myCircles = values[4];

  this.selectDot = function (value) {
    //Call focusCircle
    focusCircle(value)
  }

  this.resetSelectDot = function () {
    d3.selectAll("circle")
      .style("fill", "darkturquoise")
      .style("opacity", '0.3')
      .attr('r', 6)
  }


  // A function that update the chart
  function update(selectedX, selectedY) {

    // need to update axes
    x.domain([
      d3.min(data, function (d) { return +d[selectedX]; }),
      d3.max(data, function (d) { return +d[selectedX]; })
    ])
    xAxis
      .transition()
      .duration(400)
      .call(d3.axisBottom(x))

    y.domain([
      d3.min(data, function (d) { return +d[selectedY] }),
      d3.max(data, function (d) { return +d[selectedY] })
    ])
    yAxis
      .transition()
      .duration(400)
      .call(d3.axisLeft(y))

    // Give these new data to update 
    myCircles
      .data(data)
      .transition()
      .duration(400)
      .attr("cx", function (d) { return x(+d[selectedX]); })
      .attr("cy", function (d) { return y(+d[selectedY]); })
  }

  d3.selectAll("#dropdownX, #dropdownY").on("change", function (d) {

    // recover the option that has been chosen
    var selectedOptionX = d3.select("#dropdownX").property("value")
    var selectedOptionY = d3.select("#dropdownY").property("value")
    update(selectedOptionX, selectedOptionY)
  })

}

function hovering(myCircles, tooltip) {
  myCircles.on("mouseover", function (d) {
    focusCircle(d.ProductName)
    pc.selectLine(d.ProductName)
    tooltip
      .style("opacity", 1)
      .html("ProductName: " + d.ProductName)
      .style("left", (d3.mouse(this)[0] + 30) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1] - 40) + "px")

  })
    .on("mouseleave", function (d) {
      pc.resetSelectLine()
      d3.selectAll("circle")
        .style("fill", "darkturquoise")
        .style("opacity", '0.3')
        .attr('r', 6);
      tooltip
        .transition()
        .duration(50)
        .style("opacity", 0)
    })
}

// Original Code
function focusCircle(circle) {
  var d = d3.selectAll("circle");
  d.style("fill", function (d) {
    return d.ProductName == circle ? "deeppink" : 'darkturquoise';
  })
    .style("opacity", function (d) {
      return d.ProductName == circle ? "1.0" : '0.3';
    })
    .attr("r", function (d) {
      return d.ProductName == circle ? 10 : 6;
    })
    .style("stroke-width", function (d) {
      return d.ProductName == circle ? 1 : 0;
    })
}
/**END OF SP*/

function sp2(data) {
  const features = data.columns;

  const defaultX = features[1].toString();
  const defaultY = features[1].toString();

  var x_var = defaultX;
  var y_var = defaultY;

  var vars = []
  // skipping the first feature
  for (i = 1; i < features.length; i++) {
    vars.push(features[i])
  }

  var dropDownX = d3.select("#dropdownX2")
    .selectAll("myOptions")
    .data(vars)
    .enter()
    .append('option')
    .property("selected", function (d) {
      return d === defaultX;
    })
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  var dropDownY = d3.select("#dropdownY2")
    .selectAll("myOptions")
    .data(vars)
    .enter()
    .append('option')
    .property("selected", function (d) {
      return d === defaultY;
    })
    .text(function (d) { return d; }) // text showed in the menu
    .attr("value", function (d) { return d; }) // corresponding value returned by the button

  // Original code
  var margin = { top: 10, right: 40, bottom: 10, left: 40 },
    width = $('div.sp-container').width(),
    height = $('div.sp-container').height();

  var sp_svg = d3.select("#sp2")
    .append("svg")
    .attr('viewBox', '0 0 ' + (
      width + margin.left + margin.right)
      + ' ' + (height + margin.top + margin.bottom))
    .attr('width', '100%')
    .attr('height', height)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  //Tooltip
  var tooltip = d3.select("#sp2").append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  /**
   * Scatter Plot 2 (Here is where your code is used for the second scatter plot)
   */

  var values = labcode(data, x_var, y_var, sp_svg, tooltip);

 /**NECESSARY FUNCTION. DO NOT TOUCH */
  var x = values[0];
  var xAxis = values[1];
  var y = values[2];
  var yAxis = values[3];
  var myCircles = values[4];

  this.selectDot = function (value) {
    //Call focusCircle
    focusCircle(value)
  }

  this.resetSelectDot = function () {
    d3.selectAll("circle")
      .style("fill", "darkturquoise")
      .style("opacity", '0.3')
      .attr('r', 6)
  }

  // New code
  // A function that update the chart
  function update(selectedX, selectedY) {
    // need to update axes
    x.domain([
      d3.min(data, function (d) { return +d[selectedX]; }),
      d3.max(data, function (d) { return +d[selectedX]; })
    ])
    xAxis
      .transition()
      .duration(400)
      .call(d3.axisBottom(x))

    y.domain([
      d3.min(data, function (d) { return +d[selectedY] }),
      d3.max(data, function (d) { return +d[selectedY] })
    ])
    yAxis
      .transition()
      .duration(400)
      .call(d3.axisLeft(y))

    // Give these new data to update 
    myCircles
      .data(data)
      .transition()
      .duration(400)
      .attr("cx", function (d) { return x(+d[selectedX]); })
      .attr("cy", function (d) { return y(+d[selectedY]); })
  }

  d3.selectAll("#dropdownX2, #dropdownY2").on("change", function (d) {
    // recover the option that has been chosen
    var selectedOptionX = d3.select("#dropdownX2").property("value")
    var selectedOptionY = d3.select("#dropdownY2").property("value")
    update(selectedOptionX, selectedOptionY)
  })
}

function focusCircle(circle) {
  var d = d3.selectAll("circle");
  d.style("fill", function (d) {
    return d.ProductName == circle ? "deeppink" : 'darkturquoise';
  })
    .style("opacity", function (d) {
      return d.ProductName == circle ? "1.0" : '0.3';
    })
    .attr("r", function (d) {
      return d.ProductName == circle ? 10 : 6;
    })
    .style("stroke-width", function (d) {
      return d.ProductName == circle ? 1 : 0;
    })
}
/**END OF SP2*/