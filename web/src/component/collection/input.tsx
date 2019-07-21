import { styled, StyleProps } from "../../styling/theme";

/**
 * Component that displays the error message under `Label` component.
 */
export const ErrorMessage = styled.div`
  margin-top: calc(${({ theme }) => theme.PADDING} / 6);

  color: ${({ theme }) => theme.INVALID_COLOR};
  font-size: 0.7rem;
  letter-spacing: 0;
`;

/**
 * Field component that contains the caption and input element.
 */
export const Field = styled.div<StyleProps>`
  display: flex;
  align-items: center;

  height: ${({ theme }) => theme.HEIGHT};

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

  box-sizing: border-box;

  transition: ${({ theme }) => theme.TRANSITION};
`;

/**
 * Component that displays the label text.
 */
export const Label = styled.div<StyleProps>`
  min-width: 30%;
  height: 100%;

  display: flex;
  flex-shrink: 0;
  align-items: center;

  padding: 0 calc(${({ theme }) => theme.PADDING} / 3);
  box-sizing: border-box;

  color: ${({ active, invalid, theme }) =>
    invalid
      ? theme.INVALID_COLOR
      : active
      ? theme.ACTIVE_COLOR
      : theme.SECONDARY_COLOR};
  white-space: nowrap;

  user-select: none;

  transition: ${({ theme }) => theme.TRANSITION};
`;
