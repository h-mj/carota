import { computed } from "mobx";

import { AdviseeView } from "../component/AdviseeView";
import { Calendar } from "../component/DateSelect/Calendar";
import { FoodstuffView } from "../component/FoodstuffView";
import { GroupView } from "../component/GroupView";
import { Head } from "../component/Head";
import { Menu } from "../component/Menu";
import { Component } from "./Component";
import { SceneComponents } from "./SceneComponent";

/**
 * Union of translated component classes.
 */
type TranslatedComponents =
  | AdviseeView
  | Calendar
  | FoodstuffView
  | GroupView
  | Head
  | Menu
  | SceneComponents;

/**
 * Union of translated component names.
 */
type TranslatedComponentNames = TranslatedComponents extends TranslatedComponent<
  infer IName,
  infer _1,
  infer _2
>
  ? IName
  : never;

/**
 * Translated component class with specified name.
 */
type TranslatedComponentWithName<
  TName extends TranslatedComponentNames
> = TranslatedComponents extends infer IComponents
  ? IComponents extends infer IComponent
    ? IComponent extends TranslatedComponent<TName, infer _1, infer _2>
      ? IComponent
      : never
    : never
  : never;

/**
 * Union of type `T` keys to which type `V` can be assigned.
 */
type AssignableKeys<T, V> = {
  [P in keyof T]: V extends T[P] ? P : never;
}[keyof T];

/**
 * Makes all properties to which `undefined` can be assigned optional.
 */
type UndefinedOptional<T> = Omit<T, AssignableKeys<T, undefined>> &
  Partial<Pick<T, AssignableKeys<T, undefined>>>;

/**
 * Translated component translations
 */
export type TranslatedComponentTranslations = UndefinedOptional<
  {
    [Name in TranslatedComponentNames]: TranslatedComponentWithName<
      Name
    >["translation"];
  }
>;

/**
 * Translated component base class.
 */
export abstract class TranslatedComponent<
  TName extends string,
  TProps = {},
  TTranslation = undefined
> extends Component<TProps> {
  /**
   * Name of this component.
   */
  private readonly __name: TName;

  /**
   * Creates a new instance of `TranslatedComponent` and initializes the
   * component name.
   */
  public constructor(name: TName, props: TProps) {
    super(props);
    this.__name = name;
  }

  /**
   * Returns translation value of this component.
   */
  @computed
  public get translation(): TTranslation {
    return (this.props.viewStore!.translation.components[
      this.__name as TranslatedComponentNames
    ] as unknown) as TTranslation;
  }
}
