import { computed } from "mobx";
import * as React from "react";
import { Alert } from "./Alert";
import { Head } from "./Head";
import { Navigation } from "./Navigation";
import { NotificationContainer } from "./NotificationContainer";
import { RootStore } from "../store/RootStore";

/**
 * Maps component class names to the class itself which is used typing
 * translation object. Must include all components that have some kind of
 * translation defined.
 */
interface ComponentMap {
  Alert: Alert;
  Head: Head;
  Navigation: Navigation;
  NotificationContainer: NotificationContainer;
}

/**
 * Union of all component class names.
 */
type ComponentNames = keyof ComponentMap;

/**
 * Keys of object `T` which values are `undefined`.
 */
type UndefinedValueKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

/**
 * Type of an object `T` which `undefined` valued keys are optional.
 */
type MakeUndefinedOptional<T> = Omit<T, UndefinedValueKeys<T>> &
  { [K in UndefinedValueKeys<T>]?: undefined };

/**
 * Maps component class names `Names` to its translation type using `TMap`,
 * which maps component names to their component class types.
 */
export type ClassTranslation<
  TNames extends string,
  TMap extends Record<TNames, Component<{}, {} | undefined>>
> = MakeUndefinedOptional<
  {
    [Name in TNames]: TMap[Name] extends Component<infer _, infer ITranslation>
      ? ITranslation
      : never;
  }
>;

/**
 * Maps component class names to their translation types.
 */
export type ComponentsTranslation = ClassTranslation<
  ComponentNames,
  ComponentMap
>;

/**
 * Component base class used to automatically define and retrieve typed
 * translations.
 */
export abstract class Component<
  TProps extends {} = {},
  TTranslation extends {} | undefined = undefined
> extends React.Component<Partial<RootStore> & TProps> {
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
