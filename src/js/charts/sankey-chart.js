var d3 = require('d3');
var d3Sankey = require('../d3-sankey.js');
const industry = require('../../data/industry_1009.json'); //
const other = require('../../data/other_sponsors_1009.json');

function draw() {

  function analyze(error, industry, other) {
    if (error) throw error;
    sankey(industry);

    var links_nonneg = {"links": []};

    industry.links.forEach(function(d) {
      if (d.value > 0) {
        links_nonneg["links"].push(d);
      }
    });

    link = link
      .data(links_nonneg.links)
      .enter().append("path")
        .attr("d", d3Sankey.sankeyLinkHorizontal())
        .attr("stroke-width", function(d) { return Math.max(1, d.width); })
      .on("mouseover", function(){
        tooltip
          .attr("visibility", "visible")
          .style("display", "inline");
      })
      .on("mousemove", function(d) {
        var linkSelect = d3.select(this).style("stroke-opacity", '0.5');
        var source = d.source.name;
        var target = d.target.name;
        var text = `<h4 class='header'>${target}</h4>`;

        text += "<hr> <table>"

        if (source === "Other") {
          if (!other.hasOwnProperty(target)) {
            console.log("So sad. Not found in others.");
          } else {
            var awards = other[target];
            let displayAwards = awards.slice(0,5);
            displayAwards.forEach(function(d) {
              text += "<tr><td class='left'>" + d.sponsor + "\t</td>";
              text += "<td class='right'>" + format(d.value) + "</td></tr>";
            });
            if (awards.length > 5) {
              const remaining = awards.length - 5;
              text += `<tr><td colspan='2'>...and ${remaining} more</td></tr>`
            }
            text += "</table>"
            tooltip.html(text);
          }
        } else {
          text += "<tr><td class='left'>" + source + "\t</td>"
          text += "<td class='right'>" + format(d.value) + "</td></tr>";
          text += "</table>"
          tooltip.html(text);
        }

        tooltip
          .style("top", (d3.event.pageY - 10) + "px")
          .style("left", () => {
            if (d3.event.pageX < pageWidth / 2) {
              return (d3.event.pageX + 10) + "px";
            }
            else {
              return (d3.event.pageX - 300) + "px";
            }
          });
      })
      .on("mouseout", function(d) {
        var linkSelect = d3.select(this).style("stroke-opacity", '0.2');
        tooltip.attr("visibility", "hidden")
                .style("display", "none");
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
          return color[d.type]; });

    const label = node.append("text")
        .attr("x", function(d) { return d.x0 + 20; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text(function(d) {
          if (d.abbrev == "California Institute for Quantitative Biosciences") {
            return "California Institute for Quantitative";
          }
          return d.abbrev; })
        .style("font-weight", "bold")
      .filter(function(d) { return d.x0 < width/2; })
        .attr("x", function(d) { return d.x1 - 20; })
        .attr("text-anchor", "end");

    node.append("text")
        .attr("x", function(d) { return d.x0 + 20; })
        .attr("y", function(d) { return (d.y1 + d.y0) / 2 + 10; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text(function(d) {
          if (d.abbrev == "California Institute for Quantitative Biosciences") {
            return "Biosciences";
          }})
        .style("font-weight", "bold");

    node.append("text")
        .attr("x", function(d) { return d.x0 + 20; })
        .attr("y", function(d) {
          if (d.abbrev == "California Institute for Quantitative Biosciences") {
            return ((d.y1 + d.y0) / 2) + 20;
          }
          return ((d.y1 + d.y0) / 2) + 11; })
        .attr("dy", "0.35em")
        .attr("text-anchor", "start")
        .text(function(d) {
          if (d.cat === d.name) {
            return format(d.with_neg);
          }
          return d.cat + " " + format(d.with_neg); })
        .style("font-weight", "normal")
      .filter(function(d) { return d.x0 < width/2; })
        .attr("x", function(d) { return d.x1 - 20; })
        .attr("text-anchor", "end");
    }

  let containerWidth = $('#sankey-chart').width();
  let pageWidth = $(window).width();

  var margin = {top: 50, right: 180, bottom: 50, left: 180},
      width = containerWidth - margin.left - margin.right;

  if (containerWidth < 980) {
    var height = 3000 - margin.top - margin.bottom;
  } else {
    var height = 4000 - margin.top - margin.bottom;
  }





  //clear previous

  d3.select('#sankey-chart').html('');

  var svg = d3.select("#sankey-chart")
    .append("svg")
    .attr('id', 'full-list')
    .attr('width', containerWidth)
    .attr('height', height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  svg.append('text')
    .attr('x', -5)
    .attr('y', -30)
    .text('Industry sponsor')
    .attr('class', 'header-label')
    .style('text-anchor', 'end')

  svg.append('text')
    .attr('x', width-150)
    .attr('y', -30)
    .attr('class', 'header-label')
    .text('UC Berkeley organization or department');

  svg.append('line')
    .attr('x1', -margin.left)
    .attr('x2', width + margin.right )
    .attr('y1', -15)
    .attr('y2', -15)
    .attr('class', 'header-line')

  var formatNumber = d3.format(".2s"),
      format = function(d) {
        var formatted = "$" + formatNumber(d);
        if (formatted.includes("k")) {
          return formatted.replace('k', 'K');
        }
        return formatted;},
      color = {"sponsors": "#9467BD", "targets": "#AEC7E8"};

  var sankey = d3Sankey.sankey()
    .nodeWidth(15)
      .nodePadding(20)
      .extent([[1, 1], [width, height - 6]]);

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("path");

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("g");

  var tooltip = d3.select("#sankey-chart")
    .append("div")
    .attr('class', 'tooltip')
    .attr("visibility", "hidden");

  analyze(null, industry, other);
}

draw();
$(window).on('resize', draw);
