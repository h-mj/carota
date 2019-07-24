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
  BORDER_COLOR: string;
  HEIGHT: string;
  PADDING: string;
  FORM_WIDTH: string;
  BORDER_RADIUS: string;
  ACTIVE_COLOR: string;
  INVALID_COLOR: string;
  PRIMARY_COLOR: string;
  SECONDARY_COLOR: string;
  BACKGROUND_COLOR: string;
  DISABLED_BACKGROUND_COLOR: string;
  TRANSITION: string;
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
  BORDER_COLOR: "rgb(222, 222, 222)",
  HEIGHT: "3.5rem",
  PADDING: "2.5rem",
  FORM_WIDTH: "28rem",
  BORDER_RADIUS: "0.4375rem",
  ACTIVE_COLOR: "rgb(255, 125, 0)",
  INVALID_COLOR: "rgb(222, 0, 0)",
  PRIMARY_COLOR: "rgba(0, 0, 0, 0.88)",
  SECONDARY_COLOR: "rgba(0, 0, 0, 0.44)",
  BACKGROUND_COLOR: "rgb(255, 255, 255)",
  DISABLED_BACKGROUND_COLOR: "rgb(245, 245, 245)",
  TRANSITION: "0.1s cubic-bezier(0.4, 0.0, 0.2, 1)"
};
