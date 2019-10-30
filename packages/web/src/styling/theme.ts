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
  backgroundColor: string;
  backgroundColorSecondary: string;
  backgroundColorDisabled: string;
  backgroundColorTranslucent: string;
  borderColor: string;
  borderRadius: string;
  colorBlue: string;
  colorGreen: string;
  colorOrange: string;
  colorRed: string;
  colorPrimary: string;
  colorSecondary: string;
  height: string;
  heightHalf: string;
  iconHeight: string;
  lineHeight: string;
  padding: string;
  paddingHalf: string;
  paddingSecondary: string;
  paddingSecondaryHalf: string;
  transition: string;
  transitionSlow: string;
  widthSmall: string;
  widthMedium: string;
  widthCutoff: string;
}

/**
 * Light theme definition.
 */
export const LIGHT: Readonly<Theme> = {
  backgroundColor: "rgb(255, 255, 255)",
  backgroundColorSecondary: "rgb(235, 235, 235)",
  backgroundColorDisabled: "rgb(245, 245, 245)",
  backgroundColorTranslucent: "rgba(0, 0, 0, 0.4)",
  borderColor: "rgb(222, 222, 222)",
  borderRadius: "0.4375rem",
  colorBlue: "rgb(107, 156, 222)",
  colorGreen: "rgb(67, 176, 42)",
  colorOrange: "rgb(255, 130, 0)",
  colorRed: "rgb(222, 0, 0)",
  colorPrimary: "rgba(0, 0, 0, 0.88)",
  colorSecondary: "rgba(0, 0, 0, 0.44)",
  height: "3.5rem",
  heightHalf: "1.75rem",
  iconHeight: "1rem",
  lineHeight: "1.25rem",
  padding: "2.5rem",
  paddingHalf: "1.25rem",
  paddingSecondary: "0.825rem",
  paddingSecondaryHalf: "0.4125rem",
  transition: "0.2s cubic-bezier(0.4, 0.0, 0.2, 1)",
  transitionSlow: "0.4s cubic-bezier(0.4, 0.0, 0.2, 1)",
  widthSmall: "30rem",
  widthMedium: "60rem",
  widthCutoff: "48rem"
};

/**
 * Light theme definition.
 */
export const DARK: Readonly<Theme> = {
  backgroundColor: "rgb(0, 0, 0)",
  backgroundColorSecondary: "rgb(40, 40, 40)",
  backgroundColorDisabled: "rgb(20, 20, 20)",
  backgroundColorTranslucent: "rgba(255, 255, 255, 0.1)",
  borderColor: "rgb(60, 60, 60)",
  borderRadius: "0.4375rem",
  colorBlue: "rgb(107, 156, 222)",
  colorGreen: "rgb(67, 176, 42)",
  colorOrange: "rgb(255, 130, 0)",
  colorRed: "rgb(222, 0, 0)",
  colorPrimary: "rgba(255, 255, 255, 0.88)",
  colorSecondary: "rgba(255, 255, 255, 0.44)",
  height: "3.5rem",
  heightHalf: "1.75rem",
  iconHeight: "1rem",
  lineHeight: "1.25rem",
  padding: "2.5rem",
  paddingHalf: "1.25rem",
  paddingSecondary: "0.825rem",
  paddingSecondaryHalf: "0.4125rem",
  transition: "0.2s cubic-bezier(0.4, 0.0, 0.2, 1)",
  transitionSlow: "0.4s cubic-bezier(0.4, 0.0, 0.2, 1)",
  widthSmall: "30rem",
  widthMedium: "60rem",
  widthCutoff: "48rem"
};
