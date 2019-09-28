import * as React from "react";

import { styled } from "../styling/theme";

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
   * render them instead.
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
   * Helper message that will be rendered above the field.
   */
  helperMessage?: string;

  /**
   * Whether or not input is invalid.
   */
  invalid?: boolean;

  /**
   * Wrapped input component.
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
   * Whether or not wrap label and given children inside <label> element.
   */
  withLabel?: boolean;
}

/**
 * Component that wraps an input component and renders field, error message and
 * label components around it.
 */
export const InputWrapper: React.FunctionComponent<InputWrapperProps> = ({
  active,
  disabled,
  errorMessage,
  helperMessage,
  input,
  invalid,
  label,
  prepend,
  withLabel
}) => {
  const LabelComponent = withLabel ? Label : React.Fragment;

  return (
    <Wrapper>
      {helperMessage !== undefined && (
        <HelperMessage active={active} disabled={disabled} invalid={invalid}>
          {helperMessage}
        </HelperMessage>
      )}
      <Field active={active} disabled={disabled} invalid={invalid}>
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
    </Wrapper>
  );
};

/**
 * Wrapper component.
 */
const Wrapper = styled.div`
  width: 100%;
`;

/**
 * Common input style props.
 */
export interface InputStyleProps {
  /**
   * Whether or not input is active.
   */
  active?: boolean;

  /**
   * Whether or not input is disabled.
   */
  disabled?: boolean;

  /**
   * Whether or not input is invalid.
   */
  invalid?: boolean;
}

/**
 * Helper text above the input.
 */
const HelperMessage = styled.div<InputStyleProps>`
  margin-bottom: ${({ theme }) => theme.halfPaddingSecondary};

  color: ${({ active, invalid, theme }) =>
    invalid ? theme.red : active ? theme.orange : theme.secondaryColor};

  transition: ${({ theme }) => theme.transition};
`;

/**
 * Field component that usually contains label and an input component.
 */
const Field = styled.div<InputStyleProps>`
  position: relative;
  z-index: ${({ active, invalid }) => (active ? 2 : invalid ? 1 : 0)};

  height: ${({ theme }) => theme.height};

  display: flex;
  align-items: center;

  background-color: ${({ disabled, theme }) =>
    disabled ? theme.disabledBackgroundColor : theme.backgroundColor};
  box-sizing: border-box;

  border: solid 1px
    ${({ active, invalid, theme }) =>
      invalid ? theme.red : active ? theme.orange : theme.borderColor};
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ active, invalid, theme }) =>
    invalid
      ? `inset 0 0 0 1px ${theme.red}`
      : active
      ? `inset 0 0 0 1px ${theme.orange}`
      : "none"};

  transition: ${({ theme }) => theme.transition};

  & > * {
    margin-left: ${({ theme }) => theme.paddingSecondary};
  }

  & > *:last-child {
    margin-right: ${({ theme }) => theme.paddingSecondary};
  }
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

  & > *:not(:last-child) {
    margin-right: ${({ theme }) => theme.paddingSecondary};
  }
`;

/**
 * Component that displays the input label text.
 */
const Caption = styled.span<InputStyleProps>`
  min-width: 30%;

  color: ${({ active, invalid, theme }) =>
    invalid ? theme.red : active ? theme.orange : theme.secondaryColor};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  user-select: none;

  transition: ${({ theme }) => theme.transition};
`;

/**
 * Component that displays the error message under the field component.
 */
const ErrorMessage = styled.div`
  margin-top: ${({ theme }) => theme.halfPaddingSecondary};

  color: ${({ theme }) => theme.red};
  font-size: 0.7rem;
  letter-spacing: 0;
`;
