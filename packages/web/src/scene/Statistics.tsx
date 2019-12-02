import * as d3 from "d3";
import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Head } from "../component/Head";
import { Tab } from "../component/Tab";
import { styled } from "../styling/theme";

/**
 * Array of available time frames.
 */
const TIME_FRAMES = ["week", "month", "quarter", "year", "all"] as const;

/**
 * Union of available time frames.
 */
type TimeFrame = typeof TIME_FRAMES[number];

/**
 * Width of a tick on a x-axis. Used to calculate the number of ticks based on
 * current screen width.
 */
const TICK_WIDTH = 180;

/**
 * Chart title height.
 */
const CHART_TITLE_HEIGHT = 128;

/**
 * Height of a single chart.
 */
const CHART_HEIGHT = 196;

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
const LABEL_OFFSET = 10;

/**
 * Chart margin sizes.
 */
const MARGIN = {
  top: 0,
  bottom: 64,
  left: 8,
  right: 8
};

/**
 * Area path generator function.
 */
const area = (
  x: d3.ScaleTime<number, number>,
  y: d3.ScaleLinear<number, number>
) =>
  d3
    .area<typeof measurements[number]>()
    .x(d => x(new Date(d.date)))
    .y1(d => CHART_HEIGHT - y(d.value))
    .y0(CHART_HEIGHT)
    .curve(d3.curveMonotoneX);

/**
 * Line path generator function.
 */
const line = (
  x: d3.ScaleTime<number, number>,
  y: d3.ScaleLinear<number, number>
) =>
  d3
    .line<typeof measurements[number]>()
    .x(d => x(new Date(d.date)))
    .y(d => CHART_HEIGHT - y(d.value))
    .curve(d3.curveMonotoneX);

const amounts = [
  { date: "2019-09-10", value: 60, limit: 67 },
  { date: "2019-09-12", value: 69, limit: 67 },
  { date: "2019-09-13", value: 65, limit: 67 },
  { date: "2019-09-15", value: 70, limit: 67 },
  { date: "2019-09-20", value: 75, limit: 67 },
  { date: "2019-09-30", value: 77, limit: 87 },
  { date: "2019-10-04", value: 90, limit: 87 },
  { date: "2019-10-10", value: 120, limit: 87 },
  { date: "2019-10-28", value: 70, limit: 87 },
  { date: "2019-11-01", value: 100, limit: 87 },
  { date: "2019-11-10", value: 90, limit: 87 }
];

const nutrients: typeof amounts[] = Array(4).fill(amounts);

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
 * Statistics scene component translation.
 */
interface StatisticsTranslation {
  /**
   * Time frame translations.
   */
  timeFrames: Record<TimeFrame, string>;

  /**
   * Scene title translation.
   */
  title: string;
}

/**
 * Scene component that displays statistics about consumed nutrition and body
 * measurements.
 */
@inject("views")
@observer
export class Statistics extends SceneComponent<
  "Statistics",
  {},
  StatisticsTranslation
> {
  /**
   * Currently selected time frame.
   */
  @observable selectedTimeFrame: TimeFrame = "week";

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
   * Appends a new chart svg group to the end of the svg.
   */
  private appendChartGroup(
    svg: d3.Selection<SVGSVGElement, never, HTMLElement, any>
  ) {
    const index = svg.node()!.childElementCount;

    return svg
      .append("g")
      .attr(
        "transform",
        `translate(${MARGIN.left}, ${MARGIN.top +
          CHART_TITLE_HEIGHT +
          index * (CHART_TITLE_HEIGHT + CHART_HEIGHT)})`
      );
  }

  /**
   * Renders a bar chart of nutrient amounts and limits
   */
  private renderNutrientChart(
    svg: d3.Selection<SVGSVGElement, never, HTMLElement, any>,
    data: typeof amounts,
    x: d3.ScaleTime<number, number>
  ) {
    const chart = this.appendChartGroup(svg);

    const min = d3.min(data, amount => Math.min(amount.limit, amount.value))!;
    const max = d3.max(data, amount => Math.max(amount.limit, amount.value))!;

    const y = d3
      .scaleLinear()
      .domain([
        min - Math.max(10, (max - min) * 0.1),
        max + Math.max(10, (max - min) * 0.1)
      ])
      .range([0, CHART_HEIGHT]);

    chart
      .selectAll()
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(new Date(d.date)))
      .attr("y", d => CHART_HEIGHT - y(d.value))
      .attr(
        "width",
        d => x(d3.timeDay.offset(new Date(d.date), 1)) - x(new Date(d.date))
      )
      .attr("height", d => y(d.value));

    chart
      .selectAll()
      .data(data)
      .enter()
      .append("line")
      .attr("class", "bar-limit")
      .attr("x1", d => x(new Date(d.date)))
      .attr("y1", d => CHART_HEIGHT - y(d.limit))
      .attr("x2", (d, i) =>
        x(
          i < data.length - 1
            ? new Date(data[i + 1].date)
            : d3.timeDay.offset(new Date(d.date), 1)
        )
      )
      .attr("y2", d => CHART_HEIGHT - y(d.limit));

    chart
      .selectAll()
      .data(data)
      .enter()
      .append("line")
      .attr("class", "bar-top")
      .attr("x1", d => x(new Date(d.date)))
      .attr("y1", d => CHART_HEIGHT - y(d.value))
      .attr("x2", d => x(d3.timeDay.offset(new Date(d.date), 1)))
      .attr("y2", d => CHART_HEIGHT - y(d.value));
  }

  /**
   * Renders chart inside specified SVG with given measurements.
   */
  private renderQuantityChart(
    svg: d3.Selection<SVGSVGElement, never, HTMLElement, any>,
    data: typeof measurements,
    x: d3.ScaleTime<number, number>
  ) {
    const chart = this.appendChartGroup(svg);

    const min = d3.min(data, measurement => measurement.value)!;
    const max = d3.max(data, measurement => measurement.value)!;

    const y = d3
      .scaleLinear()
      .domain([
        min - Math.max(10, (max - min) * 0.1),
        max + Math.max(10, (max - min) * 0.1)
      ])
      .range([0, CHART_HEIGHT]);

    chart
      .append("path")
      .attr("class", "area")
      .attr("d", area(x, y)(data)!);

    chart
      .append("path")
      .attr("class", "line")
      .attr("d", line(x, y)(data)!);

    chart
      .selectAll()
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("cx", d => x(new Date(d.date)))
      .attr("cy", d => CHART_HEIGHT - y(d.value))
      .attr("r", DOT_RADIUS);

    const labelPoints = data.reduce((accumulator, currentPoint, index) => {
      const previousPoint =
        index === 0
          ? { date: "1970-01-01", value: 0 }
          : accumulator[accumulator.length - 1];

      const previousX = x(new Date(previousPoint.date));
      const previousY = y(previousPoint.value);

      const currentX = x(new Date(currentPoint.date));
      const currentY = y(currentPoint.value);

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
      .attr("x", d => x(new Date(d.date)))
      .attr("y", d => CHART_HEIGHT - y(d.value) - LABEL_OFFSET)
      .attr("text-anchor", "middle");
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
        MARGIN.top +
          (nutrients.length + quantities.length) *
            (CHART_TITLE_HEIGHT + CHART_HEIGHT) +
          MARGIN.bottom
      );

    const chartWidth = svg.node()!.scrollWidth - MARGIN.left - MARGIN.right;

    const x = d3
      .scaleTime()
      .range([0, chartWidth])
      .domain([new Date("2019-09-10"), new Date()]);

    const xAxis = d3.axisBottom(x).ticks(chartWidth / TICK_WIDTH);

    for (const amounts of nutrients) {
      this.renderNutrientChart(svg, amounts, x);
    }

    for (const measurements of quantities) {
      this.renderQuantityChart(svg, measurements, x);
    }

    svg
      .selectAll("g")
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${CHART_HEIGHT})`)
      .call(xAxis);
  };

  /**
   * Renders the canvas element inside which the SVG of charts is rendered.
   */
  public render() {
    return (
      <>
        <Head title={this.translation.title} />

        <Tabs>
          {TIME_FRAMES.map(timeFrame => (
            <Tab
              id={timeFrame}
              onClick={this.selectTimeFrame}
              selected={timeFrame === this.selectedTimeFrame}
              value={timeFrame}
            >
              {this.translation.timeFrames[timeFrame]}
            </Tab>
          ))}
        </Tabs>

        <Canvas id="canvas" />
      </>
    );
  }

  /**
   * Sets appropriate time frame on tab click.
   */
  private selectTimeFrame: React.MouseEventHandler<
    HTMLButtonElement
  > = event => {
    this.selectedTimeFrame = event.currentTarget.value as TimeFrame;
  };
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

  & svg .bar {
    fill: ${({ theme }) => theme.colorActive};
    opacity: 0.25;
  }

  & svg .bar-top {
    stroke: ${({ theme }) => theme.colorActive};
    stroke-width: 2;
  }

  & svg .bar-limit {
    stroke: ${({ theme }) => theme.colorSecondary};
    stroke-width: 2;
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

/**
 * Top tab bar component.
 */
const Tabs = styled.div`
  position: sticky;
  top: 0;

  width: 100%;
  height: ${({ theme }) => theme.height};
  flex-shrink: 0;

  display: flex;

  & > ${Tab} {
    flex-shrink: 1;
  }

  background-color: ${({ theme }) => theme.backgroundColor};
`;
