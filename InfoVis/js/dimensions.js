var height = $('div.pc-container').height() - 20 - 20;
var width  = $('div.pc-container').width() - 20 - 20;

var dimensions = [
  {
    name:"Listing Price",
    scale: d3.scaleLinear().range([height,0]), // add .range([0,height]) later
    type: Number
  },
  {
    name:"Sale Price",
    scale: d3.scaleLinear().range([height,0]), // add .range([0,height]) later
    type: Number
  },
  {
    name:"Discount",
    scale: d3.scaleLinear().range([height,0]), // add .range([0,height]) later
    type: Number
  },
  {
    name:"Brand (Adidas=1 Nike=2)",
    scale: d3.scaleLinear().range([height,0]), // add .range([0,height]) later
    type: Number
  },
  {
    name:"Rating",
    scale: d3.scaleLinear().range([height,0]), // add .range([0,height]) later
    type: Number
  },
  {
    name:"Reviews",
    scale: d3.scaleLinear().range([height,0]), // add .range([0,height]) later
    type: Number
  }
];
