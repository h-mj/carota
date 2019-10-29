import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { RenderPosition, Scenes } from "../base/Scene";
import { Confirmation } from "../scene/Confirmation";
import { Diet } from "../scene/Diet";
import { Edit } from "../scene/Edit";
import { Login } from "../scene/Login";
import { Logout } from "../scene/Logout";
import { Name } from "../scene/Name";
import { Quantity } from "../scene/Quantity";
import { Register } from "../scene/Register";
import { Scanner } from "../scene/Scanner";
import { Search } from "../scene/Search";
import { Unknown } from "../scene/Unknown";
import { fadeIn } from "../styling/animations";
import { keyframes, styled } from "../styling/theme";
import { Overlay } from "./Overlay";
import { TitleBar } from "./TitleBar";

/**
 * Object where scene component names are mapped to their classes.
 */
const SCENE_COMPONENTS = {
  Confirmation: Confirmation,
  Diet: Diet,
  Edit: Edit,
  Login: Login,
  Logout: Logout,
  Name: Name,
  Quantity: Quantity,
  Register: Register,
  Scanner: Scanner,
  Search: Search,
  Unknown: Unknown
} as const;

/**
 * Scene rendered props.
 */
interface SceneRendererProps {
  /**
   * Whether this scenes is the first element in the scene stack.
   */
  first: boolean;

  /**
   * Whether this scene is overlaid by another scene.
   */
  overlaid: boolean;

  /**
   * Scene which will be rendered.
   */
  scene: Scenes;
}

/**
 * Component which is responsible for rendering a given scene.
 */
@inject("accounts", "views")
@observer
export class SceneRenderer extends Component<SceneRendererProps> {
  /**
   * Scene overlay ref.
   */
  private overlayRef = React.createRef<HTMLDivElement>();

  /**
   * Adds focus event listener that focuses back into an element in the overlay
   * when focus escapes the overlay.
   */
  public componentDidMount() {
    this.focus(); // Focuses on the first focusable element if current focus is outside this component.
    document.addEventListener("focus", this.focus, true);
  }

  /**
   * Remove added focus event listener.
   */
  public componentWillUnmount() {
    document.removeEventListener("focus", this.focus, true);
  }

  /**
   * Renders the scene to correct position.
   */
  public render() {
    const { first, overlaid, scene } = this.props;
    const { position } = scene;
    const Container = CONTAINERS[position];

    return (
      <SceneOverlay
        aria-hidden={overlaid ? true : undefined}
        onClick={this.handleClick}
        overlaid={overlaid}
        position={position}
        ref={this.overlayRef}
        tabIndex={-1}
      >
        <Container>
          {!first && <TitleBar onClose={this.pop} title={scene.title} />}
          {this.renderSceneComponent()}
        </Container>
      </SceneOverlay>
    );
  }

  /**
   * Renders scene component of specified scene.
   */
  private renderSceneComponent() {
    const { scene } = this.props;
    const SceneComponent: typeof React.Component =
      SCENE_COMPONENTS[scene.componentName];

    return <SceneComponent scene={scene} {...scene.props} />;
  }

  /**
   * Pops rendered scene when user clicks on the overlay.
   */
  @action
  private handleClick: React.MouseEventHandler<HTMLDivElement> = event => {
    if (event.target !== event.currentTarget) {
      return;
    }

    this.pop();
  };

  /**
   * Pops rendered scene from active scenes.
   */
  @action
  private pop = () => {
    this.props.views!.pop(this.props.scene);
  };

  /**
   * Focuses on the first focusable overlay element if currently active element is outside this overlay.
   */
  private focus = (event?: FocusEvent) => {
    const { current } = this.overlayRef;

    if (
      this.props.overlaid ||
      !document.hasFocus() ||
      document.activeElement === null ||
      document.activeElement === document.body ||
      document.activeElement === document.documentElement ||
      current === null ||
      current.contains(document.activeElement)
    ) {
      return;
    }

    if (event !== undefined) {
      event.preventDefault();
    }

    const targets = current.querySelectorAll(FOCUSABLE_ELEMENT_SELECTOR);

    if (targets.length === 0) {
      return;
    }

    ((targets[0] as unknown) as HTMLElement).focus();
  };
}

/**
 * Focusable element selector.
 */
const FOCUSABLE_ELEMENT_SELECTOR =
  'a[href], area[href], button:not([disabled]), embed, iframe, input:not([disabled]), object, select:not([disabled]), textarea:not([disabled]), *[tabindex]:not([tabindex^="-"]), *[contenteditable]';

/**
 * Scene overlay props.
 */
interface SceneOverlayProps {
  /**
   * Whether there's another overlay above this one.
   */
  overlaid: boolean;

  /**
   * Scene rendering position.
   */
  position: RenderPosition;
}

/**
 * Extended overlay component that contains a scene component.
 */
const SceneOverlay = styled(Overlay)<SceneOverlayProps>`
  display: flex;
  flex-direction: "row";
  align-items: center;
  justify-content: ${({ position }) =>
    position === "main" ? "center" : position};

  background-color: ${({ theme }) => theme.backgroundColorTranslucent};

  animation: ${fadeIn} ${({ theme }) => theme.transition};

  pointer-events: ${({ overlaid }) => (overlaid ? "none" : "initial")};
`;

/**
 * Container that is rendered on the whole screen.
 */
const Main = styled.div`
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: auto;

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.backgroundColor};
`;

/**
 * Left component slide right animation.
 */
const slideRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100%);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

/**
 * Center component slide up animation.
 */
const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50%);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/**
 * Container that is rendered on the left of the screen.
 */
const Left = styled(Main)`
  max-width: ${({ theme }) => theme.widthSmall};
  animation: ${slideRight} ${({ theme }) => theme.transition};

  @media screen and (max-width: ${({ theme }) => theme.widthCutoff}) {
    max-width: initial;
    animation: ${slideUp} ${({ theme }) => theme.transition};
  }
`;

/**
 * Container that is rendered in the center of the screen.
 */
const Center = styled(Main)`
  max-width: ${({ theme }) => theme.widthSmall};
  height: initial;

  border-radius: ${({ theme }) => theme.borderRadius};
  animation: ${slideUp} ${({ theme }) => theme.transition};

  @media screen and (max-width: ${({ theme }) => theme.widthCutoff}) {
    height: 100%;
    max-width: initial;
    border-radius: 0;
  }
`;

/**
 * Maps render positions to their wrapper container components.
 */
const CONTAINERS = {
  center: Center,
  left: Left,
  main: Main
};
