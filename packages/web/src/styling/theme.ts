import * as styledComponents from "styled-components";

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
 * Theme definition.
 */
export interface Theme {
  borderColor: string;
  height: string;
  halfHeight: string;
  lineHeight: string;
  padding: string;
  halfPadding: string;
  paddingSecondary: string;
  halfPaddingSecondary: string;
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
 * Light theme definition.
 */
export const LIGHT: Readonly<Theme> = {
  borderColor: "rgb(222, 222, 222)",
  height: "3.5rem",
  halfHeight: "1.75rem",
  lineHeight: "1.25rem",
  padding: "2.5rem",
  halfPadding: "1.25rem",
  paddingSecondary: "0.825rem",
  halfPaddingSecondary: "0.4125rem",
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
