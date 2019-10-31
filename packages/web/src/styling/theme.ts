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
 * Theme constants.
 */
export const THEME_CONSTANTS = {
  duration: 0.2,
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
  transitionLinear: "0.2s",
  widthSmall: "30rem",
  widthMedium: "60rem",
  widthCutoff: "48rem"
};

/**
 * Color theme definition.
 */
export interface ColorTheme {
  backgroundColor: string;
  backgroundColorSecondary: string;
  backgroundColorDisabled: string;
  backgroundColorTranslucent: string;
  borderColor: string;
  borderRadius: string;
  colorPrimary: string;
  colorSecondary: string;
  colorActive: string;
  colorInvalid: string;
}

/**
 * Full theme type.
 */
type Theme = ColorTheme & typeof THEME_CONSTANTS;

/**
 * Light theme definition.
 */
export const LIGHT: Readonly<ColorTheme> = {
  backgroundColor: "rgb(255, 255, 255)",
  backgroundColorSecondary: "rgb(235, 235, 235)",
  backgroundColorDisabled: "rgb(245, 245, 245)",
  backgroundColorTranslucent: "rgba(0, 0, 0, 0.4)",
  borderColor: "rgb(222, 222, 222)",
  borderRadius: "0.4375rem",
  colorPrimary: "rgba(0, 0, 0, 0.88)",
  colorSecondary: "rgba(0, 0, 0, 0.44)",
  colorActive: "rgb(255, 130, 0)",
  colorInvalid: "rgb(222, 0, 0)"
};

/**
 * Light theme definition.
 */
export const DARK: Readonly<ColorTheme> = {
  backgroundColor: "rgb(0, 0, 0)",
  backgroundColorSecondary: "rgb(40, 40, 40)",
  backgroundColorDisabled: "rgb(20, 20, 20)",
  backgroundColorTranslucent: "rgba(255, 255, 255, 0.1)",
  borderColor: "rgb(50, 50, 50)",
  borderRadius: "0.4375rem",
  colorPrimary: "rgb(255, 255, 255)",
  colorSecondary: "rgb(150, 150, 150)",
  colorActive: "rgb(191, 78, 0)",
  colorInvalid: "rgb(156, 0, 0)"
};
