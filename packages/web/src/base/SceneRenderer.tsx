import { inject, observer } from "mobx-react";
import * as React from "react";

import { Menu } from "../component/Menu";
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
import { css, keyframes, styled } from "../styling/theme";
import { Component } from "./Component";
import { ScenePositions, Scenes } from "./Scene";

/**
 * Maps scene names to their component classes.
 */
const SCENE_COMPONENTS = {
  Advisees: Advisees,
  Body: Body,
  Confirmation: Confirmation,
  Diet: Diet,
  DishEdit: DishEdit,
  FoodstuffEdit: FoodstuffEdit,
  GroupEdit: GroupEdit,
  Invite: Invite,
  Login: Login,
  Logout: Logout,
  MealEdit: MealEdit,
  Measure: Measure,
  Register: Register,
  Scanner: Scanner,
  Search: Search,
  Settings: Settings,
  Statistics: Statistics,
  Unknown: Unknown
} as const;

/**
 * Scene renderer props.
 */
interface SceneRendererProps {
  /**
   * Whether rendered scene is at the bottom of the scene stack.
   */
  isFirst: boolean;

  /**
   * Whether rendered scene is at the top of the scene stack.
   */
  isLast: boolean;

  /**
   * Scene that will be rendered.
   */
  scene: Scenes;
}

/**
 * Component responsible for rendering provided scene.
 */
@inject("authenticationStore")
@observer
export class SceneRenderer extends Component<SceneRendererProps> {
  /**
   * Renders scene component within correct container of provided scene.
   */
  public render() {
    const { isFirst, isLast, scene } = this.props;
    const { position } = scene;
    const Container = CONTAINER_COMPONENTS[position];

    return (
      <Modal isFirst={isFirst} isLast={isLast} position={position}>
        <Container>{this.renderSceneComponent()}</Container>

        {isFirst && this.props.authenticationStore!.authenticated && <Menu />}
      </Modal>
    );
  }

  /**
   * Renders the scene component of provided scene.
   */
  private renderSceneComponent() {
    const { scene } = this.props;
    const Component: typeof React.Component = SCENE_COMPONENTS[scene.name];

    return <Component scene={scene} {...scene.props} />;
  }
}

/**
 * Rendering position information.
 */
interface RenderPosition {
  /**
   * Whether rendered scene is at the bottom of the scene stack.
   */
  isFirst: boolean;

  /**
   * Whether rendered scene is at the top of the scene stack.
   */
  isLast: boolean;

  /**
   * Scene position.
   */
  position: ScenePositions;
}

/**
 * `Modal` component opening animation keyframes.
 */
const openModal = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

/**
 * Modal component that is rendered on top of all preceding components.
 */
// prettier-ignore
const Modal = styled.div<RenderPosition>`
  position: fixed;

  width: 100%;
  height: 100%;

  background-color: ${({ theme }) => theme.backgroundColorTranslucent};

  pointer-events: ${({ isLast }) => (isLast ? "initial" : "none")};

  display: flex;
  align-items: center;
  justify-content: ${({ position }) =>
    position === "center" ? "center" : "normal"};

  @media screen and (max-width: ${({ theme }) => theme.widthCutoff}) {
    animation: ${({ isFirst, theme }) => isFirst ? "none" : css` ${openModal} ${theme.transition}`};
  }
`;

/**
 * Base container component.
 */
const BaseContainer = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};

  display: flex;
  flex-direction: column;

  overflow: auto;

  @media screen and (max-width: ${({ theme }) => theme.widthCutoff}) {
    max-width: initial;
    max-height: initial;

    width: 100%;
    height: 100%;

    border-radius: 0;
    animation: initial;
  }
`;

/**
 * `Center` component opening animation keyframes.
 */
const openCenter = keyframes`
  from {
    transform: translateY(25%);
  }

  to {
    transform: translateY(0);
  }
`;

/**
 * Container for scene component at `center` position.
 */
// prettier-ignore
const Center = styled(BaseContainer)`
  max-width: ${({ theme }) => theme.widthSmall};
  max-height: 80%;

  width: 100%;

  border-radius: ${({ theme }) => theme.borderRadius};

  animation: ${({ theme }) => css`${openCenter} ${theme.transitionLinear}`};
`;

/**
 * Container for scene component at `main` position.
 */
const Main = styled(BaseContainer)`
  width: 100%;
  height: 100%;
`;

/**
 * `Side` component opening animation keyframes.
 */
const openSide = keyframes`
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
`;

/**
 * Container for scene component at `side` position.
 */
// prettier-ignore
const Side = styled(BaseContainer)`
  max-width: ${({ theme }) => theme.widthSmall};

  width: 100%;
  height: 100%;

  animation: ${({ theme }) => css`${openSide} ${theme.transitionLinear}`};
`;

/**
 * Maps scene positions to the container components.
 */
const CONTAINER_COMPONENTS = {
  center: Center,
  main: Main,
  side: Side
};
