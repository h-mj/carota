import { Theme } from "./theme";

export const LIGHT: Readonly<Theme> = {
  backgroundColor: "rgb(255, 255, 255)",
  colorPrimary: "rgb(0, 0, 0)",
  colorSecondary: "rgb(166, 166, 166)",
  disabled: {
    backgroundColor: "rgb(245, 245, 245)",
    borderColor: "rgb(188, 188. 188)",
    color: "rgb(166, 166, 166)"
  },
  default: {
    backgroundColor: "rgb(255, 255, 255)",
    borderColor: "rgb(188, 188, 188)",
    color: "rgb(166, 166, 166)"
  },
  focused: {
    backgroundColor: "rgb(255, 255, 255)",
    borderColor: "rgb(0, 0, 0)",
    color: "rgb(0, 0, 0)"
  },
  invalid: {
    backgroundColor: "rgb(255, 255, 255)",
    borderColor: "rgb(222, 0, 0)",
    color: "rgb(222, 0, 0)"
  }
};
