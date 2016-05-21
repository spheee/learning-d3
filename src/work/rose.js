var length = 8;
var per = 2 * Math.PI / length;
var data = d3.range(length).map(function(i) {
    return {
        innerRadius: 20,
        outerRadius: 200- 15 * (i + 1),
        startAngle: per * i,
        endAngle: per * (i + 1)
    }
});


var width = 400,
    height = 400,
    endAngle = 2 * Math.PI,
    colors = d3.scale.category20();

var svg = d3.select("body").append("svg")
    .attr("class", "pie")
    .attr("height", height)
    .attr("width", width);
//调用弧生成器
var arc=d3.svg.arc();
var arcs=svg.selectAll('path')
.data(data)
.enter()
.append('path')

.attr({
	'transform':'translate(150,200)',
	'fill':function(d,i){return colors(i);}
})
.transition().duration(1000).attrTween('d',function(d){
	console.log(d)
	    var start = {startAngle: 0, endAngle: 0}; // <-A
                var interpolate = d3.interpolate(start, d); // <-B
	return function(t){
return arc(interpolate(t))
	}
})

