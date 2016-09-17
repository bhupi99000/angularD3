(function(root){
    'use strict';
    /**
    * Dependencies: [D3.js]
    * Main class to draw all charts using D3
    * */

    /** Config object to set chart configuration
    * {
    *   elm: '<reference of svg element>',
    *   data: <data to draw the chart>,
    *   chartType: <bar, pie, donut, line>
    * }
    */
    function Chart(config){
        var elm = d3.select('#'+config.elm);
        var w = elm.attr('width');
        var h = elm.attr('height');
        var margin = {
            top: config.margin && config.margin.top || 40,
            right: config.margin && config.margin.right || 20,
            bottom: config.margin && config.margin.bottom || 20,
            left: config.margin && config.margin.left || 40
        };
        var width = w - margin.left - margin.right;
        var height = h - margin.top - margin.bottom;

        this.config = {
            elm: elm,
            w: w,
            h: h,
            margin: margin,
            width: width,
            height: height,
            data: config.data,
            chartType: config.chartType
        };

        this.init();
    }


    Chart.prototype = {
        init: function(){
            this.utils = new ChartUtil(this.config);
            this.createBarChart();
        },
        createBarChart: function(){
            var wrapper = this.config.elm
                .append('g')
                .attr({
                    id: 'chartWrapper',
                    transform: 'translate('+this.config.margin.left+', '+this.config.margin.top+')'
                });

            var xAxis = this.utils.getXAxis(this.config.data);
            var yAxis = this.utils.getYAxis(this.config.data);

            wrapper.append('g')
                   .attr({
                       class: 'axis xAxis',
                       transform: 'translate(0,'+(this.config.height)+')'
                   })
                   .call(xAxis);
                
            wrapper.append('g')
                    .attr({
                        class: 'axis yAxis',
                        transform: 'translate(0,0)'
                    })
                    .call(yAxis);

            this.updateBarChart(this.config.data, wrapper);
        },

        updateBarChart: function(data, w){
            var wrapper = w || d3.select('#chartWrapper');

            var xScale = this.utils.getXScale(data);
            var yScale = this.utils.getYScale(data);
            var xAxis = this.utils.getXAxis(data, xScale);
            var yAxis = this.utils.getYAxis(data, yScale);
            var colorScale = this.utils.getColorScale();

            var self = this;

            wrapper.select('g.xAxis')
                    .transition()
                    .duration(500)
                    .ease('bounce')
                    .delay(500)
                    .call(xAxis);

            wrapper.select('g.yAxis')
                    .transition()
                    .duration(500)
                    .ease('bounce')
                    .delay(500)
                    .call(yAxis);

            wrapper.selectAll('rect.bar')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .on('mouseover', function(d, i){
                    var coordinates = d3.mouse(this);
                    self.showTooltip({
                        data: d,
                        scale:{
                            x: xScale,
                            y: yScale
                        },
                        parent: wrapper,
                        pos: coordinates
                    });
                })
                .on('mousemove', function(d, i){
                    var coordinates = d3.mouse(this);
                    self.updateTooltipPos(coordinates);
                })
                .on('mouseout', function(d, i){
                    self.removeTooltip();
                })

            wrapper.selectAll('rect.bar')
                .transition()
                .duration(500)
                .ease('bounce')
                .delay(200)
                .attr({
                    x: function(d, i){
                        return xScale(d.key);
                    },
                    y: function(d, i){
                        return yScale(d.value);
                    },
                    width: function(d, i){
                        return xScale.rangeBand();
                    },
                    height: function(d, i){
                        return self.config.height - yScale(d.value);
                    },
                    fill: function(d, i){
                        return colorScale(i);
                    }
                });

            wrapper.selectAll('rect.bar')
                .data(data)
                .exit()
                .remove();
        },

        updateTooltipPos: function(pos){
            d3.select('g.tooltip-wrap')
                .attr('transform', 'translate('+(pos[0])+','+(pos[1] - 60)+')');
        },

        showTooltip: function(cnf){
            var wrapper = cnf.parent;
            var xScale = cnf.scale.x;
            var yScale = cnf.scale.y;
            var data = cnf.data;

            var tooltipWrap = wrapper.append('g')
                                .classed('tooltip-wrap', true)
                                .attr('transform', 'translate('+(cnf.pos[0])+','+(cnf.pos[1])+')');

            tooltipWrap.append('rect')
                    .attr({
                        class: 'tooltip',
                        x: function(){
                            return 0;
                        },
                        y: function(){
                            return 0;
                        },
                        width: function(){
                            return 100;
                        },
                        height: function(){
                            return 50;
                        },
                        fill: function(){
                            return '#ccc';
                        }
                    });
            
            tooltipWrap.append('text')
                    .attr('class', 'msg')
                    .text(function(){
                        return data.key+' '+data.value;
                    })
        },
        removeTooltip: function(){
            d3.select('.tooltip-wrap').remove();
        }
    };

    function ChartUtil(config){
        this.config = config;
    }

    ChartUtil.prototype.getXScale = function(data){
        var xScale = d3.scale.ordinal()
            .domain(data.map(function(entry){
                return entry.key;
            })).rangeBands([0, this.config.width]);
        return xScale;
    };

    ChartUtil.prototype.getYScale = function(data){
        var min = d3.min(data, function(d, i){
            return d.value;
        });
        var max = d3.max(data, function(d, i){
            return d.value;
        });
        var yScale = d3.scale.linear()
            .domain([min - 20, max + 20])
            .range([this.config.height, 0]);
        return yScale;
    };

    ChartUtil.prototype.getXAxis = function(data, scale){
        var xAxis = d3.svg.axis()
            .scale(scale || this.getXScale(data))
            .orient('bottom');
        return xAxis;
    };

    ChartUtil.prototype.getYAxis = function(data, scale){
        var yAxis = d3.svg.axis()
            .scale(scale || this.getYScale(data))
            .orient('left');
        return yAxis;
    };

    ChartUtil.prototype.getColorScale = function(){
        return d3.scale.category20();
    };


    root.d3Utils = function(config){
        return new Chart(config);
    };

}(window));