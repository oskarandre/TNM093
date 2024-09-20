var height = $('div.pc-container').height() - 20 - 20;
var width  = $('div.pc-container').width() - 20 - 20;

var dimensions = [
  {
    name:"A",
    scale: d3.scaleLinear().range([height,0]), // add .range([0,height]) later
    type: Number
  },
  {
    name:"B",
    scale: d3.scaleLinear().range([height,0]), // add .range([0,height]) later
    type: Number
  },
  {
    name:"C",
    scale: d3.scaleLinear().range([height,0]), // add .range([0,height]) later
    type: Number
  },
  {
    name:"D",
    scale: d3.scaleLinear().range([height,0]), // add .range([0,height]) later
    type: Number
  },
  {
    name:"E",
    scale: d3.scaleLinear().range([height,0]), // add .range([0,height]) later
    type: Number
  }
];
