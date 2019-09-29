import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";

import { TranslatedComponent } from "../../base/TranslatedComponent";
import { RESET } from "../../styling/stylesheets";
import { equals, toDateArray } from "./DateSelect";

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
 * Number of visible tabs.
 */
export const TAB_COUNT = 7;

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
   * Sets the name of this component.
   */
  public constructor(props: TabsProps) {
    super("Tabs", props);
  }

  /**
   * Renders all tabs.
   */
  public render() {
    const currentDate = toDateArray(new Date());
    const selectedDate = toDateArray(this.props.date);

    const dateIterator = new Date(this.props.date);
    dateIterator.setDate(dateIterator.getDate() - Math.floor(TAB_COUNT / 2));

    return (
      <Container>
        <Aligner>
          <Positioner index={3}>
            {Array.from({ length: TAB_COUNT }, () => {
              const date = toDateArray(dateIterator);
              dateIterator.setDate(dateIterator.getDate() + 1);

              return (
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
              );
            })}
          </Positioner>
        </Aligner>
      </Container>
    );
  }

  /**
   * Calls select callback function when user clicks on one of the dates.
   */
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
  width: calc(100% / ${TAB_COUNT});
  height: 100%;
  margin: 0 auto;
`;

/**
 * Positioner component props.
 */
interface PositionerProps {
  /**
   * Currently selected date index.
   */
  index: number;
}

/**
 * Wrapper component that wraps all date tabs and positions them based on
 * specified selected date index.
 */
const Positioner = styled.div<PositionerProps>`
  position: relative;
  left: ${({ index }) => -100 * index}%;
  min-width: 0;
  height: 100%;
  display: flex;
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
