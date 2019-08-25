import * as styledComponents from "styled-components";

/**
 * Props that usually affect styling of components.
 */
export interface StyleProps {
  /**
   * Whether or not component is active.
   */
  active?: boolean;

  /**
   * Whether or not component is disabled.
   */
  disabled?: boolean;

  /**
   * Whether or not component is invalid.
   */
  invalid?: boolean;
}

/**
 * Theme definition.
 */
export interface Theme {
  borderColor: string;
  height: string;
  lineHeight: string;
  padding: string;
  formWidth: string;
  borderRadius: string;
  blue: string;
  green: string;
  orange: string;
  red: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  translucentBackgroundColor: string;
  disabledBackgroundColor: string;
  transition: string;
}

/**
 * Export typed styled-component functions.
 */
export const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
  ThemeProvider
} = styledComponents as styledComponents.ThemedStyledComponentsModule<Theme>;

/**
 * Light theme definition.
 */
export const LIGHT: Readonly<Theme> = {
  borderColor: "rgb(222, 222, 222)",
  height: "3.5rem",
  lineHeight: "1.25rem",
  padding: "2.5rem",
  formWidth: "30rem",
  borderRadius: "0.4375rem",
  blue: "rgb(107, 156, 222)",
  green: "rgb(67, 176, 42)",
  orange: "rgb(255, 130, 0)",
  red: "rgb(222, 0, 0)",
  primaryColor: "rgba(0, 0, 0, 0.88)",
  secondaryColor: "rgba(0, 0, 0, 0.44)",
  backgroundColor: "rgb(255, 255, 255)",
  translucentBackgroundColor: "rgba(0, 0, 0, 0.25)",
  disabledBackgroundColor: "rgb(245, 245, 245)",
  transition: "0.1s cubic-bezier(0.4, 0.0, 0.2, 1)"
};
