'use strict';
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['d3'], factory);
  } else if (typeof exports === 'object') {
    // CommonJS
    factory(require('d3'));
  } else {
    // Browser globals
    factory(d3);
  }
}(function(d3){

    var _options = {
      width: 1000,
      height: 1000,
      id: 'provinceMap',
      center: [120.498, 29.0918], //映射位置
      scale: 8000 //映射倍数
    };

    var svg = d3.select('body').append('svg')
      .attr('width', _options.width)
      .attr('height', _options.height)
      .attr('id', _options.id)
      // .append('g')
      .attr('transform', 'translate(0,0)');

  var projectionFunc = d3.geo.mercator()
        // .center([107, 31])
        .center([120.498, 29.0918])
        .scale(8000)
        .translate([_options.width / 2, _options.height / 2]);

      var cityPath = d3.geo.path()
        .projection(projectionFunc);


  d3.json('../../map/zhejiang.json', function(error, root) {
    var cityId=[];
    root.features.forEach(function(d,i){
      cityId.push(d.properties.id)
    });
    cityId.forEach(function(d,i){
      d3.json('../../map/geometryCouties/'+d+'00.json',function(e,data){
        var city=svg.append('g').attr('id',function(){
          return d;
        });
        console.log(data)
        var couty=city.selectAll('.couty')
        .data(data.features)
        .enter()
        .append('g')
        .attr('stroke', '#eee')
        .attr('class','couty');
          couty.append('path').attr('d',cityPath)  
           .attr('stroke', '#4999EC')
        .attr('stroke-width', 2)
        .attr('fill', 'steelblue')
        .on('mouseover',function(){
              d3.select(this)
            .attr('fill', '#90deff');
        })
      })
      
      
    })
  })
}));