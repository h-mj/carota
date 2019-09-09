import { computed } from "mobx";

import { Alert } from "../component/Alert";
import { Calendar } from "../component/Calendar";
import { Head } from "../component/Head";
import { Navigation } from "../component/Navigation";
import { SearchResult } from "../scene/Search";
import { Component } from "./Component";
import { SceneComponentMap } from "./SceneComponent";

/**
 * Maps translated component class names to the class itself.
 */
interface TranslatedComponentMap extends SceneComponentMap {
  Alert: Alert;
  Calendar: Calendar;
  Head: Head;
  Navigation: Navigation;
  SearchResult: SearchResult;
}

/**
 * Union of all translated component class names.
 */
type TranslatedComponentNames = keyof TranslatedComponentMap;

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
 * Type of an object that maps names of all translated components to their
 * translation object types.
 */
export type ComponentsTranslation = UndefinedOptional<
  {
    [Name in TranslatedComponentNames]: TranslatedComponentMap[Name]["translation"];
  }
>;

/**
 * Translated component base class used to automatically define and retrieve
 * typed translations.
 */
export abstract class TranslatedComponent<
  TName extends TranslatedComponentNames,
  TProps extends {} = {},
  TTranslation extends {} | undefined = undefined
> extends Component<TProps> {
  /**
   * Component name that is used to retrieve correct translations.
   */
  private readonly name: TName;

  /**
   * Creates a new instance of `Component` and sets the name of this component.
   */
  public constructor(name: TName, props: TProps) {
    super(props);
    this.name = name;
  }

  /**
   * Returns translation object of this component.
   */
  @computed
  public get translation(): TTranslation {
    return (this.props.views!.translation.components[
      this.name
    ] as unknown) as TTranslation;
  }
}
