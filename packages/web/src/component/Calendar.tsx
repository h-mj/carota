import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { css } from "styled-components";

import { TranslatedComponent } from "../base/TranslatedComponent";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";

/**
 * Calendar component props.
 */
interface CalendarProps {
  /**
   * Function that will be called when selected data value changes.
   */
  onChange?: (value: Date) => void;

  /**
   * Currently selected date.
   */
  value: Date;
}

/**
 * Calendar component translation.
 */
interface CalendarTranslation {
  /**
   * Array of translated month name abbreviations.
   */
  abbreviations: string[];

  /**
   * Array of translated day labels.
   */
  days: string[];

  /**
   * Array of translated month names.
   */
  months: string[];
}

/**
 * Converts a specified date to an array of form `[year, month, date]`.
 */
const toDateArray = (date: Date) =>
  [date.getFullYear(), date.getMonth(), date.getDate()] as const;

/**
 * Returns whether specified array date equals another specified array date.
 */
const equals = (
  date1: readonly [number, number, number],
  date2: readonly [number, number, number]
) => {
  return (
    date1[0] === date2[0] && date1[1] === date2[1] && date1[2] === date2[2]
  );
};

/**
 * Total number of days visible in tab form.
 */
const TAB_DAY_COUNT = 7;

/**
 * Calendar component that is used to select a date.
 */
@inject("views")
@observer
export class Calendar extends TranslatedComponent<
  "Calendar",
  CalendarProps,
  CalendarTranslation
> {
  /**
   * Currently visible month.
   */
  @observable private month: number;

  /**
   * Currently visible year.
   */
  @observable private year: number;

  /**
   * Whether entire calendar should be rendered.
   */
  @observable private expanded = false;

  /**
   * Creates a new `Calendar` component and initializes `month` and `year`
   * fields based on currently selected date.
   */
  public constructor(props: CalendarProps) {
    super("Calendar", props);

    this.month = props.value.getMonth();
    this.year = props.value.getFullYear();
  }

  /**
   * Renders the calendar component.
   */
  public render() {
    return (
      <Bar>
        <Wrapper>
          {this.renderTabs()}
          {this.expanded && this.renderCalendar()}
        </Wrapper>
      </Bar>
    );
  }

  /**
   * Renders `TAB_DAY_COUNT` dates around currently selected date.
   */
  private renderTabs() {
    const dateIter = new Date(this.props.value);
    dateIter.setDate(dateIter.getDate() - Math.floor(TAB_DAY_COUNT / 2));

    return (
      <Tabs>
        {Array.from({ length: TAB_DAY_COUNT }, () => {
          const date = toDateArray(dateIter);
          dateIter.setDate(dateIter.getDate() + 1);

          return this.renderDate(date, true);
        })}

        <Button onClick={this.toggleExpand}>{this.expanded ? "↑" : "↓"}</Button>
      </Tabs>
    );
  }

  /**
   * Renders whole calendar.
   */
  private renderCalendar() {
    // Offset which is equal to the number of days from the start of the week
    // before the first day of current month.
    const offset = (new Date(this.year, this.month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

    return (
      <Grid>
        <Button onClick={this.decrement}>←</Button>
        <Title>
          {this.translation.months[this.month]} {this.year}
        </Title>
        <Button onClick={this.increment}>→</Button>

        {this.translation.days.map((day, index) => (
          <Header key={day + index} isSunday={index === 6}>
            {day}
          </Header>
        ))}

        {offset !== 0 && <Offset size={offset} />}

        {Array.from({ length: daysInMonth }, (_, i) =>
          this.renderDate([this.year, this.month, i + 1])
        )}
      </Grid>
    );
  }

  /**
   * Renders date button for specified date array with optional abbreviation.
   */
  private renderDate(date: readonly [number, number, number], asTab = false) {
    const currentDate = toDateArray(new Date());
    const selectedDate = toDateArray(this.props.value);

    return (
      <Button
        key={date.toString()}
        onClick={this.handleClick}
        value={date.toString()}
      >
        <Day
          asTab={asTab}
          current={equals(date, currentDate)}
          isSunday={new Date(...date).getDay() === 0}
          selected={equals(date, selectedDate)}
        >
          <div>{date[2]}</div>

          {asTab && (
            <Abbreviation>
              {this.translation.abbreviations[date[1]]}
            </Abbreviation>
          )}
        </Day>
      </Button>
    );
  }

  /**
   * Increments current month and year, if needed.
   */
  @action
  private increment = () => {
    ++this.month;

    if (this.month === 12) {
      ++this.year;
      this.month = 0;
    }
  };

  /**
   * Decrements current month and year, if needed.
   */
  @action
  private decrement = () => {
    --this.month;

    if (this.month === -1) {
      --this.year;
      this.month = 11;
    }
  };

  /**
   * Toggles whether full calendar is visible.
   */
  @action
  private toggleExpand = () => {
    this.expanded = !this.expanded;
  };

  /**
   * Calls `onChange` callback function when user clicks on any date.
   */
  @action
  private handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    const { onChange } = this.props;

    if (onChange === undefined) {
      return;
    }

    const [year, month, day] = event.currentTarget.value
      .split(",")
      .map(value => Number.parseInt(value, 10));

    this.year = year;
    this.month = month;

    onChange(new Date(year, month, day));
  };
}

/**
 * Container component that wraps both `Tabs` and `Grid` components.
 */
const Bar = styled.div`
  height: ${({ theme }) => theme.height};
`;

/**
 * Container that wraps all components.
 */
const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  border-bottom: solid 1px ${({ theme }) => theme.borderColor};
`;

/**
 * Component that wraps date components of dates around currently selected date.
 */
const Tabs = styled(Bar)`
  display: grid;
  grid-template-rows: ${({ theme }) => theme.height};
  grid-template-columns: repeat(8, 1fr);
`;

/**
 * Calendar date grid component.
 */
const Grid = styled.div`
  max-width: ${({ theme }) => theme.widthMedium};
  width: 100%;

  padding: ${({ theme }) => theme.padding} 0;
  margin: auto;

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: ${({ theme }) => theme.height};

  @media screen and (max-width: ${({ theme }) => theme.widthSmall}) {
    padding: 0;
  }
`;

/**
 * Button that is used to increment or decrement current month.
 */
const Button = styled.button`
  ${RESET};

  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;

/**
 * Component that displays current month and year.
 */
const Title = styled.div`
  grid-column-start: span 5;

  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Header component props.
 */
interface HeaderProps {
  /**
   * Whether the day is a sunday.
   */
  isSunday: boolean;
}

/**
 * Component that contains day label.
 */
const Header = styled.div<HeaderProps>`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme, isSunday }) =>
    isSunday ? theme.orange : theme.secondaryColor};
`;

/**
 * Offset component props.
 */
interface VoidProps {
  /**
   * Offset size in columns.
   */
  size: number;
}

/**
 * Offset that takes up specified number (`size` prop value) of cells.
 */
const Offset = styled.div<VoidProps>`
  grid-column-start: span ${({ size }) => size};
`;

/**
 * Cell component props.
 */
interface CellProps {
  /**
   * Whether the cell should be rendered as tab.
   */
  asTab: boolean;

  /**
   * Whether this date is current date.
   */
  current: boolean;

  /**
   * Whether this date is selected.
   */
  selected: boolean;

  /**
   * Whether the day is a sunday.
   */
  isSunday: boolean;
}

/**
 * Calendar day tab style.
 */
const tabStyle = css<CellProps>`
  width: 100%;
  height: ${({ theme }) => theme.height};

  border-bottom: solid 2px
    ${({ current, selected, theme }) =>
      selected ? theme.orange : current ? theme.borderColor : "transparent"};
  border-top: solid 2px transparent;
  box-sizing: border-box;
`;

/**
 * Calendar day cell style.
 */
const cellStyle = css<CellProps>`
  padding: ${({ theme }) => theme.paddingSecondary};
  border: solid 1px
    ${({ current, selected, theme }) =>
      selected ? theme.orange : current ? theme.borderColor : "transparent"};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ selected, theme }) =>
    selected ? `inset 0 0 0 1px ${theme.orange}` : "none"};
`;

/**
 * Date day component.
 */
const Day = styled.div<CellProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: ${({ asTab, current, isSunday, selected, theme }) =>
    current || selected
      ? theme.primaryColor
      : !asTab && isSunday
      ? theme.orange
      : theme.secondaryColor};
  font-feature-settings: "tnum" 1;

  ${({ asTab }) => (asTab ? tabStyle : cellStyle)};
`;

/**
 * Month abbreviation container.
 */
const Abbreviation = styled.div`
  font-size: 0.8rem;
`;
