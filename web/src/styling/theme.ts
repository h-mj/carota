import { ComponentState } from "../component/Component";

export interface Theme extends Record<ComponentState, StateTheme> {
  backgroundColor: string;
  colorPrimary: string;
  colorSecondary: string;
  overlayBackgroundColor: string;
}

interface StateTheme {
  backgroundColor: string;
  borderColor: string;
  color: string;
}
