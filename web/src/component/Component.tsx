import { computed } from "mobx";
import * as React from "react";
import { Alert } from "./Alert";
import { Anchor } from "./Anchor";
import { Button } from "./Button";
import { CheckBox } from "./CheckBox";
import { Head } from "./Head";
import { Loader } from "./Loader";
import { Main } from "./Main";
import { Navigation } from "./Navigation";
import { NotificationContainer } from "./NotificationContainer";
import { Select } from "./Select";
import { Side } from "./Side";
import { TextField } from "./TextField";
import { Theme } from "./Theme";
import { SearchResult } from "../scene/Search";
import { RootStore } from "../store/RootStore";
import { SceneMap, SceneNames } from "../scene/Scene";

/**
 * Maps component class names to the class itself which is used typing
 * translation object. Must include all components that have some kind of
 * translation defined.
 */
interface ComponentMap extends SceneMap {
  Anchor: Anchor;
  Alert: Alert;
  Button: Button;
  CheckBox: CheckBox;
  Head: Head;
  Loader: Loader;
  Main: Main;
  Navigation: Navigation;
  NotificationContainer: NotificationContainer;
  Select: Select;
  Side: Side;
  TextField: TextField;
  Theme: Theme;
  SearchResult: SearchResult;
}

/**
 * Union of all component class names.
 */
type ComponentNames = keyof ComponentMap;

/**
 * Union of type `T` keys to which type `V` can be assigned.
 */
type AssignableKeys<T, V> = {
  [P in keyof T]: V extends T[P] ? P : never
}[keyof T];

/**
 * Makes all properties to which `undefined` can be assigned optional.
 */
type UndefinedOptional<T> = Omit<T, AssignableKeys<T, undefined>> &
  Partial<Pick<T, AssignableKeys<T, undefined>>>;

/**
 * Type of an object that maps names of all components to their translation
 * object types.
 */
export type ComponentsTranslation = UndefinedOptional<
  { [Name in ComponentNames]: ComponentMap[Name]["translation"] }
>;

/**
 * Component base class used to automatically define and retrieve typed
 * translations.
 */
export abstract class Component<
  TName extends ComponentNames | SceneNames,
  TProps extends {} = {},
  TTranslation extends {} | undefined = undefined
> extends React.Component<Partial<RootStore> & TProps> {
  /**
   * Component name that is used to retrieve correct translations.
   */
  private name: TName;

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
    return (this.props.views!.translation[
      this.name
    ] as unknown) as TTranslation;
  }
}
