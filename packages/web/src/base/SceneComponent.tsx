import { Advisees } from "../scene/Advisees";
import { Body } from "../scene/Body";
import { Confirmation } from "../scene/Confirmation";
import { Diet } from "../scene/Diet";
import { DishEdit } from "../scene/DishEdit";
import { Edit } from "../scene/Edit";
import { GroupEdit } from "../scene/GroupEdit";
import { Login } from "../scene/Login";
import { Logout } from "../scene/Logout";
import { MealEdit } from "../scene/MealEdit";
import { Measure } from "../scene/Measure";
import { Register } from "../scene/Register";
import { Scanner } from "../scene/Scanner";
import { Search } from "../scene/Search";
import { Settings } from "../scene/Settings";
import { Statistics } from "../scene/Statistics";
import { Unknown } from "../scene/Unknown";
import { Scene, SceneComponentSceneNames } from "./Scene";
import { TranslatedComponent } from "./TranslatedComponent";

/**
 * Maps scene component names to their classes.
 */
export interface SceneComponentMap {
  Advisees: Advisees;
  Body: Body;
  Confirmation: Confirmation;
  Diet: Diet;
  DishEdit: DishEdit;
  Edit: Edit;
  GroupEdit: GroupEdit;
  Login: Login;
  Logout: Logout;
  MealEdit: MealEdit;
  Measure: Measure;
  Register: Register;
  Scanner: Scanner;
  Search: Search;
  Settings: Settings;
  Statistics: Statistics;
  Unknown: Unknown;
}

/**
 * Union of all scene component names.
 */
export type SceneComponentNames = keyof SceneComponentMap;

/**
 * Default scene component props type.
 */
export interface DefaultSceneComponentProps<TName extends SceneComponentNames> {
  /**
   * Scene of this component.
   */
  scene: Scene<SceneComponentSceneNames<TName>>;
}

/**
 * Props types of scene components of scenes named `TSceneNames`.
 */
export type SceneComponentProps<
  TName extends SceneComponentNames
> = SceneComponentMap[TName] extends SceneComponent<
  infer _1,
  infer IProps,
  infer _2
>
  ? IProps
  : never;

/**
 * Scene component base class that is extended by all scene components.
 */
export abstract class SceneComponent<
  TName extends SceneComponentNames,
  TProps extends {} = {},
  TTranslation extends {} | undefined = undefined
> extends TranslatedComponent<
  TName,
  TProps & DefaultSceneComponentProps<TName>,
  TTranslation
> {
  /**
   * Property which is used to retrieve "clean" props type of a scene component.
   */
  // @ts-ignore
  private propsType!: TProps;
}
