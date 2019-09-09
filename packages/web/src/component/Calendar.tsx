import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

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
    const currentDate = toDateArray(new Date());
    const selectedDate = toDateArray(this.props.value);

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

        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = [this.year, this.month, i + 1] as const;

          return (
            <Cell
              key={date.toString()}
              current={equals(date, currentDate)}
              isSunday={new Date(...date).getDay() === 0}
              onClick={this.handleClick}
              selected={equals(date, selectedDate)}
              value={date.toString()}
            >
              {date[2]}
            </Cell>
          );
        })}
      </Grid>
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

    onChange(new Date(year, month, day));
  };
}

/**
 * Calendar date grid component.
 */
const Grid = styled.div`
  max-width: ${({ theme }) => theme.formWidth};

  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: ${({ theme }) => theme.height};
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
 * Component that contains a single date within a month.
 */
const Cell = styled(Button)<CellProps>`
  background-color: ${({ selected, theme }) =>
    selected ? theme.orange : "transparent"};
  border-radius: ${({ theme }) => theme.borderRadius};

  color: ${({ current, isSunday, selected, theme }) =>
    current || selected
      ? theme.primaryColor
      : isSunday
      ? theme.orange
      : theme.secondaryColor};
  font-feature-settings: "tnum" 1;
`;
