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
  if (invalid) return "invalid";
  if (disabled) return "disabled";
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
      borderColor: "rgb(0, 0, 0)",
      color: "rgb(0, 0, 0)"
    },
    invalid: {
      backgroundColor: "rgb(255, 255, 255)",
      borderColor: "rgb(222, 0, 0)",
      color: "rgb(222, 0, 0)"
    }
  }
};
