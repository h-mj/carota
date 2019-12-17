import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { Component } from "../../base/Component";
import { styled } from "../../styling/theme";
import { toIsoDateString } from "../../utility/form";
import { Tab } from "../Tab";

/**
 * Number of tabs on both sides of selected date..
 */
export const TAB_RADIUS = 3;

/**
 * Compares two ISO date strings.
 */
const compare = (first: string, second: string) =>
  new Date(first).valueOf() - new Date(second).valueOf();

/**
 * Returns an array of ordered dates that are around specified `center`
 * date and which distance in days is at most `radius`.
 */
const around = (center: string, radius: number): string[] => {
  const dateIterator = new Date(center);
  dateIterator.setDate(dateIterator.getDate() - radius);

  return Array.from({ length: 2 * radius + 1 }, () => {
    const date = toIsoDateString(dateIterator);
    dateIterator.setDate(dateIterator.getDate() + 1);
    return date;
  });
};

/**
 * Merges two date string arrays into one. Returned array is ordered and does
 * not have duplicate date strings.
 */
const merge = (first: string[], second: string[]) => {
  return first
    .concat(second)
    .sort(compare)
    .filter((value, index, array) =>
      index === 0 ? true : value !== array[index - 1]
    );
};

/**
 * Tabs component props.
 */
interface TabsProps {
  /**
   * Currently selected date.
   */
  date: string;

  /**
   * Select date callback function.
   */
  select: (date: string) => void;
}

/**
 * Component that renders `VISIBLE_TAB_COUNT` tabs around specified current
 * date.
 */
@inject("views")
@observer
export class Tabs extends Component<TabsProps> {
  /**
   * Previously selected date.
   */
  private previousDate: string;

  /**
   * Selected tab offset.
   */
  private offset: number;

  /**
   * Sets the name of this component.
   */
  public constructor(props: TabsProps) {
    super(props);

    this.previousDate = props.date;
    this.offset = 0;
  }

  /**
   * Aligns and renders all tab components.
   */
  public render() {
    const dates = merge(
      around(this.previousDate, TAB_RADIUS),
      around(this.props.date, TAB_RADIUS)
    );

    const index = dates.findIndex(date => date === this.props.date);

    this.offset +=
      dates.findIndex(date => date === this.props.date) -
      dates.findIndex(date => date === this.previousDate);

    this.previousDate = this.props.date;

    return (
      <Container>
        <Aligner>
          <Positioner anchor={index - this.offset} offset={this.offset}>
            {dates.map(date => (
              <Tab
                key={date.toString()}
                highlighted={date === toIsoDateString(new Date())}
                onClick={this.handleClick}
                selected={date === this.props.date}
                value={date.toString()}
              >
                {new Date(date).getDate()}
                <Abbreviation>
                  {
                    this.props.views!.translation.timeLocale.shortMonths[
                      new Date(date).getMonth()
                    ]
                  }
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
    this.props.select(event.currentTarget.value);
  };
}

/**
 * Container component that wraps all other components.
 */
const Container = styled.div`
  min-width: 0;
  height: 100%;
  flex-grow: 1;
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
   * Theoretical index of `anchor` date within `dates` array. Can be out of
   * bounds of the array.
   */
  anchor: number;

  /**
   * Currently selected date index offset from `anchor` index.
   */
  offset: number;
}

/**
 * Wrapper component that wraps all date tabs and positions them based on
 * specified selected date index.
 */
const Positioner = styled.div<PositionerProps>`
  position: relative;
  left: ${({ anchor }) => -100 * anchor}%;
  transform: translateX(${({ offset }) => -100 * offset}%);

  min-width: 0;
  height: 100%;

  display: flex;

  transition: transform ${({ theme }) => theme.transitionSlow};
`;

/**
 * Month abbreviation container.
 */
const Abbreviation = styled.span`
  margin-left: ${({ theme }) => theme.paddingSecondaryHalf};

  @media screen and (max-width: ${({ theme }) => theme.widthCutoff}) {
    display: block;
    margin-left: 0;
    font-size: 0.75rem;
    letter-spacing: 0;
  }
`;
