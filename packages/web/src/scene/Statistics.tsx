import * as d3 from "d3";
import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Data, Quantity } from "server";

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
 * Body mass index chart data point type.
 */
interface BodyMassIndexDataPoint {
  date: string;
  value: number;
}

/**
 * Array of body mass index range names and range starting index values.
 */
const BODY_MASS_INDEX_RANGES = [
  { name: "verySeverelyUnderweight" as const, min: -Infinity, lt: 15 },
  { name: "severelyUnderweight" as const, min: 15, lt: 16 },
  { name: "underweight" as const, min: 16, lt: 18.5 },
  { name: "normal" as const, min: 18.5, lt: 25 },
  { name: "overweight" as const, min: 25, lt: 30 },
  { name: "obeseClass1" as const, min: 30, lt: 35 },
  { name: "obeseClass2" as const, min: 35, lt: 40 },
  { name: "obeseClass3" as const, min: 40, lt: 45 },
  { name: "obeseClass4" as const, min: 45, lt: 50 },
  { name: "obeseClass5" as const, min: 50, lt: 60 },
  { name: "obeseClass6" as const, min: 60, lt: Infinity }
];

/**
 * Union of body mass index range names.
 */
type BodyMassIndexRangeName = typeof BODY_MASS_INDEX_RANGES[number]["name"];

/**
 * Nutrition bar chart data point.
 */
interface NutritionDataPoint {
  date: string;
  value: number;
  limit: number;
}

/**
 * Quantity measurements line chart data point.
 */
interface QuantityDataPoint {
  date: string;
  value: number;
}

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
 * SVG padding sizes.
 */
const PADDING = {
  top: 24,
  bottom: 128,
  left: 40,
  right: 40
};

/**
 * Gap between two subsequent charts.
 */
const CHART_GAP = 56;

/**
 * Chart title height.
 */
const CHART_TITLE_HEIGHT = 56;

/**
 * Body mass index chart height.
 */
const BMI_CHART_HEIGHT = 32;

/**
 * Body mass index chart current index flag rectangle width.
 */
const BMI_CHART_FLAG_WIDTH = 8;

/**
 * Body mass index chart current index flag rectangle height.
 */
const BMI_CHART_FLAG_HEIGHT = 32;

/**
 * Height of a single chart.
 */
const CHART_HEIGHT = 256;

/**
 * Width of a tick on a x-axis. Used to calculate the number of ticks based on
 * current screen width.
 */
const TICK_WIDTH = 180;

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
 * Data dot label y offset.
 */
const LABEL_OFFSET = 10;

/**
 * Tooltip y offset.
 */
const TOOLTIP_OFFSET = 8;

/**
 * Maximum radius in pixels of area around line chart dot that will trigger the
 * tooltip for that dot if cursor is in that area.
 */
const HOVER_AREA_MAX_RADIUS = 50;

/**
 * Minimum width of remaining space to the edge of the screen needed to not
 * mirror the tooltip position.
 */
const TOOLTIP_FLIP_WIDTH = 128;

/**
 * Offset that will be subtracted from tooltip position (relative to top left
 * point of the tooltip space) and added to arrow offset if tooltip was
 * mirrored. Used to not let the tooltip overflow the screen area.
 */
const FLIP_OFFSET_X = 80;

/**
 * Function that offsets specified date `now` by half a day.
 */
const offsetHalfDay = (now: Date) => d3.timeHour.offset(now, 12);

/**
 * Area path generator function.
 */
const area = (
  x: d3.ScaleTime<number, number>,
  y: d3.ScaleLinear<number, number>
) =>
  d3
    .area<QuantityDataPoint>()
    .x(d => x(offsetHalfDay(new Date(d.date))))
    .y0(CHART_HEIGHT)
    .y1(d => CHART_HEIGHT - y(d.value))
    .curve(d3.curveMonotoneX);

/**
 * Line path generator function.
 */
const line = (
  x: d3.ScaleTime<number, number>,
  y: d3.ScaleLinear<number, number>
) =>
  d3
    .line<QuantityDataPoint>()
    .x(d => x(offsetHalfDay(new Date(d.date))))
    .y(d => CHART_HEIGHT - y(d.value))
    .curve(d3.curveMonotoneX);

/**
 * Tooltip value format options.
 */
const FORMAT_OPTIONS = {
  maximumFractionDigits: 1
};

/**
 * Statistics scene component translation.
 */
interface StatisticsTranslation {
  /**
   * Body mass index range name translations.
   */
  ranges: Record<BodyMassIndexRangeName, string>;

  /**
   * Time frame translations.
   */
  timeFrames: Record<TimeFrame, string>;

  /**
   * Scene title translation.
   */
  title: string;

  /**
   * Chart title translations.
   */
  titles: Record<"bodyMassIndex" | RequiredNutrient | Quantity, string>;
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
  @observable private data?: Data<"statistics", "getAll">;

  /**
   * Currently selected or hovered over data point value which information is
   * shown in the tooltip.
   */
  @observable private selectedPoint:
    | BodyMassIndexDataPoint
    | NutritionDataPoint
    | QuantityDataPoint = {
    date: "1970-01-01",
    value: 0
  };

  /**
   * Current tooltip position.
   */
  @observable private tooltipProps: TooltipProps = {
    x: 0,
    y: 0,
    arrowOffsetX: 0,
    mirrored: false,
    visible: false
  };

  /**
   * Currently selected time frame.
   */
  @observable private selectedTimeFrame: TimeFrame = "week";

  /**
   * Most recent width of the SVG element.
   */
  private svgWidth = 0;

  /**
   * Most recent width of a single chart.
   */
  private chartWidth = 0;

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

    d3.timeFormatDefaultLocale(this.props.views!.translation.timeLocale);
    window.addEventListener("resize", this.renderCharts, true);
  }

  /**
   * Removes added event listener before unmounting.
   */
  public componentWillUnmount() {
    window.removeEventListener("resize", this.renderCharts, true);
  }

  /**
   * Renders a translated title text element inside specified chart g element
   * for chart with specified name.
   */
  private renderChartTitle = (
    chart: d3.Selection<SVGGElement, any, any, any>,
    name: "bodyMassIndex" | Quantity | RequiredNutrient
  ) => {
    const title = chart
      .selectAll<SVGTextElement, never>("text.title")
      .data([0]);

    title
      .enter()
      .append("text")
      .attr("class", "title")
      .merge(title)
      .text(this.translation.titles[name])
      .attr("x", "0")
      .attr("y", -CHART_TITLE_HEIGHT / 2)
      .attr("alignment-baseline", "middle");
  };

  /**
   * Renders body mass index chart inside specified svg element.
   */
  private renderBodyMassIndexChart = (
    svg: d3.Selection<SVGSVGElement, number, HTMLDivElement, never>,
    domain: [Date, Date]
  ) => {
    let chart = svg.selectAll<SVGGElement, never>("g.bmi-chart").data([0]);

    chart = chart
      .enter()
      .append("g")
      .attr("class", "bmi-chart")
      .merge(chart)
      .attr(
        "transform",
        `translate(${PADDING.left}, ${PADDING.top + CHART_TITLE_HEIGHT})`
      );

    this.renderChartTitle(chart, "bodyMassIndex");

    let x = d3.scaleLinear().range([0, this.chartWidth]);
    let xAxis = d3.axisBottom(x);

    const data = this.getBodyMassIndices(this.data!, domain);

    if (data.length > 0) {
      const currentPoint = data[data.length - 1];
      const current = currentPoint.value;

      const { min, lt } = BODY_MASS_INDEX_RANGES.find(
        range => range.min <= current && current < range.lt
      )!;

      let domain: number[] = [];
      let ticks: number[] = [];

      if (Number.isFinite(min) && Number.isFinite(lt)) {
        ticks = [min, lt];
        domain = [min - (lt - min) / 2, lt + (lt - min) / 2];
      } else if (Number.isFinite(min)) {
        ticks = [min];
        domain = [min - (current - min), min + 2 * (current - min)];
      } else {
        ticks = [lt];
        domain = [lt - 2 * (lt - current), lt + (lt - current)];
      }

      x = x.domain(domain);
      xAxis = xAxis.tickValues(ticks);

      // Render range name labels.

      const rangeLabelData: Array<{
        x: number;
        name: BodyMassIndexRangeName;
      }> = [];

      // prettier-ignore
      if (domain.length === 1) {
        const [split] = ticks;
        const splitX = x(split);

        const leftRange = BODY_MASS_INDEX_RANGES.find(range => range.lt === split)!;
        const rightRange = BODY_MASS_INDEX_RANGES.find(range => range.min === split)!;

        rangeLabelData.push({ name: leftRange.name, x: splitX / 2 });
        rangeLabelData.push({ name: rightRange.name, x: (this.chartWidth + splitX) / 2 });
      } else {
        const [leftSplit, rightSplit] = ticks;
        const leftSplitX = x(leftSplit);
        const rightSplitX = x(rightSplit);

        const leftRange = BODY_MASS_INDEX_RANGES.find(range => range.lt === leftSplit)!
        const middleRange = BODY_MASS_INDEX_RANGES.find(range => range.lt === rightSplit)!
        const rightRange = BODY_MASS_INDEX_RANGES.find(range => range.min === rightSplit)!

        rangeLabelData.push({ name: leftRange.name, x: leftSplitX / 2 });
        rangeLabelData.push({ name: middleRange.name, x: this.chartWidth / 2 });
        rangeLabelData.push({ name: rightRange.name, x: (this.chartWidth + rightSplitX) / 2  });
      }

      const rangeLabels = chart
        .selectAll<SVGTextElement, never>("text.range")
        .data(rangeLabelData);

      rangeLabels.exit().remove();

      rangeLabels
        .enter()
        .append("text")
        .attr("class", "range")
        .merge(rangeLabels)
        .text(d => this.translation.ranges[d.name])
        .attr("x", d => d.x)
        .attr("y", BMI_CHART_HEIGHT / 2)
        .attr("alignment-baseline", "middle")
        .attr("text-anchor", "middle");

      if (data.length > 1) {
        const initialFlag = chart
          .selectAll<SVGRectElement, never>("rect.flag.initial")
          .data([data[0]]);

        initialFlag
          .enter()
          .append("rect")
          .attr("class", "flag initial")
          .merge(initialFlag)
          .attr("x", d => x(d.value) - BMI_CHART_FLAG_WIDTH / 2)
          .attr("y", BMI_CHART_HEIGHT - BMI_CHART_FLAG_HEIGHT)
          .attr("width", BMI_CHART_FLAG_WIDTH)
          .attr("height", BMI_CHART_FLAG_HEIGHT)
          .attr("data-offsetX", BMI_CHART_FLAG_WIDTH / 2)
          .attr("data-offsetY", 0)
          .on("mouseover", this.setSelectedPoint)
          .on("mouseleave", this.hideTooltip);
      }

      const currentFlag = chart
        .selectAll<SVGRectElement, never>("rect.flag.current")
        .data([currentPoint]);

      currentFlag
        .enter()
        .append("rect")
        .attr("class", "flag current")
        .merge(currentFlag)
        .attr("x", d => x(d.value) - BMI_CHART_FLAG_WIDTH / 2)
        .attr("y", BMI_CHART_HEIGHT - BMI_CHART_FLAG_HEIGHT)
        .attr("width", BMI_CHART_FLAG_WIDTH)
        .attr("height", BMI_CHART_FLAG_HEIGHT)
        .attr("data-offsetX", BMI_CHART_FLAG_WIDTH / 2)
        .attr("data-offsetY", 0)
        .on("mouseover", this.setSelectedPoint)
        .on("mouseleave", this.hideTooltip);

      const label = chart
        .selectAll<SVGTextElement, never>("text.label")
        .data([currentPoint]);

      label
        .enter()
        .append("text")
        .attr("class", "label")
        .merge(label)
        .text(d =>
          d.value.toLocaleString(
            this.props.views!.translation.locale,
            FORMAT_OPTIONS
          )
        )
        .attr("x", d => x(d.value))
        .attr("y", BMI_CHART_HEIGHT - BMI_CHART_FLAG_HEIGHT - LABEL_OFFSET)
        .attr("text-anchor", "middle");
    }

    const axis = chart.selectAll<SVGGElement, never>("g.axis").data([0]);

    axis
      .enter()
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0, ${BMI_CHART_HEIGHT})`)
      .merge(axis)
      .call(xAxis);
  };

  /**
   * Renders a bar chart of nutrient amounts and limits inside specified SVG
   * group selection.
   */
  private renderNutrientChart = (
    chart: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: NutritionDataPoint[],
    x: d3.ScaleTime<number, number>,
    setSelectedPoint: (point: NutritionDataPoint) => void,
    hideTooltip: () => void
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

    // Render the bars.
    const bars = chart.selectAll<SVGRectElement, never>("rect").data(data);

    // prettier-ignore
    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .merge(bars)
      .attr("x", d => x(new Date(d.date)))
      .attr("y", d => CHART_HEIGHT - y(d.value))
      .attr("height", d => y(d.value))
      .attr("width", d => x(d3.timeDay.offset(new Date(d.date), 1)) - x(new Date(d.date)))
      .attr("data-offsetX", d => x(offsetHalfDay(new Date(d.date))) - x(new Date(d.date)))
      .attr("data-offsetY", 0)
      .on("mouseover", setSelectedPoint)
      .on("mouseleave", hideTooltip);

    // Render the top border line of each bar
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

    // Render limit lines
    const limits = chart
      .selectAll<SVGLineElement, never>("line.bar-limit")
      .data(data);

    // prettier-ignore
    limits
      .enter()
      .append("line")
      .attr("class", "bar-limit")
      .merge(limits)
      .attr("x1", d => x(new Date(d.date)))
      .attr("y1", d => CHART_HEIGHT - y(d.limit))
      .attr("x2", (d, i) => x(i + 1 === data.length ? d3.timeDay.offset(new Date(d.date), 1) : new Date(data[i + 1].date)))
      .attr("y2", d => CHART_HEIGHT - y(d.limit));
  };

  /**
   * Renders chart inside specified SVG with given measurements inside specified
   * SVG group selection.
   */
  private renderQuantityChart = function(
    chart: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: QuantityDataPoint[],
    x: d3.ScaleTime<number, number>,
    setSelectedPoint: (point: QuantityDataPoint) => void,
    hideTooltip: () => void,
    locale: string
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

    // Render the area shape below the line chart.
    const areaPath = chart
      .selectAll<SVGPathElement, never>("path.area")
      .data([0]);

    areaPath
      .enter()
      .append("path")
      .attr("class", "area")
      .merge(areaPath)
      .attr("d", area(x, y)(data)!);

    // Render the line element.
    const linePath = chart
      .selectAll<SVGPathElement, never>("path.line")
      .data([0]);

    linePath
      .enter()
      .append("path")
      .attr("class", "line")
      .merge(linePath)
      .attr("d", line(x, y)(data)!);

    // Draw data points.
    const dots = chart
      .selectAll<SVGCircleElement, never>("circle.dot")
      .data(data);

    dots
      .enter()
      .append("circle")
      .attr("class", "dot")
      .merge(dots)
      .attr("cx", d => x(offsetHalfDay(new Date(d.date))))
      .attr("cy", d => CHART_HEIGHT - y(d.value))
      .attr("r", DOT_RADIUS);

    // Add hoverable area around each dto so that on mouse enter tooltip of that
    // point will be shown.
    const hoverAreaBounds: Array<QuantityDataPoint & {
      x: number;
      width: number;
    }> = [];

    // prettier-ignore
    for (let i = 0; i < data.length; ++i) {
      const currentX = x(offsetHalfDay(new Date(data[i].date)));
      const previousX = i - 1 < 0 ? currentX - 2 * HOVER_AREA_MAX_RADIUS : x(offsetHalfDay(new Date(data[i - 1].date)));
      const nextX = i + 1 === data.length ? currentX + 2 * HOVER_AREA_MAX_RADIUS : x(offsetHalfDay(new Date(data[i + 1].date)));
      const leftX = Math.max(currentX - HOVER_AREA_MAX_RADIUS, (currentX + previousX) / 2);
      const rightX = Math.min(currentX + HOVER_AREA_MAX_RADIUS, (currentX + nextX) / 2);

      hoverAreaBounds.push({...data[i], x: leftX, width: rightX - leftX});
    }

    const hoverAreas = chart
      .selectAll<SVGRectElement, never>("rect.hover-area")
      .data(hoverAreaBounds);

    hoverAreas
      .enter()
      .append("rect")
      .attr("class", "hover-area")
      .merge(hoverAreas)
      .attr("x", d => d.x)
      .attr("y", 0)
      .attr("width", d => d.width)
      .attr("height", CHART_HEIGHT)
      .attr("data-offsetX", d => x(offsetHalfDay(new Date(d.date))) - d.x)
      .attr("data-offsetY", d => CHART_HEIGHT - y(d.value))
      .attr("fill", "transparent")
      .on("mouseover", setSelectedPoint)
      .on("mouseleave", hideTooltip);

    // Filter out label positions so that there wouldn't be any overlap.
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
    }, [] as typeof data);

    // Render some of the point labels.
    const labels = chart
      .selectAll<SVGTextElement, never>("text.label")
      .data(labelPoints);

    labels.exit().remove();

    labels
      .enter()
      .append("text")
      .attr("class", "label")
      .merge(labels)
      .text(d => d.value.toLocaleString(locale, FORMAT_OPTIONS))
      .attr("x", d => x(offsetHalfDay(new Date(d.date))))
      .attr("y", d => CHART_HEIGHT - y(d.value) - LABEL_OFFSET)
      .attr("text-anchor", "middle");
  };

  /**
   * Returns chart time axis domain depending on currently selected time frame.
   */
  private getTimeDomain(data: Data<"statistics", "getAll">): [Date, Date] {
    const now = new Date();
    now.setHours(23, 59, 999);

    if (this.selectedTimeFrame === "all") {
      const milliseconds = data
        .map(data => data.data)
        .flat()
        .map(point => new Date(point.date).valueOf());

      // Force minimum to be at least 1 year from now.
      milliseconds.push(TIME_FRAME_OFFSET_FUNCTIONS.year(now).valueOf());

      return [new Date(d3.min(milliseconds)!), now];
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

    const totalHeight =
      PADDING.top + // Top padding
      (CHART_TITLE_HEIGHT + BMI_CHART_HEIGHT) + // BMI chart size
      this.data.length * (CHART_GAP + CHART_TITLE_HEIGHT + CHART_HEIGHT) + // All other chart sizes
      PADDING.bottom; // Bottom padding

    let svg = canvas.selectAll<SVGSVGElement, never>("svg").data([0]);
    svg = svg
      .enter()
      .append("svg")
      .merge(svg)
      .attr("height", totalHeight);

    this.svgWidth = svg.node()!.clientWidth;
    this.chartWidth = this.svgWidth - PADDING.left - PADDING.right;

    const domain = this.getTimeDomain(this.data);

    this.renderBodyMassIndexChart(svg, domain);

    const x = d3
      .scaleUtc()
      .range([0, this.chartWidth])
      .domain(domain)
      .nice();

    const xAxis = d3.axisBottom(x).ticks(this.chartWidth / TICK_WIDTH);

    let charts = svg.selectAll<SVGGElement, never>("g.chart").data(this.data);

    charts = charts
      .enter()
      .append("g")
      .attr("class", "chart")
      .merge(charts);

    // Make instance fields local since `this` will be the SVG G element inside `each` function.
    const renderChartTitle = this.renderChartTitle;
    const renderNutrientChart = this.renderNutrientChart;
    const renderQuantityChart = this.renderQuantityChart;
    const setSelectedPoint = this.setSelectedPoint;
    const hideTooltip = this.hideTooltip;
    const locale = this.props.views!.translation.locale;

    // prettier-ignore
    charts
      .attr("transform", (_, index) => `translate(${PADDING.left}, ${PADDING.top + (CHART_TITLE_HEIGHT + BMI_CHART_HEIGHT) + CHART_GAP + CHART_TITLE_HEIGHT + index * (CHART_GAP + CHART_TITLE_HEIGHT + CHART_HEIGHT)})`)
      .each(function(data) {
        const chart = d3.select(this);

        renderChartTitle(chart, data.name);

        if (data.type === "nutrition") {
          renderNutrientChart(chart, data.data, x, setSelectedPoint, hideTooltip);
        } else {
          renderQuantityChart(chart, data.data, x, setSelectedPoint, hideTooltip, locale);
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
      <RelativeContainer>
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

        <Tooltip {...this.tooltipProps}>
          <Title>
            {new Date(this.selectedPoint.date).toLocaleDateString(
              this.props.views!.translation.locale
            )}
          </Title>

          <Value>
            {this.selectedPoint.value.toLocaleString(
              this.props.views!.translation.locale,
              FORMAT_OPTIONS
            )}

            {"limit" in this.selectedPoint && (
              <Secondary>
                {"\u00a0/\u00a0" /* Forward slash between two spaces */}
                {this.selectedPoint.limit.toLocaleString(
                  this.props.views!.translation.locale,
                  FORMAT_OPTIONS
                )}
              </Secondary>
            )}
          </Value>

          <Aligner>
            <Arrow offsetX={this.tooltipProps.arrowOffsetX} />
          </Aligner>
        </Tooltip>
      </RelativeContainer>
    );
  }

  /**
   * Sets appropriate time frame on tab click.
   */
  private selectTimeFrame: React.MouseEventHandler<
    HTMLButtonElement
  > = event => {
    this.selectedTimeFrame = event.currentTarget.value as TimeFrame;
    this.renderCharts();
  };

  /**
   * Sets currently selected point.
   */
  @action
  private setSelectedPoint = (
    point: BodyMassIndexDataPoint | NutritionDataPoint | QuantityDataPoint
  ) => {
    this.selectedPoint = point;

    const target = d3.event.target as HTMLElement;
    const boundingRectangle = target.getBoundingClientRect();

    this.tooltipProps.x =
      boundingRectangle.x +
      Number.parseFloat(target.getAttribute("data-offsetX")!);
    this.tooltipProps.arrowOffsetX = 0;
    this.tooltipProps.mirrored = false;

    // If tooltip is too close to the left edge, offset tooltip by
    // `FLIP_OFFSET_X` and arrow back by the same amount.
    if (this.tooltipProps.x < TOOLTIP_FLIP_WIDTH) {
      this.tooltipProps.x += FLIP_OFFSET_X;
      this.tooltipProps.arrowOffsetX -= FLIP_OFFSET_X;
    }

    // If tooltip is too close to the right edge, flip the coordinate system
    // from left to right so that tooltip will not be automatically wrapped
    // because of the edge and offset the tooltip to the left by
    // `FLIP_OFFSET_X`.
    if (this.svgWidth - this.tooltipProps.x < TOOLTIP_FLIP_WIDTH) {
      this.tooltipProps.x = this.svgWidth - this.tooltipProps.x;
      this.tooltipProps.x += FLIP_OFFSET_X;
      this.tooltipProps.arrowOffsetX += FLIP_OFFSET_X;
      this.tooltipProps.mirrored = true;
    }

    // Find the absolute y coordinate for the tooltip.
    let scrollTopSum = 0;
    let element: HTMLElement | null = target;

    while (element) {
      scrollTopSum += element.scrollTop;
      element = element.parentElement;
    }

    this.tooltipProps.y =
      scrollTopSum +
      boundingRectangle.y +
      Number.parseFloat(target.getAttribute("data-offsetY")!) -
      TOOLTIP_OFFSET;

    this.tooltipProps.visible = true;
  };

  /**
   * Returns a body mass index value data set based on heights and weights data specified by given `data`.
   */
  private getBodyMassIndices(
    data: Data<"statistics", "getAll">,
    domain: [Date, Date]
  ): BodyMassIndexDataPoint[] {
    const nameProperties = [
      ["Height", "height"],
      ["Weight", "weight"]
    ] as const;

    interface PartialValues {
      weight?: number;
      height?: number;
    }

    // Maps dates to their optional weight and height values.
    const dateValues = new Map<string, PartialValues>();

    for (const [name, property] of nameProperties) {
      for (const point of data.find(set => set.name === name)?.data || []) {
        const values = dateValues.get(point.date);

        if (values === undefined) {
          dateValues.set(point.date, { [property]: point.value });
        } else {
          values[property] = point.value;
        }
      }
    }

    return Array.from(dateValues.entries())
      .map(([date, values]) => ({ date, values }))
      .sort((a, b) => new Date(a.date).valueOf() - new Date(b.date).valueOf())
      .reduce((accumulator, { date, values }, index, entries) => {
        if (values.height !== undefined && values.weight !== undefined) {
          accumulator.push({
            date,
            height: values.height,
            weight: values.weight
          });
        } else {
          const existingProperty =
            values.height !== undefined ? "height" : "weight";
          const additionalProperty =
            values.height === undefined ? "height" : "weight";

          for (let i = index - 1; i >= 0; --i) {
            const additionalValues = entries[i].values;

            if (additionalValues[additionalProperty] !== undefined) {
              accumulator.push(({
                date,
                [existingProperty]: values[existingProperty],
                [additionalProperty]: additionalValues[additionalProperty]
              } as unknown) as { date: string; height: number; weight: number });

              break;
            }
          }
        }

        return accumulator;
      }, [] as Array<{ date: string; height: number; weight: number }>)
      .map(({ date, height, weight }) => ({
        date,
        value: weight / (height / 100) ** 2
      }))
      .filter(point => {
        const dateValue = new Date(point.date).valueOf();

        return (
          domain[0].valueOf() <= dateValue && dateValue <= domain[1].valueOf()
        );
      });
  }

  /**
   * Hides the tooltip.
   */
  @action
  private hideTooltip = () => {
    this.tooltipProps.visible = false;
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
 * Container component with position set to relative.
 */
const RelativeContainer = styled.div`
  position: relative;
  overflow-x: hidden;
`;

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

  & svg .range {
    fill: ${({ theme }) => theme.colorSecondary};
  }

  & svg .flag.initial {
    fill: ${({ theme }) => theme.borderColor};
  }

  & svg .flag.current {
    fill: ${({ theme }) => theme.colorActive};
  }

  & svg .bar {
    fill: ${({ theme }) => theme.colorActive};
    opacity: 0.25;
  }

  & svg .bar-top {
    stroke: ${({ theme }) => theme.colorActive};
    stroke-width: 2;
    pointer-events: none;
  }

  & svg .bar-limit {
    stroke: ${({ theme }) => theme.colorSecondary};
    stroke-width: 2;
    pointer-events: none;
  }

  & svg .line {
    fill: none;
    stroke: ${({ theme }) => theme.colorActive};
    stroke-width: 2;
    pointer-events: none;
  }

  & svg .area {
    fill: ${({ theme }) => theme.colorActive};
    opacity: 0.25;
    pointer-events: none;
  }

  & svg .dot {
    fill: ${({ theme }) => theme.backgroundColor};
    stroke: ${({ theme }) => theme.colorActive};
    stroke-width: 2;
    pointer-events: none;
  }

  & svg .label {
    fill: ${({ theme }) => theme.colorPrimary};
    pointer-events: none;
  }
`;

/**
 * Top tab bar component.
 */
const Tabs = styled.div`
  position: sticky;
  top: 0;

  z-index: 1;

  width: 100%;
  height: ${({ theme }) => theme.height};
  flex-shrink: 0;

  display: flex;

  & > ${Tab} {
    flex-shrink: 1;
  }

  background-color: ${({ theme }) => theme.backgroundColor};
`;

/**
 * Tooltip component props.
 */
interface TooltipProps {
  /**
   * Tooltip arrow offset.
   */
  arrowOffsetX: number;

  /**
   * Whether right positioning system should be used.
   */
  mirrored: boolean;

  /**
   * Whether tooltip is visible.
   */
  visible: boolean;

  /**
   * Absolute x coordinate.
   */
  x: number;

  /**
   * Absolute y coordinate.
   */
  y: number;
}

/**
 * Tooltip component.
 */
const Tooltip = styled.div<TooltipProps>`
  position: absolute;
  top: ${({ y }) => y}px;
  ${({ mirrored, x }) => (mirrored ? `right: ${x}px` : `left: ${x}px`)};
  transform: translate(${({ mirrored }) => (mirrored ? "50%" : "-50%")}, -100%);
  z-index: 2;

  width: calc(4 * ${({ theme }) => theme.height});

  border: solid 1px ${({ theme }) => theme.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.backgroundColor};
  opacity: ${({ visible }) => (visible ? 1 : 0)};

  color: ${({ theme }) => theme.colorPrimary};

  transition: opacity ${({ theme }) => theme.transition};

  pointer-events: none;
`;

/**
 * Tooltip title component.
 */
const Title = styled.div`
  height: ${({ theme }) => theme.padding};
  border-bottom: solid 1px ${({ theme }) => theme.borderColor};

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colorSecondary};
`;

/**
 * Tooltip point value component.
 */
const Value = styled.div`
  padding: ${({ theme }) => theme.paddingSecondary};

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colorPrimary};
  font-size: 1.5rem;
  letter-spacing: -0.019em;
`;

/**
 * Secondary colored span element.
 */
const Secondary = styled.span`
  color: ${({ theme }) => theme.colorSecondary};
`;

/**
 * Component that aligns the tooltip arrow.
 */
const Aligner = styled.div`
  width: 100%;
  height: 0;

  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Arrow component props.
 */
interface ArrowProps {
  /**
   * Arrow x offset from the center of the tooltip.
   */
  offsetX: number;
}

/**
 * Tooltip bottom arrow component.
 */
const Arrow = styled.div<ArrowProps>`
  width: ${({ theme }) => theme.paddingSecondary};
  height: ${({ theme }) => theme.paddingSecondary};

  background-color: ${({ theme }) => theme.backgroundColor};
  border-style: solid;
  border-color: ${({ theme }) => theme.borderColor};
  border-width: 0 1px 1px 0;
  box-sizing: border-box;

  transform: translate(${({ offsetX }) => offsetX}px, 1px) rotateZ(45deg);
`;
