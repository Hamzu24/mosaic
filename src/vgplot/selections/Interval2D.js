import { brush, select, min, max } from 'd3';
import { and, isBetween } from '../../sql/index.js';
import { closeTo } from './close-to.js';

export class Interval2DSelection {
  constructor(mark, selection, xfield, yfield) {
    this.mark = mark;
    this.selection = selection;

    this.xfield = xfield || mark.channelField('x', 'x1', 'x2').column;
    this.yfield = yfield || mark.channelField('y', 'y1', 'y2').column;
    this.brush = brush();

    this.brush.on('brush end', ({ selection }) => {
      const { value, xfield, yfield } = this;

      let xr = undefined;
      let yr = undefined;
      if (selection) {
        const [a, b] = selection;
        xr = [a[0], b[0]].map(this.xscale.invert).sort((a, b) => a - b);
        yr = [a[1], b[1]].map(this.yscale.invert).sort((a, b) => a - b);
      }

      if (!closeTo(xr, value?.[0]) || !closeTo(yr, value?.[1])) {
        this.value = selection ? [xr, yr] : null;
        this.g.call(this.brush.move, selection);
        this.selection.update({
          source: this.mark,
          channels: ['x', 'y'],
          fields: [xfield, yfield],
          value,
          predicate: selection
            ? and(isBetween(xfield, xr), isBetween(yfield, yr))
            : null
        });
      }
    });
  }

  init(svg) {
    const { brush } = this;
    const xscale = this.xscale = svg.scale('x');
    const yscale = this.yscale = svg.scale('y');
    const rx = xscale.range;
    const ry = yscale.range;
    brush.extent([[min(rx), min(ry)], [max(rx), max(ry)]]);

    const facets = select(svg).selectAll('g[aria-label="facet"]');
    const root = facets.size() ? facets : select(svg);
    this.g = root
      .append('g')
      .attr('class', `interval-xy`)
      .call(brush);

    if (this.value) {
      const [x1, x2] = this.value[0].map(xscale.apply);
      const [y1, y2] = this.value[1].map(yscale.apply);
      this.g.call(brush.move, [[x1, y1], [x2, y2]]);
    }
  }
}
