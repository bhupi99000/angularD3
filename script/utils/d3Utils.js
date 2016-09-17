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
            top: config.margin && config.margin.top || 80,
            right: config.margin && config.margin.right || 20,
            bottom: config.margin && config.margin.bottom || 20,
            left: config.margin && config.margin.left || 80
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
                       transform: 'translate(0,0)'
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
                .attr('class', 'bar');

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