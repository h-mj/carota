import * as styledComponents from "styled-components";

/**
 * Union of component states.
 */
export type State = "disabled" | "default" | "active" | "invalid";

/**
 * Returns state type based on component properties.
 */
export const getState = (
  disabled: boolean | undefined,
  active: boolean | undefined,
  invalid: boolean | undefined
): State => {
  if (disabled) return "disabled";
  if (invalid) return "invalid";
  if (active) return "active";
  return "default";
};

/**
 * Component state prop.
 */
export interface StateProps {
  /**
   * Component state.
   */
  state: State;
}

/**
 * Theme definition.
 */
export interface Theme {
  backgroundColor: string;
  colorPrimary: string;
  colorSecondary: string;
  borderColor: string;
  overlayBackgroundColor: string;
  states: Record<State, StateTheme>;
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
  TRANSITION: string;
}

/**
 * State theme definition.
 */
interface StateTheme {
  backgroundColor: string;
  borderColor: string;
  color: string;
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
  backgroundColor: "rgb(255, 255, 255)",
  colorPrimary: "rgb(0, 0, 0)",
  colorSecondary: "rgb(166, 166, 166)",
  borderColor: "rgb(210, 210, 210)",
  overlayBackgroundColor: "rgba(255, 255, 255, 0.95)",
  states: {
    disabled: {
      backgroundColor: "rgb(250, 250, 250)",
      borderColor: "rgb(210, 210, 210)",
      color: "rgb(150, 150, 150)"
    },
    default: {
      backgroundColor: "rgb(255, 255, 255)",
      borderColor: "rgb(210, 210, 210)",
      color: "rgb(150, 150, 150)"
    },
    active: {
      backgroundColor: "rgb(255, 255, 255)",
      borderColor: "rgb(0, 200, 100)",
      color: "rgb(0, 200, 100)"
    },
    invalid: {
      backgroundColor: "rgb(255, 255, 255)",
      borderColor: "rgb(255, 150, 0)",
      color: "rgb(255, 150, 0)"
    }
  },
  BORDER_COLOR: "rgb(0, 0, 0, 0.15)",
  HEIGHT: "3.5rem",
  PADDING: "2.5rem",
  FORM_WIDTH: "28rem",
  BORDER_RADIUS: "0.4375rem",
  ACTIVE_COLOR: "rgb(255, 150, 0)",
  INVALID_COLOR: "rgb(220, 0, 0)",
  PRIMARY_COLOR: "rgba(0, 0, 0, 0.88)",
  SECONDARY_COLOR: "rgba(0, 0, 0, 0.44)",
  BACKGROUND_COLOR: "rgb(255, 255, 255)",
  TRANSITION: "0.1s cubic-bezier(0.4, 0.0, 0.2, 1)"
};
