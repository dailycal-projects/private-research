var d3 = require('d3');

var data = [
    {year: 'FY 2007', industry: 6.438631790744467, other: 93.56136820925553},
    {year: 'FY 2008', industry: 39.77154724818276, other: 60.22845275181724},
    {year: 'FY 2009', industry: 3.2710280373831773, other: 96.72897196261682},
    {year: 'FY 2010', industry: 5.248990578734858, other: 94.75100942126514},
    {year: 'FY 2011', industry: 6.2413314840499305, other: 93.75866851595006},
    {year: 'FY 2012', industry: 5.329593267882188, other: 94.67040673211781},
    {year: 'FY 2013', industry: 6.24113475177305, other: 93.75886524822695},
    {year: 'FY 2014', industry: 3.095558546433378, other: 96.90444145356662},
    {year: 'FY 2015', industry: 5.924855491329479, other: 94.07514450867052},
    {year: 'FY 2016', industry: 9.347181008902076, other: 90.65281899109792},
    {year: 'FY 2017', industry: 8.500590318772137, other: 91.49940968122786}
];

var xData = ["industry", "other"];

var svg = d3.select("#stacked-bar"),
    margin = {top: 20, right: 180, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // var margin = {top: 20, right: 150, bottom: 50, left: 40},
    //     width = 600 - margin.left - marginStacked.right,
    //     height = 500 - margin.top - marginStacked.bottom;
    //
    //
    // var svg = d3.select("#stacked").append("svg")
    //     .attr("width", widthStacked + marginStacked.left + marginStacked.right)
    //     .attr("height", heightStacked + marginStacked.top + marginStacked.bottom)
    //   .append("g")
    //     .attr("transform", "translate(" + marginStacked.left + "," + marginStacked.top + ")");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.3)
    .align(0.3);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal(d3.schemeCategory20);
    // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var stack = d3.stack();

  //data.sort(function(a, b) { return b.total - a.total; });

  x.domain(data.map(function(d) { return d.year; }));
  y.domain([0, 100]);
  z.domain(data.columns.slice(1));

  g.selectAll(".serie")
    .data(stack.keys(data.columns.slice(1))(data))
    .enter().append("g")
      .attr("class", "serie")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.year); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks(10).pop()))
      .attr("dy", "0.35em")
      .attr("text-anchor", "start")
      .attr("fill", "#000")
      .text("Population");

  var legend = g.selectAll(".legend")
    .data(data.columns.slice(1).reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
      .style("font", "10px sans-serif");

  legend.append("rect")
      .attr("x", width + 18)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width + 44)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .text(function(d) { return d; });
