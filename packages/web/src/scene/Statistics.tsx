import * as d3 from "d3";
import { inject, observer } from "mobx-react";
import * as React from "react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { styled } from "../styling/theme";

/**
 * Width of a tick on a x-axis. Used to calculate the number of ticks based on
 * current screen width.
 */
const TICK_WIDTH = 180;

/**
 * Height of a single chart.
 */
const CHART_HEIGHT = 200;

export const measurements = [
  { date: "2019-09-10", value: 19 },
  { date: "2019-09-12", value: 20 },
  { date: "2019-09-13", value: 19.9 },
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
 * Scene component that displays statistics about consumed nutrition and body
 * measurements.
 */
@inject("views")
@observer
export class Statistics extends SceneComponent<"Statistics"> {
  /**
   * Sets the name of this component.
   */
  public constructor(props: DefaultSceneComponentProps<"Statistics">) {
    super("Statistics", props);
  }

  /**
   * Renders the charts after component mount and adds resize event listener on
   * which chart is redrawn.
   */
  public componentDidMount() {
    this.renderCharts();

    window.addEventListener("resize", this.renderCharts, true);
  }

  /**
   * Removes added event listener before unmounting.
   */
  public componentWillUnmount() {
    window.removeEventListener("resize", this.renderCharts, true);
  }

  /**
   * Renders the charts SVG.
   */
  private renderCharts = () => {
    const canvas = d3.select<HTMLDivElement, unknown>("#canvas");

    canvas.selectAll("*").remove();

    const svg = canvas.append("svg");
    const width = svg.node()!.scrollWidth;

    const xScale = d3
      .scaleTime()
      .domain([new Date("2019-09-10"), new Date()])
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([150, 0])
      .range([0, CHART_HEIGHT]);

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${CHART_HEIGHT})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(width / TICK_WIDTH)
          .tickFormat(d3.timeFormat("%d-%m-%Y") as any)
      );

    svg
      .append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale));

    const line = d3
      .line<typeof measurements[number]>()
      .x(d => xScale(new Date(d.date)))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(measurements)
      .attr("class", ".line")
      .attr("fill", "none")
      .attr("stroke", "#ff5000")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
  };

  /**
   * Renders the canvas element inside which the SVG of charts is rendered.
   */
  public render() {
    return <Canvas id="canvas" />;
  }
}

/**
 * Canvas div element that wraps created SVG element.
 */
const Canvas = styled.div`
  padding: ${({ theme }) => theme.padding};

  & svg {
    width: 100%;
    overflow: visible;
  }

  & svg .axis {
    font: inherit;
  }

  & svg .axis line,
  & svg .axis path {
    stroke: ${({ theme }) => theme.borderColor};
  }

  & svg .axis text {
    color: ${({ theme }) => theme.colorSecondary};
  }

  & svg .line {
    color: ${({ theme }) => theme.colorActive};
  }
`;
