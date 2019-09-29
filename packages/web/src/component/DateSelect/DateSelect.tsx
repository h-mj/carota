import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

import { Component } from "../../base/Component";
import { RESET } from "../../styling/stylesheets";
import { styled } from "../../styling/theme";
import { Calendar } from "./Calendar";
import { TAB_RADIUS, Tabs } from "./Tabs";

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
  date: Date;
}

/**
 * Date array type.
 */
export type DateArray = readonly [number, number, number];

/**
 * Converts a specified date to an array of form `[year, month, date]`.
 */
export const toDateArray = (date: Date): DateArray =>
  [date.getFullYear(), date.getMonth(), date.getDate()] as const;

/**
 * Returns whether specified array date equals another specified array date.
 */
export const equals = (date1: DateArray, date2: DateArray) => {
  return (
    date1[0] === date2[0] && date1[1] === date2[1] && date1[2] === date2[2]
  );
};

/**
 * Calendar component that is used to select a date.
 */
@observer
export class DateSelect extends Component<CalendarProps> {
  /**
   * Whether date select is expanded.
   */
  @observable private expanded = false;

  /**
   * Whether calendar should be rendered.
   */
  @observable private shouldRenderCalendar = false;

  /**
   * Timeout ID that sets whether calendar should be rendered to `false`.
   */
  private shouldRenderCalendarResetTimeoutId = 0;

  /**
   * Renders the calendar component.
   */
  public render() {
    return (
      <Container expanded={this.expanded}>
        <Bar>
          <Tabs date={this.props.date} select={this.handleSelect} />
          <Expand expanded={this.expanded} onClick={this.toggleExpand}>
            <div>↓</div>
          </Expand>
        </Bar>

        {this.shouldRenderCalendar && (
          <Calendar date={this.props.date} select={this.handleSelect} />
        )}
      </Container>
    );
  }

  /**
   * Toggles whether full calendar is visible.
   */
  @action
  private toggleExpand = () => {
    this.expanded = !this.expanded;
    window.clearTimeout(this.shouldRenderCalendarResetTimeoutId);

    if (this.expanded) {
      this.shouldRenderCalendar = true;
    } else {
      this.shouldRenderCalendarResetTimeoutId = setTimeout(
        () => (this.shouldRenderCalendar = false),
        1000
      );
    }
  };

  /**
   * Calls `onChange` event handler when new date is selected.
   */
  @action
  private handleSelect = (date: Date) => {
    const { onChange } = this.props;

    if (onChange === undefined) {
      return;
    }

    onChange(date);
  };
}

/**
 * Calendar expanded props.
 */
interface ExpandedProps {
  /**
   * Whether calendar is expanded.
   */
  expanded: boolean;
}

/**
 * Container that wraps all components.
 */
const Container = styled.div<ExpandedProps>`
  max-height: ${({ expanded, theme }) => (expanded ? "100vh" : theme.height)};
  overflow: hidden;

  background-color: ${({ theme }) => theme.backgroundColor};
  box-shadow: inset 0 -1px 0 0 ${({ theme }) => theme.borderColor};

  transition: ${({ theme }) => theme.transitionSlow};
`;

/**
 * Container component that wraps both `Tabs` and `Expand` components.
 */
const Bar = styled.div`
  min-width: 0;
  width: 100%;
  height: ${({ theme }) => theme.height};
  display: flex;
`;

/**
 * Expand or minimize button component.
 */
const Expand = styled.button<ExpandedProps>`
  ${RESET};

  z-index: 1;

  max-width: ${({ theme }) => theme.height};
  width: calc(100% / ${2 * TAB_RADIUS + 2});
  height: 100%;

  flex-shrink: 0;

  border-bottom: solid 1px ${({ theme }) => theme.borderColor};
  background-color: ${({ theme }) => theme.backgroundColor};
  text-align: center;

  cursor: pointer;

  & > * {
    transform: rotateX(${({ expanded }) => (expanded ? "180deg" : "0deg")});
    transition: transform ${({ theme }) => theme.transitionSlow};
  }
`;
