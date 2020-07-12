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
import { fadeIn, fadeOut } from "../styling/animations";
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
  Unknown: Unknown,
} as const;

/**
 * Scene renderer props.
 */
interface SceneRendererProps {
  /**
   * Whether rendered scene is active.
   */
  active: boolean;

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
   * Modal `div` element ref.
   */
  private modalRef = React.createRef<HTMLDivElement>();

  /**
   * Previous active element.
   */
  private previousActiveElement?: HTMLElement;

  /**
   * Blur currently active element after mount and adds event listeners for
   * trapping the focus within the modal.
   */
  public componentDidMount() {
    this.blurActiveElement();
    window.addEventListener("focus", this.trapFocus, true);
  }

  /**
   * Removes added event listeners.
   */
  public componentWillUnmount() {
    window.removeEventListener("focus", this.trapFocus, true);
  }

  /**
   * Renders scene component within correct container of provided scene.
   */
  public render() {
    const { active, isFirst, isLast, scene } = this.props;
    const { position } = scene;
    const Container = CONTAINER_COMPONENTS[position];

    return (
      <Modal
        ref={this.modalRef}
        active={active}
        isFirst={isFirst}
        isLast={isLast}
        position={position}
      >
        <Container active={active}>{this.renderSceneComponent()}</Container>

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

  /**
   * Blurs currently active (focused) element if it is outside current modal.
   */
  private blurActiveElement() {
    const modal = this.modalRef.current;

    if (modal === null) {
      return;
    }

    const element = document.activeElement as HTMLElement;

    if (!modal.contains(element)) {
      element.blur();
    }
  }

  /**
   * Traps focus within the modal if this scene is at the top of the scene
   * stack.
   */
  private trapFocus = () => {
    const modal = this.modalRef.current;

    if (modal === null || !this.props.isLast) {
      return;
    }

    const element = document.activeElement as HTMLElement;

    if (element === document.body) {
      return;
    }

    if (modal.contains(element)) {
      this.previousActiveElement = element;
      return;
    }

    element.blur();

    const targets = modal.querySelectorAll<HTMLElement>(
      FOCUSABLE_ELEMENT_SELECTOR
    );

    if (targets.length === 0) {
      this.previousActiveElement = undefined;
      return;
    }

    const firstTarget = targets[0];
    const lastTarget = targets[targets.length - 1];

    if (this.previousActiveElement === firstTarget) {
      this.previousActiveElement = lastTarget;
    } else {
      this.previousActiveElement = firstTarget;
    }

    this.previousActiveElement.focus();
  };
}

/**
 * Focusable element selector.
 */
const FOCUSABLE_ELEMENT_SELECTOR =
  'a[href], area[href], button:not([disabled]), embed, iframe, input:not([disabled]), object, select:not([disabled]), textarea:not([disabled]), *[tabindex]:not([tabindex^="-"]), *[contenteditable]';

/**
 * Rendering position information.
 */
interface RenderPosition {
  /**
   * Whether rendered scene is active.
   */
  active: boolean;

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
    transform: scale(0.25);
    clip-path: circle(25%);
  }

  to {
    opacity: 1;
    transform: scale(1);
    clip-path: circle(80%);
  }
`;

/**
 * `Modal` component closing animation keyframes.
 */
const closeModal = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
    clip-path: circle(80%);
  }

  to {
    opacity: 0;
    transform: scale(0.25);
    clip-path: circle(25%);
  }
`;

/**
 * Modal component that is rendered on top of all preceding components.
 */
const Modal = styled.div<RenderPosition>`
  position: fixed;

  width: 100%;
  height: 100%;

  background-color: ${({ theme }) => theme.backgroundColorTranslucent};

  pointer-events: ${({ active, isLast }) =>
    active && isLast ? "initial" : "none"};

  display: flex;
  align-items: center;
  justify-content: ${({ position }) =>
    position === "center" ? "center" : "normal"};

  animation: ${({ active, isFirst, theme }) =>
    isFirst
      ? "none"
      : active
      ? css`
          ${fadeIn} ${theme.transition}
        `
      : css`
          ${fadeOut} ${theme.transition}
        `};

  @media screen and (max-width: ${({ theme }) => theme.widthCutoff}) {
    animation: ${({ active, isFirst, theme }) =>
      isFirst
        ? "none"
        : active
        ? css`
            ${openModal} ${theme.transition}
          `
        : css`
            ${closeModal} ${theme.transition}
          `};
  }
`;

/**
 * Container component props.
 */
interface ContainerProps {
  /**
   * Whether rendered scene is active.
   */
  active: boolean;
}

/**
 * Base container component.
 */
const BaseContainer = styled.div<ContainerProps>`
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
 * `Center` component closing animation keyframes.
 */
const closeCenter = keyframes`
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(25%);
  }
`;

/**
 * Container for scene component at `center` position.
 */
const Center = styled(BaseContainer)`
  max-width: ${({ theme }) => theme.widthSmall};
  max-height: 80%;

  width: 100%;

  border-radius: ${({ theme }) => theme.borderRadius};

  animation: ${({ active, theme }) =>
    active
      ? css`
          ${openCenter} ${theme.transitionLinear}
        `
      : css`
          ${closeCenter} ${theme.transitionLinear}
        `};
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
 * `Side` component closing animation keyframes.
 */
const closeSide = keyframes`
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-100%);
  }
`;

/**
 * Container for scene component at `side` position.
 */
const Side = styled(BaseContainer)`
  max-width: ${({ theme }) => theme.widthSmall};

  width: 100%;
  height: 100%;

  animation: ${({ active, theme }) =>
    active
      ? css`
          ${openSide} ${theme.transitionLinear}
        `
      : css`
          ${closeSide} ${theme.transitionLinear}
        `};
`;

/**
 * Maps scene positions to the container components.
 */
const CONTAINER_COMPONENTS = {
  center: Center,
  main: Main,
  side: Side,
};
