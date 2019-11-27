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
 * Chart title height.
 */
const CHART_TITLE_HEIGHT = 56;

/**
 * Height of a single chart.
 */
const CHART_HEIGHT = 256;

/**
 * Line chart dot radius.
 */
const DOT_RADIUS = 4;

/**
 * Specifies the distance within which dot labels will not be rendered if there
 * are any other nearby labels.
 */
const DOT_LABEL_MIN_DISTANCE = 56;

/**
 * Data dot label offset.
 */
const LABEL_OFFSET = 8;

/**
 * Chart margin sizes.
 */
const MARGIN = {
  top: 0,
  bottom: 64,
  left: 8,
  right: 8
};

const measurements = [
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

const quantities: typeof measurements[] = Array(10).fill(measurements);

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
    const canvas = d3.select<HTMLDivElement, never>("#canvas");
    canvas.selectAll("*").remove();

    const svg = canvas
      .append("svg")
      .attr(
        "height",
        MARGIN.top + 10 * (CHART_TITLE_HEIGHT + CHART_HEIGHT) + MARGIN.bottom
      );

    const chartWidth = svg.node()!.scrollWidth - MARGIN.left - MARGIN.right;

    const charts = svg
      .selectAll("g")
      .data(quantities)
      .enter()
      .append("g")
      .attr(
        "transform",
        (_, index) =>
          `translate(${MARGIN.left}, ${MARGIN.top +
            CHART_TITLE_HEIGHT +
            index * (CHART_TITLE_HEIGHT + CHART_HEIGHT)})`
      );

    const timeScale = d3
      .scaleTime()
      .range([0, chartWidth])
      .domain([new Date("2019-09-10"), new Date()]);

    const timeAxis = d3.axisBottom(timeScale).ticks(chartWidth / TICK_WIDTH);

    charts
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${CHART_HEIGHT})`)
      .call(timeAxis);

    const area = (scale: d3.ScaleLinear<number, number>) =>
      d3
        .area<typeof measurements[number]>()
        .x(d => timeScale(new Date(d.date)))
        .y1(d => CHART_HEIGHT - scale(d.value))
        .y0(CHART_HEIGHT)
        .curve(d3.curveMonotoneX);

    const line = (scale: d3.ScaleLinear<number, number>) =>
      d3
        .line<typeof measurements[number]>()
        .x(d => timeScale(new Date(d.date)))
        .y(d => CHART_HEIGHT - scale(d.value))
        .curve(d3.curveMonotoneX);

    charts.each(function(data) {
      const chart = d3.select(this);

      const scale = d3
        .scaleLinear()
        .domain([0, 200])
        .range([0, CHART_HEIGHT]);

      chart
        .append("path")
        .attr("class", "area")
        .attr("d", area(scale)(data)!);

      chart
        .append("path")
        .attr("class", "line")
        .attr("d", line(scale)(data)!);

      chart
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", d => timeScale(new Date(d.date)))
        .attr("cy", d => CHART_HEIGHT - scale(d.value))
        .attr("r", DOT_RADIUS);

      const labelPoints = data.reduce((accumulator, currentPoint, index) => {
        const previousPoint =
          index === 0
            ? { date: "1970-01-01", value: 0 }
            : accumulator[accumulator.length - 1];

        const previousX = timeScale(new Date(previousPoint.date));
        const previousY = scale(previousPoint.value);

        const currentX = timeScale(new Date(currentPoint.date));
        const currentY = scale(currentPoint.value);

        if (
          (currentX - previousX) ** 2 + (currentY - previousY) ** 2 >=
          DOT_LABEL_MIN_DISTANCE ** 2
        ) {
          accumulator.push(currentPoint);
        }

        return accumulator;
      }, [] as typeof measurements);

      chart
        .selectAll()
        .data(labelPoints)
        .enter()
        .append("text")
        .text(d => d.value)
        .attr("class", "label")
        .attr("x", d => timeScale(new Date(d.date)))
        .attr("y", d => CHART_HEIGHT - scale(d.value) - LABEL_OFFSET)
        .attr("text-anchor", "middle");
    });
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
  }

  & svg g {
    font: inherit;
  }

  & svg .axis line,
  & svg .axis path {
    stroke: ${({ theme }) => theme.borderColor};
  }

  & svg .axis text {
    color: ${({ theme }) => theme.colorSecondary};
    font-size: 0.75rem;
    letter-spacing: 0;
  }

  & svg .line {
    fill: none;
    stroke: ${({ theme }) => theme.colorActive};
    stroke-width: 2;
  }

  & svg .area {
    fill: ${({ theme }) => theme.colorActive};
    opacity: 0.25;
  }

  & svg .circle {
    fill: ${({ theme }) => theme.backgroundColor};
    stroke: ${({ theme }) => theme.colorActive};
    stroke-width: 2;
  }

  & svg .label {
    fill: ${({ theme }) => theme.colorPrimary};
  }
`;
