const data = require("../data/accordion_table.json");

const d3 = require('d3')

var formatNumber = d3.format(".2s"),
    format = function(d) { return "$" + formatNumber(d); };

var first = 0;

  Object.keys(data).forEach(function(d) {
    var href = d.replace(/&/g, "").replace(/,./g, "").replace(/'/g, "").replace(/ /g, "_");

    d3.select("#accordion")
      .append("div")
      .attr("id", `p_${href}`)
      .attr('class', 'recipient')
      .append("h4")
      .attr("href", `#${href}`)
      .text(d);

    var listing = d3.select(`#p_${href}`)
                    .append("div");

    var text = "<table>";

    let displayAwards = data[d].slice(0,5);

    displayAwards.forEach(function(d) {
      text += "<tr><td class='left'>" + d.sponsor + "\t</td>";
      text += "<td class='right'>" + format(d.value) + "</td></tr>";
    });

    if (data[d].length > 5) {
      text += `<tr><td colspan='2'>...and ${data[d].length - 5} more</td></tr>`
    }

    text += "</table>";

    listing.html(text);
    first += 1;
  });