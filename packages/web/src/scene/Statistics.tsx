import * as d3 from "d3";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Data, MeasurementDto, Quantity } from "server";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Head } from "../component/Head";
import { Tab } from "../component/Tab";
import { RequiredNutrient } from "../model/Foodstuff";
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
 * Maps time frames to functions that calculate the beginning of the time frame
 * depending on current date.
 */
const TIME_FRAME_OFFSET_FUNCTIONS = {
  week: (now: Date) => d3.timeWeek.offset(now, -1),
  month: (now: Date) => d3.timeMonth.offset(now, -1),
  quarter: (now: Date) => d3.timeMonth.offset(now, -3),
  year: (now: Date) => d3.timeYear.offset(now, -1)
};

/**
 * Width of a tick on a x-axis. Used to calculate the number of ticks based on
 * current screen width.
 */
const TICK_WIDTH = 180;

/**
 * Chart title height.
 */
const CHART_TITLE_HEIGHT = 196;

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
  top: -40,
  bottom: 128,
  left: 40,
  right: 40
};

/**
 * Area path generator function.
 */
const area = (
  x: d3.ScaleTime<number, number>,
  y: d3.ScaleLinear<number, number>
) =>
  d3
    .area<MeasurementDto>()
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
    .line<MeasurementDto>()
    .x(d => x(new Date(d.date)))
    .y(d => CHART_HEIGHT - y(d.value))
    .curve(d3.curveMonotoneX);

/**
 * Statistics scene component translation.
 */
interface StatisticsTranslation {
  /**
   * Chart title translations.
   */
  charts: Record<RequiredNutrient | Quantity, string>;

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
@inject("views", "statistics")
@observer
export class Statistics extends SceneComponent<
  "Statistics",
  {},
  StatisticsTranslation
> {
  /**
   * Retrieved statistics data.
   */
  @observable data?: Data<"statistics", "getAll">;

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
    this.loadData();

    window.addEventListener("resize", this.renderCharts, true);
  }

  /**
   * Removes added event listener before unmounting.
   */
  public componentWillUnmount() {
    window.removeEventListener("resize", this.renderCharts, true);
  }

  /**
   * Redraw the chart after component was updated.
   */
  public componentDidUpdate() {
    this.renderCharts();
  }

  /**
   * Renders a bar chart of nutrient amounts and limits inside specified SVG
   * group selection.
   */
  private renderNutrientChart = (
    chart: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: Array<{ date: string; value: number; limit: number }>,
    x: d3.ScaleTime<number, number>
  ) => {
    const min = d3.min(data, amount => Math.min(amount.limit, amount.value))!;
    const max = d3.max(data, amount => Math.max(amount.limit, amount.value))!;

    const y = d3
      .scaleLinear()
      .domain([
        min - Math.max(10, (max - min) * 0.1),
        max + Math.max(10, (max - min) * 0.1)
      ])
      .range([0, CHART_HEIGHT]);

    const bars = chart.selectAll<SVGRectElement, never>("rect").data(data);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .merge(bars)
      .attr("x", d => x(new Date(d.date)))
      .attr("y", d => CHART_HEIGHT - y(d.value))
      .attr(
        "width",
        d => x(d3.timeDay.offset(new Date(d.date), 1)) - x(new Date(d.date))
      )
      .attr("height", d => y(d.value));

    const limits = chart
      .selectAll<SVGLineElement, never>("line.bar-limit")
      .data(data);

    limits
      .enter()
      .append("line")
      .attr("class", "bar-limit")
      .merge(limits)
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

    const highlights = chart
      .selectAll<SVGLineElement, never>("line.bar-top")
      .data(data);

    highlights
      .enter()
      .append("line")
      .attr("class", "bar-top")
      .merge(highlights)
      .attr("x1", d => x(new Date(d.date)))
      .attr("y1", d => CHART_HEIGHT - y(d.value))
      .attr("x2", d => x(d3.timeDay.offset(new Date(d.date), 1)))
      .attr("y2", d => CHART_HEIGHT - y(d.value));
  };

  /**
   * Renders chart inside specified SVG with given measurements inside specified
   * SVG group selection.
   */
  private renderQuantityChart = function(
    chart: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: MeasurementDto[],
    x: d3.ScaleTime<number, number>
  ) {
    const min = d3.min(data, measurement => measurement.value)!;
    const max = d3.max(data, measurement => measurement.value)!;

    const y = d3
      .scaleLinear()
      .domain([
        min - Math.max(10, (max - min) * 0.1),
        max + Math.max(10, (max - min) * 0.1)
      ])
      .range([0, CHART_HEIGHT]);

    const areaPath = chart
      .selectAll<SVGPathElement, never>("path.area")
      .data([0]);

    areaPath
      .enter()
      .append("path")
      .attr("class", "area")
      .merge(areaPath)
      .attr("d", area(x, y)(data)!);

    const linePath = chart
      .selectAll<SVGPathElement, never>("path.line")
      .data([0]);

    linePath
      .enter()
      .append("path")
      .attr("class", "line")
      .merge(linePath)
      .attr("d", line(x, y)(data)!);

    const dots = chart
      .selectAll<SVGCircleElement, never>("circle.dot")
      .data(data);

    dots
      .enter()
      .append("circle")
      .attr("class", "dot")
      .merge(dots)
      .attr("cx", d => x(new Date(d.date)))
      .attr("cy", d => CHART_HEIGHT - y(d.value))
      .attr("r", DOT_RADIUS);

    const labelPoints = data.reduce((accumulator, currentPoint) => {
      const previousPoint =
        accumulator.length === 0
          ? { date: "1970-01-01", value: 0 }
          : accumulator[accumulator.length - 1];

      const previousX = x(new Date(previousPoint.date));
      const previousY = y(previousPoint.value);

      const currentX = x(new Date(currentPoint.date));
      const currentY = y(currentPoint.value);

      if (
        currentX >= 0 &&
        (currentX - previousX) ** 2 + (currentY - previousY) ** 2 >=
          DOT_LABEL_MIN_DISTANCE ** 2
      ) {
        accumulator.push(currentPoint);
      }

      return accumulator;
    }, [] as MeasurementDto[]);

    const labels = chart
      .selectAll<SVGTextElement, never>("text.label")
      .data(labelPoints);

    labels.exit().remove();

    labels
      .enter()
      .append("text")
      .attr("class", "label")
      .merge(labels)
      .text(d => d.value)
      .attr("x", d => x(new Date(d.date)))
      .attr("y", d => CHART_HEIGHT - y(d.value) - LABEL_OFFSET)
      .attr("text-anchor", "middle");
  };

  /**
   * Returns chart time axis domain depending on currently selected time frame.
   */
  private getTimeDomain() {
    const now = new Date();

    if (this.selectedTimeFrame === "all") {
      return [new Date("2019-01-01"), now];
    }

    return [TIME_FRAME_OFFSET_FUNCTIONS[this.selectedTimeFrame](now), now];
  }

  /**
   * Renders the charts SVG.
   */
  private renderCharts = () => {
    const canvas = d3.select<HTMLDivElement, never>("#canvas");

    if (this.data === undefined) {
      canvas.selectAll("*").remove();
      return;
    }

    let svg = canvas.selectAll<SVGSVGElement, never>("svg").data([0]);
    svg = svg
      .enter()
      .append("svg")
      .merge(svg)
      .attr(
        "height",
        MARGIN.top +
          this.data.length * (CHART_TITLE_HEIGHT + CHART_HEIGHT) +
          MARGIN.bottom
      );

    const chartWidth = svg.node()!.clientWidth - MARGIN.left - MARGIN.right;

    const x = d3
      .scaleUtc()
      .range([0, chartWidth])
      .domain(this.getTimeDomain())
      .nice();

    const xAxis = d3.axisBottom(x).ticks(chartWidth / TICK_WIDTH);

    let charts = svg.selectAll<SVGGElement, never>("g.chart").data(this.data);

    charts = charts
      .enter()
      .append("g")
      .attr("class", "chart")
      .merge(charts);

    const renderNutrientChart = this.renderNutrientChart;
    const renderQuantityChart = this.renderQuantityChart;
    const chartsTranslation = this.translation.charts;

    charts
      .attr(
        "transform",
        (_, index) =>
          `translate(${MARGIN.left}, ${MARGIN.top +
            CHART_TITLE_HEIGHT +
            index * (CHART_TITLE_HEIGHT + CHART_HEIGHT)})`
      )
      .each(function(data) {
        const chart = d3.select(this);

        const title = chart
          .selectAll<SVGTextElement, never>("text.title")
          .data([0]);

        title
          .enter()
          .append("text")
          .attr("class", "title")
          .merge(title)
          .text(chartsTranslation[data.name])
          .attr("x", "0")
          .attr("y", -CHART_TITLE_HEIGHT / 2)
          .attr("alignment-baseline", "middle");

        if (data.type === "nutrition") {
          renderNutrientChart(d3.select(this), data.data, x);
        } else {
          renderQuantityChart(d3.select(this), data.data, x);
        }
      });

    const axes = svg
      .selectAll("g.chart")
      .selectAll<SVGGElement, never>("g.axis")
      .data([0]);

    axes
      .enter()
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${CHART_HEIGHT})`)
      .merge(axes)
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
              key={timeFrame}
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

  /**
   * Requests statistics data from the server.
   */
  @action
  private async loadData() {
    this.data = await this.props.statistics!.getAll();
    this.renderCharts();
  }
}

/**
 * Canvas div element that wraps created SVG element.
 */
const Canvas = styled.div`
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
    fill: ${({ theme }) => theme.colorSecondary};
    font-size: 0.75rem;
    letter-spacing: 0;
  }

  & svg .title {
    fill: ${({ theme }) => theme.colorPrimary};
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

  & svg .dot {
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
