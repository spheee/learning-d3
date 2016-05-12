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
}(function(d3) {
  //拓展方法
  if (typeof Object.assign !== 'function') {
    (function() {
      Object.assign = function(target) {
        if (target === undefined || target === null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];
          if (source !== undefined && source !== null) {
            for (var nextKey in source) {
              if (source.hasOwnProperty(nextKey)) {
                output[nextKey] = source[nextKey];
              }
            }
          }
        }
        return output;
      };
    })();
  }

  String.prototype.rmSpec = function() {
    return this.replace(/\u5e02|\u533a|\u53bf/g, '');
  };

  function BtnWidget(options) {
    var btnWidget = {};
    //原装样式
    var backBtnWidth = 100;
    var backBtnHeight = 25;

    var _style = {
      width: backBtnWidth,
      height: '30',
      rx: '5',
      ry: '3',
      fill: 'steelblue',
      'stroke-width': '2',
      stroke: '#81C0D9'
    };
    var _text = '返回';
    if (options !== undefined) {
      if (options.styles !== undefined) {
        //options作为对象
        if (typeof options.styles === 'object') {
          //合并到原生对象上
          _style = Object.assign({}, options.styles, _style);
        }
      }
      if (options.text !== undefined) {
        _text = options.text;
      }
    }

    btnWidget.selection = '#provinceMap';
    btnWidget.render = function(selection) {
      if (!selection) {
        selection = btnWidget.selection;
      }
      //选中容器
      var svg = d3.select(selection);

      var ro = svg.node().getBoundingClientRect();
      var Top = ro.top;
      var Bottom = ro.bottom;
      var Left = ro.left;
      var Right = ro.right;
      var Width = ro.width || Right - Left;
      var Height = ro.height || Bottom - Top;


      var btn = svg.append('g')
        .attr('cursor', 'pointer')
        .attr('transform', function() {
          return 'translate(' + (Width - 2 * backBtnWidth) + ',10)';
        })
        .on('click', function(e) {
          //   if (callback != undefined && typeof (callback) == 'function') {
          //     callback.call();
          //   }

          svg.selectAll('g').remove();
          renderProvince();
        });

      btn.append('rect')
        .attr(_style);
      btn.append('text')
        .attr({
          'x': backBtnWidth / 2,
          'y': 20
        })
        .style({
          'font-weight': 'bold',
          'font-size': '14',
          'fill': '#70A4C4',
          // 'stroke': '#000',
          'text-anchor': 'middle'
        })
        .text(_text);
    };
    return btnWidget;
  }

  function renderCity(city) {

    d3.json('../../map/geometryCouties/' + city.id + '00.json', function(error, data) {
      if (error)
        return console.error(error);

      var cityCache = svg.select('.cities').remove();

      var btn = new BtnWidget();
      btn.render();


      var projectionCityFunc = d3.geo.mercator()
        // .center([107, 31])
        .center(city.cp)
        .scale(12000)
        .translate([self.options.width / 2, self.options.height / 2]);

      var coutiesPath = d3.geo.path()
        .projection(projectionCityFunc);


      var county = svg.append('g').attr('class', 'counties')
      var couties = county.selectAll('.county')
        .data(data.features)
        .enter()
        .append('g')
        .attr('class', 'county')

      couties.append('path')
        .attr('d', coutiesPath)
        .attr('stroke', '#4999EC')
        .attr('stroke-width', 2)
        .attr('fill', 'steelblue')
        .on('mouseover', function(d, i) {
          d3.select(this)
            .attr('fill', '#90deff');
        })
        .on('mouseout', function() {
          d3.select(this)
            .attr('fill', 'steelblue');
        })

      couties.append('text')
        .attr('transform', function(d) {
          return 'translate(' + coutiesPath.centroid(d) + ')'
        })
        .style({
          'font-weight': 'bold',
          'font-size': '12',
          // 'stroke': '#000',
          'text-anchor': 'middle'
        })
        .text(function(d) {
          return d.properties['name']
        })




    })
  }

  //渲染热度
  function RenderHeat() {

    //值域
    var maxvalue = 1500;
    var minvalue = 0;
    //定义一个线性比例尺，将最小值和最大值之间的值映射到[0, 1]
    var linear = d3.scale.linear()
      .domain([minvalue, maxvalue])
      .range([0, 1]);
    //定义最小值和最大值对应的颜色
    //var a = d3.rgb(0,255,255);	//浅蓝色
    //var b = d3.rgb(0,0,255);	//蓝色
    var a = '#5fd7ff';
    var b = '#145582';
    //颜色插值函数
    var computeColor = d3.interpolate(a, b);

    return {
      linear: linear,
      computeColor: computeColor
    }
  }

  function ProvinceMap(options) {

    var _options = {
      width: 1000,
      height: 1000,
      id: 'provinceMap',
      center: [120.498, 29.0918], //映射位置
      scale: 8000 //映射倍数
    };
    this.options = this.options || {};
    Object.assign(this.options, _options);
    if (options !== undefined && typeof options === 'object') {
      Object.assign(this.options, options);
    }


  }
  ProvinceMap.prototype.init = function() {
    //这里就可以插入参数
    //渲染svg
    var self = this;
    var svg = d3.select('body').append('svg')
      .attr('width', self.options.width)
      .attr('height', self.options.height)
      .attr('id', self.options.id)
      // .append('g')
      .attr('transform', 'translate(0,0)');

    function renderProvince() {
      //投影函数
      var projectionFunc = d3.geo.mercator()
        // .center([107, 31])
        .center([120.498, 29.0918])
        .scale(8000)
        .translate([self.options.width / 2, self.options.height / 2]);

      var cityPath = d3.geo.path()
        .projection(projectionFunc);
        //var color = d3.scale.category20();

      //构造提示框
      var tooltip = d3.selectAll('.tooltip');
      if (tooltip.node() === null || tooltip.node() === undefined) {
        tooltip = d3.select('body')
          .append('div')
          .attr('class', 'tooltip')
          // .html('默认的提示框内容<br />换个行')
          .style('opacity', 0.0);

        tooltip.append('i').attr('class', 'top-left');
        tooltip.append('i').attr('class', 'top-right');
        tooltip.append('i').attr('class', 'bottom-left');
        tooltip.append('i').attr('class', 'bottom-right');
        tooltip.append('div').attr('class', 'container');
      }


      //请求地图信息
      d3.json('../../map/zhejiang.json', function(error, root) {

        if (error)
          return console.error('没有获得地图');
        // console.log(root.features);
        //包裹容器
        var city = svg.append('g')
          .attr('class', 'cities');

          console.log(root.features)
        //偏移排序
        root.features.sort(function(a, b) {

          if (parseInt(a.properties.id) > parseInt(b.properties.id)) {
            return 1;
          }
          if (parseInt(a.properties.id) < parseInt(b.properties.id)) {
            return -1;
          }
          return 0;
        });

        //中值点
        var midPoint = [500, 500];
        //寻找偏移点
        root.features.forEach(function(d, i) {
          //连接点 贝塞尔曲线控制点
          var connectPoint,
            controlPoint;
          var _x = projectionFunc(d.properties.cp)[0];
          var _y = projectionFunc(d.properties.cp)[1];

          if (_x > 200 && _x <= midPoint[0]) {
            if (_y > 200 && _y <= midPoint[1]) {
              connectPoint = [200, 200];
            } else {
              connectPoint = [200, 800];
            }
          } else if (_x > midPoint[0] && _x <= 800) {
            if (_y > 200 && _y <= midPoint[1]) {
              connectPoint = [800, 200];
            } else {
              connectPoint = [800, 800];
            }
          }
          if (Math.abs((_x - midPoint[0]) / (_y - midPoint[1])) > 1) {
            controlPoint = [connectPoint[0], _y];
          } else {
            controlPoint = [_x, connectPoint[1]];
          }
          d.properties._connectPoint = connectPoint;
          d.properties._controlPoint = controlPoint;
        });

        //使用setTimeout来做计时器哦
        var timer = {
          i: 0,
          tie: '',
          interval: function(func, wait) {
            var self = this;
            var interv = function() {
              func.call(null);

              self.tie = setTimeout(interv, wait);
            };

            self.tie = setTimeout(interv, wait);
          },
          startTimer: function() {
            var self = this,
              prevOver,
              currentOver;
            this.interval(function() {
              if (self.i - 1 >= 0) {
                prevOver = d3.selectAll('.city')[0][self.i - 1];
                d3.select(prevOver).classed('autofire', false);
                prevOver.__onmouseout();

              } else if (self.i === 0) {
                prevOver = d3.selectAll('.city')[0][root.features.length - 1];
                d3.select(prevOver).classed('autofire', false);
                prevOver.__onmouseout();

              }
              currentOver = d3.selectAll('.city')[0][self.i];
              d3.select(currentOver).classed('autofire', true);

              currentOver.__onmouseover();
              self.i++;
              if (self.i >= root.features.length) {
                self.i = 0;
              }
            }, 2000);
          },
          clearTimer: function() {
            clearTimeout(this.tie);
          }
        };
        timer.startTimer();

        //染色方法
        function fill(self, fill) {
          self.style('fill', fill);
        }
        //测试四个染色点
        // var anchorArr = ['lefttop', 'leftbottom', 'righttop', 'rightbottom']
        // var anchor = city.append('g').attr('class', 'anchor').selectAll('.anchorr')
        //   .data(anchorArr)
        //   .enter()
        //   .append('circle')
        //   .attr('class', function(d) {
        //     return d
        //   })


        //渲染每个城市path
        var cities = city.selectAll('.city')
          .data(root.features)
          .enter()
          .append('g')
          .attr('class', 'city')
          .attr('cursor', 'pointer')
          .attr('id', function(d) {
            return d.properties.id;
          })
          .on('mouseover', function(d) {
            // debugger

            if (d3.event !== undefined && d3.event.type === 'mouseover') {
              timer.clearTimer();
            }
            //暂停之后去除autofire
            var autofire = d3.select('.autofire').node();
            if (autofire !== null) {
              autofire.__onmouseout();
            }

            d3.select('.tooltip-link').select('.tooltip-line-' + d.properties.id).transition().duration(200).style({
              'stroke-width': '2px'
            });

            tooltip
              .select('.container').html('哈哈哈提示框<br />换行吗<br />这是' + d.properties.name);

            //   .style('left', (d3.event.pageX) + 'px')
            //   .style('top', (d3.event.pageY + 20) + 'px')
            var currentHeight = parseInt(tooltip.style('height')),
              currentWidth = parseInt(tooltip.style('width'));
            tooltip
              .style('left', (d.properties._connectPoint[0] + 10 - currentWidth / 2) + 'px')
              .style('top', (d.properties._connectPoint[1] + 5 - currentHeight / 2) + 'px')
              .style('opacity', 1.0);

            // d3.select(this).select('path').transition().duration(200).call(fill, '#90deff');
            // debugger
            d3.select(this).select('path').transition().duration(500).attr('fill', '#90deff');
            //todo:这里有问题
            d3.select(this).select('g').classed('on', true);

          })
          //   .on('mousemove', function(d) {
          //     /* 鼠标移动时，更改样式 left 和 top 来改变提示框的位置 */
          //     var currentHeight = parseInt(tooltip.style('height')),
          //       currentWidth = parseInt(tooltip.style('width'));
          //     tooltip
          //       .style('left', (d.properties['_connectPoint'][0]) + 'px')
          //       .style('top', (d.properties['_connectPoint'][1] + 20 - currentHeight * 3 / 4) + 'px')
          //       .style('opacity', 1.0)
          //
          //   //   .style('left', (d3.event.pageX) + 'px')
          //   //   .style('top', (d3.event.pageY + 20) + 'px');
          //   })
          .on('mouseout', function(d, i) {

            if (d3.event !== undefined && d3.event.type === 'mouseout') {
              timer.startTimer();
            }
            d3.select('.tooltip-link').select('.tooltip-line-' + d.properties.id).transition().duration(200).style({
              'stroke-width': '0px'
            });
            tooltip.style('opacity', 0.0);
            d3.select(this).select('path').transition().duration(500).attr('fill', function(d, i) {
              return d.properties._prevColor;
            });
            d3.select(this).select('g').classed('on', false);
          // timer.startTimer();
          });
        // 热度尺子
        var heatRuler = RenderHeat();
        var heat = {};
        heat['湖州'] = '500';
        heat['杭州'] = '1500';
        heat['温州'] = '800';
        heat['舟山'] = '400';
        heat['宁波'] = '600';
        heat['台州'] = '300';
        heat['丽水'] = '100';
        heat['衢州'] = '440';
        heat['金华'] = '770';
        heat['绍兴'] = '1230';
        heat['嘉兴'] = '1110';
        //绘边
        cities.append('path')
          .attr('d', cityPath)
          .attr('stroke', '#4999EC')
          .attr('stroke-width', 2)
          .attr('fill', function(d, i) {
            var t = heatRuler.linear(heat[d.properties.name.rmSpec()]);
            var color = heatRuler.computeColor(t);
            // debugger
            d.properties._prevColor = color;
            return color.toString();
          })

          .on('click', function(d, i) {
            // alert('当前点击的是'+d.properties['name'])
            // timer.clearTimer();
            renderCity(d.properties);
            // svg.style('display', 'none');
            tooltip.style('display', 'none');
          });



        //绘地标
        var radTypes = ['inner', 'middle', 'outer'];

        var rad = cities.append('g')
          .attr('transform', function(d) {
            return 'translate(' + (projectionFunc(d.properties.cp)[0] - 30) + ',' + (projectionFunc(d.properties.cp)[1] - 60) + ')';
          })
          .attr('class', 'rad');

        var circles = rad.selectAll('circle')
          .data(radTypes)
          .enter()
          .append('circle')
          .attr('class', function(d) {
            return d;
          });
        rad.append('path')
          .attr('d', 'M26.000,49.000 C26.000,49.000 15.000,37.075 15.000,31.000 C15.000,24.925 19.925,20.000 26.000,20.000 C32.075,20.000 37.000,24.925 37.000,31.000 C37.000,37.075 26.000,49.000 26.000,49.000 ZM26.000,27.000 C23.791,27.000 22.000,28.791 22.000,31.000 C22.000,33.209 23.791,35.000 26.000,35.000 C28.209,35.000 30.000,33.209 30.000,31.000 C30.000,28.791 28.209,27.000 26.000,27.000 Z')
          .attr('class', 'location')
          .attr('fill', '#f05c32');

        //绘文字
        cities.append('text')
          .attr('x', function(d) {
            return projectionFunc(d.properties.cp)[0];
          })
          .attr('y', function(d) {
            return projectionFunc(d.properties.cp)[1] + 20;
          })
          .style({
            'font-weight': 'bold',
            'font-size': '12',
            // 'stroke': '#000',
            'text-anchor': 'middle'
          })
          .text(function(d) {
            return d.properties.name.rmSpec();
          });


        //新建一个tooltip-link层
        city.append('g').attr('class', 'tooltip-link')
          .selectAll('path')
          .data(root.features)
          .enter()
          .append('path')
          .attr('class', function(d) {
            return 'tooltip-line-' + d.properties.id;
          })
          .attr('d', function(d, i) {
            // debugger
            //绘制链接线
            var linkPath = [];
            linkPath.push('M');
            linkPath.push(projectionFunc(d.properties.cp));
            linkPath.push('Q');
            linkPath.push(d.properties._controlPoint);
            linkPath.push(d.properties._connectPoint);
            console.log(linkPath.join(' '));
            return linkPath.join(' ');
          })
          .attr('fill', 'none')
          .style({
            'stroke': 'steelblue',
            'stroke-width': '0px'
          })
          .on('mouseover', function() {});


      });

    }

    renderProvince();

  };

  window.ProvinceMap = ProvinceMap;

}));
