var d3 = require('d3');
var d3Sankey = require('../../../dist/js/d3-sankey_test8.js')

/* Tweaked slightly from https://bl.ocks.org/mbostock/7555321 */

var margin = {top: 100, right: 200, bottom: 100, left: 200},
    width = 980 - margin.left - margin.right,
    height = 5000 - margin.top - margin.bottom;

var svg = d3.select("#chart").append("svg")
    .attr("width", width+margin.right+margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left  + "," + margin.top + ")");

svg.attr("viewbox", "0 0 600 550")
    .attr("preserveAspectRatio", "xMidYMid meet");


var formatNumber = d3.format(".2s"),
    format = function(d) { return "$" + formatNumber(d); },
    color = d3.scaleOrdinal(d3.schemeCategory20);

var sankey = d3Sankey.sankey()
  .nodeWidth(15)
    .nodePadding(20)
    .extent([[1, 1], [width - 1, height - 6]]);

var link = svg.append("g")
    .attr("class", "links")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .attr("stroke-opacity", 0.2)
  .selectAll("path");

var node = svg.append("g")
    .attr("class", "nodes")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
  .selectAll("g");

var tooltip = d3.select("#chart")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("color", "white")
  .style("padding", "8px")
  .style("background-color", "rgba(0, 0, 0, 0.75)")
  .style("border-radius", "6px")
  .style("font", "13px sans-serif")
  .style("white-space", "pre")
  .text("tooltip")
  .attr("display", "none");

var order = 1;

d3.queue()
  .defer(d3.json, "../../data/industry_0922.json")
  .defer(d3.json, "../../data/other_sponsors.json")
  .await(analyze);

function analyze (error, industry, other) {
  if (error) throw error;
  console.log(other.hasOwnProperty('Bioengineering'));

  sankey.order(!order);
  sankey(industry);

  link = link
    .data(industry.links)
    .enter().append("path")
      .attr("d", d3Sankey.sankeyLinkHorizontal())
      .attr("stroke-width", function(d) { return Math.max(1, d.width); })
    .on("mouseover", function(){
      tooltip.style("display", "inline");
    })
    .on("mousemove", function(d) {
      var linkSelect = d3.select(this).style("stroke-opacity", '0.5');
      var source = d.source.name;
      var target = d.target.name;


      if (source === "Other") {
        if (!other.hasOwnProperty(target)) {
          console.log("So sad. Not found in others.");
        } else {
          var awards = other[target];
          var text = "<strong>For: " + target + "</strong>\n";
          text += "<table>"
          awards.forEach(function(d) {
            // text += d.sponsor + " " + format(d.value) + "\n";
            text += "<tr>" + "<td>" + d.sponsor + "</td>";
            text += "<td>" + format(d.value) + "</td></tr>";
          });
          text += "</table>"
          tooltip.html(text);
        }
      } else {
        tooltip.html(function() {
          var text = "<strong>For: " + d.target.name + "</strong>\n";
          text += "<table><tr><td>" + d.source.name + "\t"+ "</td>"
          text += "<td>" + format(d.value) +"</td></tr></table>";
          return text;
        });
      }

      tooltip.style("top", (d3.event.pageY-10)+"px")
            .style("left",(d3.event.pageX+10)+"px");
    })
    .on("mouseout", function(d) {
      var linkSelect = d3.select(this).style("stroke-opacity", '0.2');
      tooltip.style("display", "none");
    });

  node = node
    .data(industry.nodes)
    .enter().append("g");

  node.append("rect")
      .attr("x", function(d) { return d.x0; })
      .attr("y", function(d) { return d.y0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("fill", function(d) {
        return color(d.cat); });

  const label = node.append("text")
      .attr("x", function(d) { return d.x0 + 20; })
      .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .text(function(d) { return d.name; }) // d.cat + " " + format(d.value
      .style("font", "12px sans-serif")
      .style("font-weight", "bold")
    .filter(function(d) { return d.x0 < width/2; })
      .attr("x", function(d) { return d.x1 - 20; })
      .attr("text-anchor", "end");

  node.append("text")
      .attr("x", function(d) { return d.x0 + 20; })
      .attr("y", function(d) { return ((d.y1 + d.y0) / 2) + 11; })
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .text(function(d) {
        if (d.cat === d.name) {
          return format(d.value);
        }
        return d.cat + " " + format(d.value); })
      .style("font", "11px sans-serif")
      .style("font-weight", "normal")
    .filter(function(d) { return d.x0 < width/2; })
      .attr("x", function(d) { return d.x1 - 20; })
      .attr("text-anchor", "end");


  };
