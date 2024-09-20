queue()
    .defer(d3.csv, 'data/Clusters.csv')
    .await(draw);

var kmeansp, pc;

function draw(error, data) {
    if (error) throw error;

    kmeansp = new kmeansp(data);
    pc = new pc(data);
}
