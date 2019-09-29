import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";

import { TranslatedComponent } from "../../base/TranslatedComponent";
import { RESET } from "../../styling/stylesheets";
import { DateArray, equals, toDateArray } from "./DateSelect";

/**
 * Tabs component props.
 */
interface TabsProps {
  /**
   * Currently selected date.
   */
  date: Date;

  /**
   * Select date callback function.
   */
  select: (date: Date) => void;
}

/**
 * Tabs component translations.
 */
interface TabsTranslations {
  /**
   * Translated month name abbreviations.
   */
  abbreviations: string[];
}

/**
 * Number of tabs on both sides of selected date..
 */
export const TAB_RADIUS = 3;

/**
 * Returns an array of ordered date arrays that are around specified `center`
 * and which distance in days is at most `radius`.
 */
const getDatesAround = (center: DateArray, radius: number): DateArray[] => {
  const dateIterator = new Date(...center);
  dateIterator.setDate(dateIterator.getDate() - radius);

  return Array.from({ length: 2 * radius + 1 }, () => {
    const date = toDateArray(dateIterator);
    dateIterator.setDate(dateIterator.getDate() + 1);
    return date;
  });
};

/**
 * Compares two array dates and returns 0 if they are equal, positive number if
 * `first` is before `second`, otherwise negative number.
 */
const compare = (first: DateArray, second: DateArray) => {
  for (let i = 0; i < first.length; ++i) {
    if (first[i] === second[i]) {
      continue;
    }

    return first[i] - second[i];
  }

  return 0;
};

/**
 * Merges two date array arrays into one. Returned array is ordered and does not
 * have duplicate date arrays.
 */
const merge = (first: DateArray[], second: DateArray[]) => {
  return first
    .concat(second)
    .sort(compare)
    .filter((value, index, array) =>
      index === 0 ? true : !equals(value, array[index - 1])
    );
};

/**
 * Component that renders `VISIBLE_TAB_COUNT` tabs around specified current
 * date.
 */
@inject("views")
@observer
export class Tabs extends TranslatedComponent<
  "Tabs",
  TabsProps,
  TabsTranslations
> {
  /**
   * Array of currently rendered tab date arrays.
   */
  @observable private dates: DateArray[];

  /**
   * Comparison result between current selected date and previous selected date.
   */
  private direction = 0;

  /**
   * ID of a timeout that removes unnecessary date arrays from `dates` array.
   */
  private clearDatesTimeoutId = 0;

  /**
   * Sets the name of this component.
   */
  public constructor(props: TabsProps) {
    super("Tabs", props);

    this.dates = getDatesAround(toDateArray(props.date), TAB_RADIUS);
  }

  /**
   * Load tab dates around new selected date.
   */
  public componentDidUpdate(previousProps: TabsProps) {
    const date = toDateArray(this.props.date);
    const previousDate = toDateArray(previousProps.date);

    this.direction = compare(date, previousDate);

    if (this.direction === 0) {
      return;
    }

    this.dates = merge(this.dates, getDatesAround(date, TAB_RADIUS));
    window.clearTimeout(this.clearDatesTimeoutId);

    // Replaces `dates` array with dates around currently selected date.
    this.clearDatesTimeoutId = window.setTimeout(
      () => (this.dates = getDatesAround(date, TAB_RADIUS)),
      1000
    );
  }

  /**
   * Aligns and renders all tab components.
   */
  public render() {
    const currentDate = toDateArray(new Date());
    const selectedDate = toDateArray(this.props.date);
    const offset =
      (this.dates.length - 1) / 2 -
      this.dates.findIndex(date => equals(date, selectedDate));

    return (
      <Container>
        <Aligner>
          <Positioner offset={offset}>
            {this.dates.map(date => (
              <Tab
                key={date.toString()}
                current={equals(date, currentDate)}
                onClick={this.handleClick}
                selected={equals(date, selectedDate)}
                value={date.toString()}
              >
                <div>{date[2]}</div>
                <Abbreviation>
                  {this.translation.abbreviations[date[1]]}
                </Abbreviation>
              </Tab>
            ))}
          </Positioner>
        </Aligner>
      </Container>
    );
  }

  /**
   * Calls select callback function when user clicks on one of the dates.
   */
  @action
  private handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const [year, month, date] = event.currentTarget.value
      .split(",")
      .map(value => Number.parseInt(value, 10));

    this.props.select(new Date(year, month, date));
  };
}

/**
 * Container component that wraps all other components.
 */
const Container = styled.div`
  width: 100%;
  height: 100%;
`;

/**
 * Component which width is equal to width of one tab and which is positioned at
 * the middle of its parent component.
 */
const Aligner = styled.div`
  width: calc(100% / ${2 * TAB_RADIUS + 1});
  height: 100%;
  margin: 0 auto;
`;

/**
 * Positioner component props.
 */
interface PositionerProps {
  /**
   * Currently selected date index offset from center.
   */
  offset: number;
}

/**
 * Wrapper component that wraps all date tabs and positions them based on
 * specified selected date index.
 */
const Positioner = styled.div<PositionerProps>`
  position: relative;
  left: ${({ offset }) => 100 * offset}%;

  min-width: 0;
  height: 100%;

  display: flex;
  justify-content: center;

  transition: ${({ offset, theme }) =>
    offset === 0 ? "none" : theme.transition};
`;

/**
 * Tab date component props.
 */
interface TabProps {
  /**
   * Whether this date is current date.
   */
  current: boolean;

  /**
   * Whether this date is selected.
   */
  selected: boolean;
}

/**
 * Tab component.
 */
const Tab = styled.button<TabProps>`
  ${RESET};

  width: 100%;
  height: 100%;
  flex-shrink: 0;

  border-top: ${({ current, selected }) =>
    selected || current ? `solid 3px transparent` : `solid 1px transparent`};
  border-bottom: ${({ current, selected, theme }) =>
    selected
      ? `solid 3px ${theme.orange}`
      : current
      ? `solid 3px ${theme.borderColor}`
      : `solid 1px ${theme.borderColor}`};
  box-sizing: border-box;

  color: ${({ current, selected, theme }) =>
    current || selected ? theme.primaryColor : theme.secondaryColor};
  font-feature-settings: "tnum" 1;
  text-align: center;

  cursor: pointer;

  transition: ${({ theme }) => theme.transition};
`;

/**
 * Month abbreviation container.
 */
const Abbreviation = styled.div`
  font-size: 0.8rem;
`;
