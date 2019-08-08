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
  padding: string;
  formWidth: string;
  borderRadius: string;
  orange: string;
  red: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
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
  padding: "2.5rem",
  formWidth: "28rem",
  borderRadius: "0.4375rem",
  orange: "rgb(255, 125, 0)",
  red: "rgb(222, 0, 0)",
  primaryColor: "rgba(0, 0, 0, 0.88)",
  secondaryColor: "rgba(0, 0, 0, 0.44)",
  backgroundColor: "rgb(255, 255, 255)",
  disabledBackgroundColor: "rgb(245, 245, 245)",
  transition: "0.1s cubic-bezier(0.4, 0.0, 0.2, 1)"
};
