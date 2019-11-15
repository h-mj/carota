import { inject, observer } from "mobx-react";
import * as React from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Quantity } from "server";

import { Component } from "../base/Component";

const measurements = [
  { date: "2019-09-10", value: 19 },
  { date: "2019-09-13", value: 20 },
  { date: "2019-09-12", value: 19.9 },
  { date: "2019-09-15", value: 22 },
  { date: "2019-09-20", value: 25 },
  { date: "2019-09-30", value: 30 },
  { date: "2019-10-04", value: 34 },
  { date: "2019-10-10", value: 36 },
  { date: "2019-10-28", value: 46 },
  { date: "2019-11-01", value: 48 },
  { date: "2019-11-10", value: 150 }
];

/**
 * Formats chart's ticks.
 */
const formatTicks = (value: number) => {
  const date = new Date(value);

  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
};

/**
 * Measurements chart component props.
 */
interface MeasurementsChartProps {
  /**
   * Quantity which measurements are displayed.
   */
  quantity: Quantity;
}

/**
 * Line chart of measurements of provided quantity.
 */
@inject("measurements", "views")
@observer
export class MeasurementsChart extends Component<MeasurementsChartProps> {
  /**
   * Renders the line chart of the measurements.
   */
  public render() {
    const { theme } = this.props.views!;

    const data = measurements.map(measurement => ({
      date: new Date(measurement.date).getTime(),
      value: measurement.value
    }));

    return (
      <ResponsiveContainer height={300}>
        <LineChart
          data={data}
          margin={{ bottom: 4, right: 4, left: -24, top: 4 }}
        >
          <XAxis
            dataKey="date"
            domain={["dataMin", "dataMax"]}
            stroke={theme.borderColor}
            tick={{ fill: theme.colorSecondary }}
            type="number"
            tickFormatter={formatTicks}
            padding={{ left: 16, right: 16 }}
          />

          <YAxis
            stroke={theme.borderColor}
            tick={{ fill: theme.colorSecondary }}
          />

          <Line
            activeDot={{
              fill: theme.colorActive,
              r: 4,
              strokeWidth: 0
            }}
            dataKey="value"
            dot={{
              fill: theme.colorActive,
              r: 4,
              strokeWidth: 0
            }}
            stroke={theme.colorActive}
            strokeWidth={2}
            type="monotoneX"
          />

          <Tooltip
            cursor={{ stroke: theme.colorActive, strokeWidth: 2 }}
            labelFormatter={t => formatTicks(Number.parseInt(t.toString()))}
            contentStyle={{
              backgroundColor: theme.backgroundColor,
              borderColor: theme.borderColor
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
