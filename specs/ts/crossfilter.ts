import { Spec } from '@uwdata/mosaic-spec';

export const spec : Spec = {
  "data": {
    "flights": {
      "file": "data/flights-200k.parquet"
    }
  },
  "params": {
    "brush": {
      "select": "crossfilter"
    }
  },
  "vconcat": [
    {
      "plot": [
        {
          "mark": "rectY",
          "data": {
            "from": "flights",
            "filterBy": "$brush"
          },
          "x": {
            "bin": "delay"
          },
          "y": {
            "count": null
          },
          "fill": "steelblue",
          "insetLeft": 0.5,
          "insetRight": 0.5
        },
        {
          "select": "intervalX",
          "as": "$brush"
        }
      ],
      "xDomain": "Fixed",
      "xLabel": "Arrival Delay (min)",
      "xLabelAnchor": "center",
      "yTickFormat": "s",
      "height": 200
    },
    {
      "plot": [
        {
          "mark": "rectY",
          "data": {
            "from": "flights",
            "filterBy": "$brush"
          },
          "x": {
            "bin": "time"
          },
          "y": {
            "count": null
          },
          "fill": "steelblue",
          "insetLeft": 0.5,
          "insetRight": 0.5
        },
        {
          "select": "intervalX",
          "as": "$brush"
        }
      ],
      "xDomain": "Fixed",
      "xLabel": "Departure Time (hour)",
      "xLabelAnchor": "center",
      "yTickFormat": "s",
      "height": 200
    }
  ]
};
