import { computed } from "mobx";
import * as React from "react";
import { Alert } from "./Alert";
import { DeclareNutrition } from "./Input/DeclareNutrition";
import { Form } from "./Form";
import { Input } from "./Input/Input";
import { NotificationContainer } from "./NotificationContainer";
import { InjectedProps } from "../store/Store";

/**
 * Maps component class name to the class.
 */
interface ComponentMap {
  Alert: Alert;
  DeclareNutrition: DeclareNutrition;
  Form: Form;
  Input: Input;
  NotificationContainer: NotificationContainer;
}

/**
 * Union of all component class names.
 */
type ComponentNames = keyof ComponentMap;

/**
 * Maps component class name to its translation type.
 */
export type ComponentsTranslation = {
  [ComponentName in ComponentNames]: ComponentMap[ComponentName] extends Component<
    infer _,
    infer ITranslation
  >
    ? ITranslation
    : never
};

/**
 * Union of styled component states.
 */
export type ComponentState = "disabled" | "default" | "focused" | "invalid";

/**
 * Returns state type based on component properties.
 */
export const getState = (
  disabled: boolean | undefined,
  focused: boolean | undefined,
  invalid: boolean | undefined
): ComponentState => {
  if (invalid) return "invalid";
  if (disabled) return "disabled";
  if (focused) return "focused";
  return "default";
};

/**
 * Component state prop.
 */
export interface StateProps {
  /**
   * Component state.
   */
  state: ComponentState;
}

/**
 * Component base class used to easily define and retrieve translations.
 */
export abstract class Component<
  TProps extends {} = {},
  TTranslation extends {} = {}
> extends React.Component<InjectedProps & TProps> {
  /**
   * Returns translation object of this component.
   */
  @computed
  public get translation(): TTranslation {
    return (this.props.views!.translation.components[
      this.constructor.name as ComponentNames
    ] as unknown) as TTranslation;
  }
}
