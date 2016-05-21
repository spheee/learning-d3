var width = 400,
    height = 400,
    endAngle = 2 * Math.PI,
    colors = d3.scale.category20();

var svg = d3.select("body").append("svg")
    .attr("class", "pie")
    .attr("height", height)
    .attr("width", width);

function render(innerRadius) {

    var data = [
        { startAngle: 0, endAngle: 0.1 * endAngle },
        { startAngle: 0.1 * endAngle, endAngle: 0.2 * endAngle },
        { startAngle: 0.2 * endAngle, endAngle: 0.4 * endAngle },
        { startAngle: 0.4 * endAngle, endAngle: 0.6 * endAngle },
        { startAngle: 0.6 * endAngle, endAngle: 0.7 * endAngle },
        { startAngle: 0.7 * endAngle, endAngle: 0.9 * endAngle },
        { startAngle: 0.9 * endAngle, endAngle: endAngle }
    ];

    var arc = d3.svg.arc().outerRadius(150).innerRadius(innerRadius);

    svg.select("g").remove();

    svg.append("g")
        .attr("transform", "translate(200,200)")
        .selectAll("path.arc")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "arc")
        .attr("fill", function(d, i) {
            return colors(i);
        })
        .transition().duration(1000)
        .attrTween("d", function(d) {
            var start = { startAngle: 0, endAngle: 0 }; // <-A
            var interpolate = d3.interpolate(start, d); // <-B
            return function(t) {
                return arc(interpolate(t)); // <-C
            };
        });
}

render(20);
