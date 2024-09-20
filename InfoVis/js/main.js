queue()
    .defer(d3.csv, 'data/AdidasVsNike.csv')
    .await(draw);

var sp, sp2, pc;

function draw(error, data) {
    if (error) throw error;

    sp = new sp(data);
    sp2 = new sp2(data);
    pc = new pc(data);
}
