// adapted from
// http://jeybalachandran.com/posts/San-Francisco-Caltrain-Punchcard/
// https://github.com/jeyb/d3.punchcard

function Punchcard( options ) {
  this.data = options.data;
  this.element = options.element;
  return this;
}

Punchcard.prototype.draw = function( options ){

  var margin = 10,
      lineHeight = 5,
      width = options.width - (margin *2),
      paneLeft = 80,
      paneRight = width - paneLeft,
      sectionHeight = 50,
      height = ( sectionHeight * this.data.length ) + margin,
      sectionWidth = paneRight / this.data[0].length,
      i,
      j,
      tx,
      ty,
      max = 0,
      circleRadius = 20,
      punchcardRow;

  // X-Axis.
  var x = d3.scale.linear().domain([0, this.data[0].length-1]).
    range([ paneLeft + (sectionWidth / 2) , paneRight + (sectionWidth / 2)]);

  // Y-Axis.
  var y = d3.scale.linear().domain([0, this.data.length-1]).
    range([2 * margin, height - sectionHeight]);

  // The main SVG element.
  var punchcard = d3.select(this.element)
    .html('')
    .append('svg')
      .attr('width', width + (margin * 2 ))
      .attr('height', height + margin)
      .append('g');

  // Hour line markers by day.


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


  punchcard.
    append('g').
    selectAll('line').
    data(this.data[0].slice(1)).
    enter().
    append('line').
    attr('x1', function(d,i) { return paneLeft  + x(i); }).
    attr('x2', function(d,i) { return paneLeft  + x(i); }).
    attr('y1', function (d, i) {
      return  height - (2* margin);
    }).
    attr('y2', function (d, i) {
      return height - margin;
    }).

    style('stroke-width', 1).
    style('stroke', '#efefef');


  // Hour text markers.
  punchcard.
    selectAll('.rule').
    data(this.data[0].slice(1)).
    enter().
    append('text').
    attr('class', 'rule').
    attr('x', function(d, i) { return paneLeft  + x(i); }).
    attr('y', height ).
    attr('text-anchor', 'middle').
    text(function(d) {
      return d.key;
    });

  // Find the max value to normalize the size of the circles.
  max = d3.max( this.data , function(array) {

    // we ignore the first element as it is metadata
    return d3.max(array.slice(1), function ( obj) {

      // and we only return the interger verion of the value, not the key
      return parseInt(obj.value, 10);
    });
  });



// console.log( punchcard );

  punchcardRow = punchcard.selectAll('.row')
    .data( this.data )
    .enter()
    .append('g')
    .attr('class', 'row')
    .attr('transform', function(d, i) {
      var ty = height - y(i) - (sectionHeight/2);
      return 'translate(0, ' + ty + ')';
    });

  punchcardRow.
    selectAll('circle').
    data( function(d, i ) {
      return d.slice(1);
    } ).
    enter().
    append('circle').
    style('fill', '#888').
    attr('r', function(d, i) {
      return parseInt( d.value, 10) / max * circleRadius;
    }).
    attr('transform', function(d, i) {
      var tx = paneLeft  + x(i);
      return 'translate(' + tx + ', 0)';
    });

  // // Show the circles on the punchcard.
  // for (i = 0; i < this.data.length; i++) {


  //   // we start with 1 to igone the first metadata element
  //   for (j = 1; j < this.data[i].length; j++) {

  //     punchcard.
  //       append('g').
  //       selectAll('circle').
  //       data([parseInt(this.data[i][j].value, 10)]).
  //       enter().
  //       append('circle').
  //       style('fill', '#888').
  //       // on('mouseover', mover).
  //       // on('mouseout', mout).
  //       // on('mousemove', function() {
  //       //  return tooltip.
  //       //    style('top', (d3.event.pageY - 10) + 'px').
  //       //    style('left', (d3.event.pageX + 10) + 'px');
  //       // }).
  //       attr('r', function(d) {
  //         return d / max * circleRadius;
  //       }).
  //       attr('transform', function() {
  //           tx = paneLeft  + x(j);
  //           ty = height - y(i) - (sectionHeight/2);
  //           return 'translate(' + tx + ', ' + ty + ')';
  //         });
  //   }
  //   // function mover(d) {
  //   //   tooltip = d3.select('body')
  //   //    .append('div')
  //   //    .style('position', 'absolute')
  //   //    .style('z-index', '99999')
  //   //    .attr('class', 'vis-tool-tip')
  //   //    .text(d);
  //   // }

  //   // function mout(d) {
  //   //   $('.vis-tool-tip').fadeOut(50).remove();
  //   // }
  // }

  return this;
};
