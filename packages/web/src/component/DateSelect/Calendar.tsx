import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { TranslatedComponent } from "../../base/TranslatedComponent";
import { RESET } from "../../styling/stylesheets";
import { styled } from "../../styling/theme";
import { DateArray, equals, toDateArray } from "./DateSelect";

/**
 * Calendar component props.
 */
interface CalendarProps {
  /**
   * Currently selected date.
   */
  date: Date;

  /**
   * Date select callback function.
   */
  select: (date: Date) => void;
}

/**
 * Calendar component props.
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
 * Calendar component that renders a single month calendar.
 */
@inject("views")
@observer
export class Calendar extends TranslatedComponent<
  "Calendar",
  CalendarProps,
  CalendarTranslation
> {
  /**
   * Currently visible year.
   */
  @observable private year: number;

  /**
   * Currently visible year.
   */
  @observable private month: number;

  /**
   * Sets the name of this component and initializes `year` and `month` fields
   * based on specified date provided in props.
   */
  public constructor(props: CalendarProps) {
    super("Calendar", props);

    this.year = props.date.getFullYear();
    this.month = props.date.getMonth();
  }

  /**
   * Updates currently visible year and month when receiving props.
   */
  public componentWillReceiveProps(props: CalendarProps) {
    this.year = props.date.getFullYear();
    this.month = props.date.getMonth();
  }

  /**
   * Renders the calendar.
   */
  public render() {
    return (
      <Container>
        {this.renderHeader()}
        {this.renderDates()}
      </Container>
    );
  }

  /**
   * Renders month header component.
   */
  public renderHeader = () => (
    <Header>
      <Button onClick={this.decrement}>←</Button>
      <MonthTitle>
        {this.translation.months[this.month]} {this.year}
      </MonthTitle>
      <Button onClick={this.increment}>→</Button>

      {this.translation.days.map((day, index) => (
        <DayComponent key={day + index} isSunday={index === 6}>
          {day}
        </DayComponent>
      ))}
    </Header>
  );

  /**
   * Renders calendar dates.
   */
  private renderDates() {
    // Offset which is equal to the number of days from the start of the week
    // before the first day of current month.
    const offset = (new Date(this.year, this.month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

    return (
      <Grid>
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
  private renderDate(date: DateArray) {
    const currentDate = toDateArray(new Date());
    const selectedDate = toDateArray(this.props.date);

    return (
      <Button
        key={date.toString()}
        onClick={this.handleClick}
        value={date.toString()}
      >
        <DateComponent
          current={equals(date, currentDate)}
          isSunday={new Date(...date).getDay() === 0}
          selected={equals(date, selectedDate)}
        >
          <div>{date[2]}</div>
        </DateComponent>
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
 * Container component that wraps month header and grid components.
 */
const Container = styled.div`
  max-width: ${({ theme }) => theme.widthSmall};
  width: 100%;

  padding: ${({ theme }) => theme.padding} 0;
  margin: auto;

  @media screen and (max-width: ${({ theme }) => theme.widthSmall}) {
    padding: 0;
  }
`;

/**
 * Month header component that contains month increment and decrement buttons,
 * month title component and all day headers.
 */
const Header = styled.div`
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

  text-align: center;

  cursor: pointer;
`;

/**
 * Component that displays current month and year.
 */
const MonthTitle = styled.div`
  grid-column-start: span 5;

  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Calendar day component props.
 */
interface DayComponentProps {
  /**
   * Whether the day is a sunday.
   */
  isSunday: boolean;
}

/**
 * Component that contains day label.
 */
const DayComponent = styled.div<DayComponentProps>`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme, isSunday }) =>
    isSunday ? theme.colorOrange : theme.colorSecondary};
`;

/**
 * Calendar date grid component.
 */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, ${({ theme }) => theme.height});
`;

/**
 * Offset component props.
 */
interface OffsetProps {
  /**
   * Offset size in columns.
   */
  size: number;
}

/**
 * Offset that takes up specified number (`size` prop value) of cells.
 */
const Offset = styled.div<OffsetProps>`
  grid-column-start: span ${({ size }) => size};
`;

/**
 * Date component props.
 */
interface DateComponentProps {
  /**
   * Whether this date is current date.
   */
  current: boolean;

  /**
   * Whether this date is selected.
   */
  selected: boolean;

  /**
   * Whether the date is on sunday.
   */
  isSunday: boolean;
}

/**
 * Date component.
 */
const DateComponent = styled.div<DateComponentProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: ${({ current, isSunday, selected, theme }) =>
    current || selected
      ? theme.colorPrimary
      : isSunday
      ? theme.colorOrange
      : theme.colorSecondary};
  font-feature-settings: "tnum" 1;

  transition: ${({ theme }) => theme.transition};

  padding: ${({ theme }) => theme.paddingSecondary};
  border: solid 1px
    ${({ current, selected, theme }) =>
      selected
        ? theme.colorOrange
        : current
        ? theme.borderColor
        : "transparent"};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ selected, theme }) =>
    selected ? `inset 0 0 0 1px ${theme.colorOrange}` : "none"};
`;
