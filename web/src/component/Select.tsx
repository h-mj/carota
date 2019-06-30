import * as React from "react";
import styled, { css } from "styled-components";
import { ErrorMessage, Label } from "./TextField";
import { DURATION, TIMING_FUNCTION } from "../styling/animations";
import {
  ACTIVE,
  DEFAULT_BORDER,
  DEFAULT_LABEL,
  ERROR
} from "../styling/colors";
import { BORDER_RADIUS, UNIT } from "../styling/sizes";
import { RESET } from "../styling/stylesheets";

/**
 * Select component props.
 */
interface SelectProps {
  /**
   * Error message which will be shown under the select.
   */
  error?: string;

  /**
   * Select name that will be included as one of the `onChange` callback
   * parameters.
   */
  name: string;

  /**
   * Function that will be called when selected option changes.
   */
  onChange?: (name: string, value: string) => void;

  /**
   * Options from which to select.
   */
  options: Readonly<Array<{ label: string; value: string }>>;

  /**
   * Label text that will be shown above the select component.
   */
  label?: string;

  /**
   * Selected option value.
   */
  value: string;
}

/**
 * Component that allows user to select between finite array of options.
 */
export class Select extends React.Component<SelectProps> {
  /**
   * Last defined `error` prop value that is used as error message if `error`
   * prop is `undefined` but we still want to render `ErrorMessage` component.
   */
  private previousError?: string;

  /**
   * Updates `previousError` value when receiving potentially new props.
   */
  public componentWillReceiveProps(props: SelectProps) {
    if (props.error !== undefined) {
      this.previousError = props.error;
    }
  }

  /**
   * Renders select component with its options alongside the placeholder and
   * error labels.
   */
  public render() {
    const { error, options, label, value } = this.props;

    return (
      <Container hasError={error !== undefined}>
        {options.map(({ label, value: optionValue }) => (
          <Option
            hasError={error !== undefined}
            key={optionValue}
            isSelected={value === optionValue}
            onClick={this.handleClick}
            type="button"
            value={optionValue}
          >
            {label}
          </Option>
        ))}
        {label !== undefined && <Label>{label}</Label>}
        {this.previousError !== undefined && (
          <ErrorMessage hasError={error !== undefined}>
            {this.previousError}
          </ErrorMessage>
        )}
      </Container>
    );
  }

  /**
   * Calls prop `onChange` if defined with select name and clicked option value.
   */
  private handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
    if (this.props.onChange !== undefined) {
      this.props.onChange(this.props.name, (event.target as any).value);
    }
  };
}

/**
 * Option component properties.
 */
interface OptionProps {
  /**
   * Whether or not there is an error.
   */
  hasError: boolean;

  /**
   * Whether or not this option is selected.
   */
  isSelected: boolean;
}

/**
 * Option component.
 */
const Option = styled.button<OptionProps>`
  ${RESET};

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  color: ${props =>
    props.isSelected ? ACTIVE : props.hasError ? ERROR : DEFAULT_LABEL};

  cursor: pointer;

  transition: ${DURATION}s ${TIMING_FUNCTION};
`;

/**
 * Components coloring if there is no error.
 */
const defaultStyle = css`
  &:focus-within {
    box-shadow: 0 0 0 1px ${ACTIVE}, inset 0 0 0 1px ${ACTIVE};
  }

  &:focus-within > ${Label} {
    color: ${ACTIVE};
  }
`;

/**
 * Components coloring if there is an error.
 */
const errorStyle = css`
  box-shadow: 0 0 0 1px ${ERROR}, inset 0 0 0 1px ${ERROR};

  & > ${Label} {
    color: ${ERROR};
  }
`;

/**
 * Container component props.
 */
interface ContainerProps {
  /**
   * Whether or not there's an error.
   */
  hasError: boolean;
}

/**
 * Container component that contains option components.
 */
const Container = styled.div<ContainerProps>`
  position: relative;

  display: flex;

  width: 100%;
  height: ${UNIT}rem;

  box-shadow: 0 0 0 1px ${DEFAULT_BORDER}, inset 0 0 0 1px ${DEFAULT_BORDER};
  border-radius: ${BORDER_RADIUS}rem;

  transition: ${DURATION}s ${TIMING_FUNCTION};

  ${props => (props.hasError ? errorStyle : defaultStyle)};
`;
