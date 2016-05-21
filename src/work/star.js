var data = d3.range(0, 2 * Math.PI, .01).map(function(t) {
    return [t, Math.sin(2 * t) * Math.cos(2 * t)];
});
var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2 - 80;

var r = d3.scale.linear().domain([0, .5]).range([0, radius]);

var line = d3.svg.line.radial()
    .radius(function(d) {
        return r(d[1]);
    })
    .angle(function(d) {
        return -d[0] + Math.PI / 2;
    });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var gr = svg.append("g")
    .attr("class", "r axis")
    .selectAll("g")
    .data(r.ticks(5).slice(1))
    .enter().append("g");

gr.append("circle")
    .attr("r", r);

// gr.append("text")
//     .attr("y", function(d) { return -r(d) - 4; })
//     .attr("transform", "rotate(15)")
//     .style("text-anchor", "middle")
//     .text(function(d) { return d; });

var defs = svg.append('defs');
var filter = defs.append("filter").attr({
    id: 'f1',
    x: 0,
    y: 0,
    width: '200%',
    height: '200%'
});
filter.append('feOffset').attr({
    result: 'offOut',
    in : 'SourceGraphic',
    dx: '5',
    dy: '5'
});
filter.append('feColorMatrix').attr({
    result: 'matrixOut',
    in : 'offOut',
    type: 'matrix',
    values: '0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0'
});
filter.append('feGaussianBlur').attr({
    result: 'blurOut',
    in : 'matrixOut',
    stdDeviation: '10',
})
filter.append('feBlend').attr({ in : "SourceGraphic",
    in2: "blurOut",
    mode: "normal"
})





var ga = svg.append("g")
    .attr("class", "a axis")
    .selectAll("g")
    // .data(d3.range(0, 360, 30))
    .data(d3.range(0, 360, 72))

.enter().append("g")



// ga.append("line")
// .attr("x2", radius);


ga.append("circle")
    .attr("cx", radius)
    .attr({ r: 50, fill: 'red', stroke: 'red', cursor: 'pointer' })
    .on('mouseenter', function() {
        d3.select(this).attr('fill', 'yellow')
    })
    .on('mouseleave', function() {
        d3.select(this).attr('fill', 'red')
    })
    .on('click', function(d) {
        // alert(d)
    });

var textArr = ['远程提讯', '视频会议', '执行指挥', '远程接访', '安防监控'];
ga.append("text")
    .attr("x", radius - 25)
    .attr("dy", ".35em")
    // .style("text-anchor", function(d) { return d < 270 && d > 90 ? "end" : null; })
    // .attr("transform", function(d) { return d < 270 && d > 90 ? "rotate(180 " + (radius + 6) + ",0)" : null; })
    .attr("transform", function(d) {
        return "rotate(" + (d) + " " + (radius) + ",0)"

    })
    .text(function(d, i) {
        return textArr[i];
    });
// .attr("transform", function(d) { return d < 270 && d > 90 ? "rotate(180 " + (radius + 6) + ",0)" : null; })
// ga.transition().duration(2000).attr("transform",function(d){
//         return "rotate(" + -(d-72) + ")";
// });

ga.transition().duration(500).attr("transform", function(d) {
    console.log(d)
    return "rotate(" + -d + ")";
}).attr({ filter: "url(#f1)" })

var i = 0;
setTimeout(function(){
	(function tick() {
    i++;
    if (i >= 5) i = 0;

    ga.each(function(d) {
            console.log(d)
        })
        .data(angleCalc(i))
        .transition()
        .ease("cubic-in-out")
        .duration(5000)
        .attr("transform", function(d) {

            return "rotate(" + -d + ")"
        })
        .each(function(){
        	d3.select(this).transition().select('text').attr('transform',function(d){
        		// console.log
        		return "rotate(" + (d) + " " + (radius) + ",0)"
        	})
        })
        // console.log(i)


    setTimeout(tick, 5000 - Date.now() % 1000)
})();

},1000)

function angleCalc(count) {
    //计算当前轮回
    return d3.range(0 + 72 * count, 360 + 72 * count, 72)
}


// svg.append("path")
//     .datum(data)
//     .attr("class", "line")
//     .attr("d", line);
