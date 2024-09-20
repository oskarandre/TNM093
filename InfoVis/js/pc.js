//https://bl.ocks.org/jerdak/5d37e36603bd4397ac51fe5032bcfe3e
//http://bl.ocks.org/mbostock/3709000
//http://plnkr.co/edit/DquAXNv2mbbok7ssNuoX?p=preview&preview

// Static PC
function pc(data) {

	// Set width and height of the chart
	var div = '#pc';
	// var parentWidth = $(div).parent().width();
	var margin = { top: 30, right: 0, bottom: 30, left: 320 },
		width = $('div.pc-container').width(),
		height = $('div.pc-container').height();

	var x = d3.scaleBand().range([0, width]);
	var yAxis = d3.axisLeft();
	var y = {};

	var line = d3.line(),
		foreground,
		background,
		dimensions;

	var extents, origDimensions, dragging = {};

	var pc_svg = d3.selectAll(div)
		.attr('viewBox', '0 0 ' + (
			width + margin.left + margin.right)
			+ ' ' + (height + margin.top + margin.bottom))
		.attr('height', height)
		.attr('width', '100%')
		.attr('preserveAspectRatio', 'none')
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	x.domain(dimensions = d3.keys(data[0]).filter(function (d) {
		return d != "ProductName" && (y[d] = d3.scaleLinear()
			.domain(d3.extent(data, function (p) { return +p[d]; }))
			.range([height, 0]));
	}));

	background = pc_svg.append("g")
		.attr("class", "background")
		.selectAll("path")
		.data(data)
		.enter().append("path")
		.attr("d", path);

	//------------------------------------------------------------------------------------->
	/** Computer Exercise starts here  */
	origDimensions = dimensions.slice(0);
	extents = dimensions.map(function (p) { return [0, 0]; });

	// Task 5.2.1 -- Drawing the Lines
	var foreground = pc_svg
    .append("g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", drawPath);
	// Task 5.2.2 -- Drawing Axes
	var axes = pc_svg.selectAll("dimension")
	.data(dimensions).enter()
	.append("g")
	.attr("class", "dimension axis").attr("transform", function(d){return "translate(" + x(d) + ")";})
	.each(function (d) {
		return d3.select(this).call(yAxis.scale(y[d]));
	  });

	
	// 5.2.3 -- Appending Axes Titles
	  axes
	  .append("text")
	  .attr("text-anchor", "middle").attr("y", -9)
	  .style("fill", "black")
	  .text(function(d){
		return d;
	  });
	  

	// 5.2.4 -- Brushing the axes
	axes
	.append("g")
	.attr("class", "brush")
	.each(function(d){
	  return d3
	  .select(this)
	  .call(perAxisBrush(d));
	})
	.selectAll("rect")
	.attr("x",-8).attr("width",10)
	
	// 5.2.5 -- Dragging the Axes
	axes.call(
		d3
		  .drag()
		  .subject(function (d) {
			return x(d);
		  })
		  .on("start", startDrag)
		  .on("drag", drag)
		  .on("end", endDrag)
	  );

	/** Computer Exercise ends here  */

	/**NECESSARY FUNCTION. DO NOT TOUCH */
	function perAxisBrush(d) {
		return y[d].brush = d3.brushY()
			.extent([[-10, 0], [10, height]])
			.on("brush", brush)
			.on("end", brush)
	}

	function startDrag(d) {
		dragging[d] = x(d);
	}

	function drag(d) {
		dragging[d] = Math.min(width, Math.max(0, d3.event.x));
		foreground.attr("d", drawPath);
		background.attr("d", drawPath);
		dimensions.sort(function (a, b) { return position(a) - position(b); });
		x.domain(dimensions);
		axes.attr("transform", function (d) { return "translate(" + position(d) + ")"; })
	}

	function endDrag(d) {
		delete dragging[d];
		transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
		transition(foreground).attr("d", drawPath);

		var new_extents = [];
		for (var i = 0; i < dimensions.length; ++i) {
			new_extents.push(extents[origDimensions.indexOf(dimensions[i])]);
		}
		extents = new_extents;
		origDimensions = dimensions.slice(0);
	}

	//------------------------------------------------------------------------------------->
	// Returns the path for a given data point.
	function path(d) {
		return line(dimensions.map(function (p) { return [x(p), y[p](d[p])]; }));
	}// End of path

	//------------------------------------------------------------------------------------->
	// Handles a brush event, toggling the display of foreground lines.
	function brush() {
		var actives = [];
		pc_svg.selectAll(".brush")
			.filter(function (d) {
				y[d].brushSelectionValue = d3.brushSelection(this);
				return d3.brushSelection(this);
			})
			.each(function (d) {
				actives.push({
					dimension: d,
					extent: d3.brushSelection(this).map(y[d].invert)
				});
			});

		// Update foreground to only display selected values
		foreground.style("display", function (d) {
			// console.log(d);
			return actives.every(function (active) {
				// console.log(d);
				return active.extent[1] <= d[active.dimension] && d[active.dimension] <= active.extent[0];
			}) ? null : "none";
		});

	}// End of brush

	// Returns the path for a given data point.
	function drawPath(d) {
		return line(dimensions.map(function (p) {
			return [x(p), y[p](d[p])];
		}));
	}

	this.selectLine = function (value){
		d3.select(".foreground").selectAll('path')
		.style("stroke", function (d){
			return d.ProductName == value ? "deeppink" : 'darkturquoise';
		})
		.style("stroke-width", function (d){
			return d.ProductName == value ? "3.0" : '0.3';
		})
		.style("opacity", function (d){
			return d.ProductName == value ? "1.0" : '0.3';
		})
	}

	this.resetSelectLine = function (){
		var l = d3.select(".foreground");
		l.selectAll("path")
		.style("stroke", "darkturquoise")
		.style("stroke-width", '0.4px')
		.style("opacity", '1.0')
	}

	function position(d) {
		var v = dragging[d];
		return v == null ? x(d) : v;
	}

	function transition(axes) {
		return axes.transition().duration(300);
	}
}