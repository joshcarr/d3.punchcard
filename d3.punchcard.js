// adapted from
// http://jeybalachandran.com/posts/San-Francisco-Caltrain-Punchcard/
// https://github.com/jeyb/d3.punchcard

function Punchcard( options ) {
  
  // Reverse the data as we draw
  // from the bottom up.
  this.data = options.data.reverse();
  this.element = options.element;

  // Find the max value to normalize the size of the circles.
  this.max = d3.max( this.data , function(array) {

    // we ignore the first element as it is metadata
    return d3.max(array.slice(1), function ( obj ) {

      // and we only return the interger verion of the value, not the key
      return parseInt(obj.value, 10);
    });
  });

  return this;
}

Punchcard.prototype.draw = function( options ){

  var _this = this,
      margin = 10,
      lineHeight = 5,
      width = options.width,
      paneLeft = 80,
      paneRight = width - paneLeft,
      sectionHeight = 50,
      height = ( sectionHeight * this.data.length ),
      sectionWidth = paneRight / this.data[0].length,
      circleRadius = 20,
      x,
      y,
      punchcard,
      punchcardRow;

  // X-Axis.
  x = d3.scale.linear().domain([0, this.data[0].length-1]).
    range([ paneLeft + (sectionWidth / 2) , paneRight + (sectionWidth / 2)]);

  // Y-Axis.
  y = d3.scale.linear().domain([0, this.data.length-1]).
    range([0, height - sectionHeight]);

  // The main SVG element.
  punchcard = d3.select(this.element)
    .html('')
    .append('svg')
      .attr('width', width )
      .attr('height', height + (margin*3))
      .append('g');

  // create row divinding lines 
  punchcard.
    append('g').
    selectAll('line').
    data(this.data).
    enter().
    append('line').
    attr('x1', 0).
    attr('x2', width).
    attr('y1', function (d, i) {
      return height - y(i);
    }).
    attr('y2', function (d, i) {
      return height - y(i);
    }).
    style('stroke-width', 1).
    style('stroke', '#efefef');

  // create row headers
  punchcard.
    append('g').
    selectAll('.rule').
    data(this.data).
    enter().
    append('text').
    attr('x', 0).
    attr('y', function (d, i) {
      return height - y(i) - (sectionHeight/2) + lineHeight;
    }).
    attr('text-anchor', 'left').
    text(function (d, i) {
      return d[0].value;
    });

  // create x-axis ticks
  punchcard.
    append('g').
    selectAll('line').
    data(this.data[0].slice(1)).
    enter().
    append('line').
    attr('x1', function(d,i) { return paneLeft  + x(i); }).
    attr('x2', function(d,i) { return paneLeft  + x(i); }).
    attr('y1', function (d, i) {
      return height + margin;
    }).
    attr('y2', function (d, i) {
      return height;
    }).
    style('stroke-width', 1).
    style('stroke', '#efefef');

  // create x-axis tick text.
  punchcard.
    selectAll('.rule').
    data(this.data[0].slice(1)).
    enter().
    append('text').
    attr('class', 'rule').
    attr('x', function(d, i) { return paneLeft  + x(i); }).
    attr('y', height  + (2*margin) + lineHeight).
    attr('text-anchor', 'middle').
    text(function(d) {
      return d.key;
    });

  // create rows
  punchcardRow = punchcard.selectAll('.row')
    .data( this.data )
    .enter()
    .append('g')
    .attr('class', 'row')
    .attr('transform', function(d, i) {
      var ty = height - y(i) - (sectionHeight/2);
      return 'translate(0, ' + ty + ')';
    });

  // draw circles for each row
  punchcardRow.
    selectAll('circle').
    data( function(d, i ) {
      return d.slice(1);
    } ).
    enter().
    append('circle').
    style('fill', '#888').
    attr('r', function(d, i) {
      return parseInt( d.value, 10) / _this.max * circleRadius;
    }).
    attr('transform', function(d, i) {
      var tx = paneLeft  + x(i);
      return 'translate(' + tx + ', 0)';
    });

  return this;
};
