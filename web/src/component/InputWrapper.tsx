import * as React from "react";
import { css, styled, StyleProps } from "../styling/theme";

/**
 * Input wrapper component props.
 */
interface InputWrapperProps {
  /**
   * Whether or not input is active.
   */
  active?: boolean;

  /**
   * `InputWrapper` does not accept children. Use `input` and `prepend` props to
   * render them.
   */
  children?: undefined;

  /**
   * Whether or not input is disabled.
   */
  disabled?: boolean;

  /**
   * Error message text that will be rendered under the field.
   */
  errorMessage?: string;

  /**
   * Whether or not input is invalid.
   */
  invalid?: boolean;

  /**
   * Input component that will be wrapped.
   */
  input?: JSX.Element | null;

  /**
   * Label text that will be rendered next to the input.
   */
  label?: string;

  /**
   * Element that will be rendered before input label component.
   */
  prepend?: JSX.Element | null;

  /**
   * Whether or not input is read only.
   */
  readOnly?: boolean;

  /**
   * Whether or not input is required.
   */
  required?: boolean;

  /**
   * Whether or not use underline style.
   */
  underline?: boolean;

  /**
   * Whether or not wrap label and given children inside <label> element.
   */
  withLabel?: boolean;
}

/**
 * Component that wraps some kind of input component.
 *
 * This component renders `Field` component, inside which `Label` component and
 * `children` prop element, and `ErrorMessage` component.
 */
export const InputWrapper: React.FunctionComponent<InputWrapperProps> = ({
  active,
  disabled,
  errorMessage,
  input,
  invalid,
  label,
  prepend,
  underline,
  withLabel
}) => {
  const LabelComponent = withLabel ? Label : React.Fragment;

  return (
    <div>
      <Field
        active={active}
        disabled={disabled}
        invalid={invalid}
        underline={underline}
      >
        {prepend}
        <LabelComponent>
          {label !== undefined && (
            <Caption
              active={active}
              disabled={disabled}
              invalid={invalid}
              title={label}
            >
              {label}
            </Caption>
          )}
          {input}
        </LabelComponent>
      </Field>
      {errorMessage !== undefined && (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      )}
    </div>
  );
};

/**
 * Field component props.
 */
interface FieldProps extends StyleProps {
  /**
   * Whether or not underline field style should be used.
   */
  underline?: boolean;
}

/**
 * Default style of field component.
 */
const defaultStyle = css<FieldProps>`
  border: solid 1px
    ${({ active, invalid, theme }) =>
      invalid
        ? theme.INVALID_COLOR
        : active
        ? theme.ACTIVE_COLOR
        : theme.BORDER_COLOR};
  border-radius: ${({ theme }) => theme.BORDER_RADIUS};
  box-shadow: ${({ active, invalid, theme }) =>
    invalid
      ? `inset 0 0 0 1px ${theme.INVALID_COLOR}`
      : active
      ? `inset 0 0 0 1px ${theme.ACTIVE_COLOR}`
      : "none"};
`;

/**
 * Underline style of field component.
 */
const underlineStyle = css<FieldProps>`
  border-top: solid 1px
    ${({ active, disabled, invalid, theme }) =>
      invalid
        ? theme.INVALID_COLOR
        : active
        ? theme.ACTIVE_COLOR
        : disabled
        ? theme.DISABLED_BACKGROUND_COLOR
        : theme.BACKGROUND_COLOR};

  border-bottom: solid 1px
    ${({ active, invalid, theme }) =>
      invalid
        ? theme.INVALID_COLOR
        : active
        ? theme.ACTIVE_COLOR
        : theme.BORDER_COLOR};

  box-shadow: ${({ active, invalid, theme }) =>
    invalid
      ? `0 1px 0 0 ${theme.INVALID_COLOR}, 0 -1px 0 0 ${theme.INVALID_COLOR}`
      : active
      ? `0 1px 0 0 ${theme.ACTIVE_COLOR}, 0 -1px 0 0 ${theme.ACTIVE_COLOR}`
      : "none"};

  &:first-child {
    border-top: 0;
    border-radius: ${({ theme }) =>
      `${theme.BORDER_RADIUS} ${theme.BORDER_RADIUS} 0 0`};
    box-shadow: ${({ active, invalid, theme }) =>
      invalid
        ? `0 1px 0 0 ${theme.INVALID_COLOR}`
        : active
        ? `0 1px 0 0 ${theme.ACTIVE_COLOR}`
        : "none"};
  }

  &:last-child:not(:first-child) {
    border-bottom: 0;
    border-radius: ${({ theme }) =>
      `0 0 ${theme.BORDER_RADIUS} ${theme.BORDER_RADIUS}`};
    box-shadow: ${({ active, invalid, theme }) =>
      invalid
        ? `0 -1px 0 0 ${theme.INVALID_COLOR}`
        : active
        ? `0 -1px 0 0 ${theme.ACTIVE_COLOR}`
        : "none"};
  }
`;

/**
 * Field component that usually contains some kind of input element with other
 * helper labels.
 */
const Field = styled.div<FieldProps>`
  position: relative;
  z-index: ${({ active, invalid }) => (active ? 2 : invalid ? 1 : 0)};

  height: ${({ theme }) => theme.HEIGHT};

  display: flex;
  align-items: center;

  background-color: ${({ disabled, theme }) =>
    disabled ? theme.DISABLED_BACKGROUND_COLOR : theme.BACKGROUND_COLOR};
  box-sizing: border-box;

  transition: ${({ theme }) => theme.TRANSITION};

  ${({ underline }) => (underline ? underlineStyle : defaultStyle)};
`;

/**
 * Label element that usually contains caption and input components, so that
 * clicking on the caption input would be activated.
 */
const Label = styled.label`
  min-width: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
`;

/**
 * Component that displays the input label text.
 */
const Caption = styled.span<StyleProps>`
  min-width: 30%;

  padding: 0 calc(${({ theme }) => theme.PADDING} / 3);
  box-sizing: border-box;

  color: ${({ active, invalid, theme }) =>
    invalid
      ? theme.INVALID_COLOR
      : active
      ? theme.ACTIVE_COLOR
      : theme.SECONDARY_COLOR};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  user-select: none;

  transition: ${({ theme }) => theme.TRANSITION};
`;

/**
 * Component that displays the error message under the field component.
 */
const ErrorMessage = styled.div`
  margin-top: calc(${({ theme }) => theme.PADDING} / 6);

  color: ${({ theme }) => theme.INVALID_COLOR};
  font-size: 0.7rem;
  letter-spacing: 0;
`;
