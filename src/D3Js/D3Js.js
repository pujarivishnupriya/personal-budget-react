import React from "react";
import * as d3 from "d3";
import axios from "axios";
import './D3Js.scss';


function D3Js() {
    return (
        <>
        {getDataForD3()}
        </>
    );
}

var svg = null;

function ClearChart() {
    
    var c = document.getElementById("chart");
    c.innerHTML = '';
}

var d3pieData = {
    titles: [],
    values: []
};

function getDataForD3() {
    axios.get('http://localhost:3005/budget')
        .then(function (res) {
            for (var i = 0; i < res.data.myBudget.length; i++) {
                d3pieData.titles[i] = res.data.myBudget[i].title;
                d3pieData.values[i] = res.data.myBudget[i].budget;
            }
            ClearChart();
            createD3Chart(getData());
        });
}

function getData() {
    var mappings = [];
    for (var i = 0; i < d3pieData.titles.length; i++) {
        mappings[i] = { label: d3pieData.titles[i], value: d3pieData.values[i] };
    }
    return mappings;
}

const key = function (d) { return d.data.label; };

function createD3Chart(data) {
    //declarations
    const width = 600,
        height = 325,
        radius = Math.min(width, height) / 2;

    const arc = d3.arc()
        .outerRadius(radius * 0.7)
        .innerRadius(radius * 0.4);

    const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");
        
    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append("g")
        .attr("id", "slices")
    svg.append("g")
        .attr("id", "labels")
    svg.append("g")
        .attr("id", "lines");

    const pie = d3.pie()
        .value(function (d) {
            return d.value;
        });

    const color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(d3pieData.titles);


    const slice = svg.select("#slices").selectAll("path.slice")
        .data(pie(data), key);

    slice.enter()
        .insert("path")
        .style("fill", function (d) { return color(d.data.label); })
        .attr("className", "slice")
        .transition()
        .attrTween("d", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                return arc(interpolate(t));
            };
        })

    slice.exit()
    .remove();

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    const text = svg.select("#labels").selectAll("text")
        .data(pie(data), key);

    text.enter()
        .append("text")
        .attr("dy", ".35em")
        .text(function (d) {
            return d.data.label;
        })
        .style('text-anchor','middle')
        .transition()
        .attrTween("transform", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate(" + pos + ")";
            };
        })
        .styleTween("text-anchor", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start" : "end";
            };
        });

    text.exit()
    .remove();

    var polyline = svg.select("#lines").selectAll("polyline")
        .data(pie(data), key);

    polyline.enter()
        .append("polyline")
        .transition()
        .attrTween("points", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
        });

    polyline.exit()
    .remove();
}

export default D3Js;


