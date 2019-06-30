import * as React from "react";
import { InjectedProps } from "../store";
import { computed } from "mobx";
import { Error } from "./Error";
import { NotificationContainer } from "./NotificationContainer";

/**
 * Maps component class name to the class.
 */
interface ComponentMap {
  Error: Error<any>;
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
    return (this.props.translations!.translation.components[
      this.constructor.name as ComponentNames
    ] as unknown) as TTranslation;
  }
}
