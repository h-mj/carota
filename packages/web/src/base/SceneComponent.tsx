import { Advisees } from "../scene/Advisees";
import { Body } from "../scene/Body";
import { Confirmation } from "../scene/Confirmation";
import { Diet } from "../scene/Diet";
import { DishEdit } from "../scene/DishEdit";
import { FoodstuffEdit } from "../scene/FoodstuffEdit";
import { GroupEdit } from "../scene/GroupEdit";
import { Invite } from "../scene/Invite";
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
import { Scene, SceneNames } from "./Scene";
import { TranslatedComponent } from "./TranslatedComponent";

/**
 * Union of scene components.
 */
export type SceneComponents =
  | Advisees
  | Body
  | Confirmation
  | Diet
  | DishEdit
  | FoodstuffEdit
  | GroupEdit
  | Invite
  | Login
  | Logout
  | MealEdit
  | Measure
  | Register
  | Scanner
  | Search
  | Settings
  | Statistics
  | Unknown;

/**
 * Scene component props.
 */
export interface SceneComponentProps<TSceneName extends SceneNames> {
  /**
   * Scene that is rendering this component. If `undefined`, component is
   * rendered by another component.
   */
  scene?: Scene<TSceneName>;
}

/**
 * Scene component base class.
 */
export abstract class SceneComponent<
  TSceneName extends SceneNames,
  TProps = {},
  TTranslation = undefined
> extends TranslatedComponent<
  TSceneName,
  SceneComponentProps<TSceneName> & TProps,
  TTranslation
> {
  /**
   * Property used to infer correct props type within
   * `SceneSceneComponentProps`.
   */
  // @ts-ignore
  private readonly __props!: TProps;
}

/**
 * Props type of scene component of scene with specified name.
 */
export type SceneSceneComponentProps<
  TSceneName extends SceneNames
> = SceneComponents extends infer IComponents
  ? IComponents extends infer IComponent
    ? IComponent extends SceneComponent<TSceneName, infer IProps, infer _1>
      ? IProps
      : never
    : never
  : never;
