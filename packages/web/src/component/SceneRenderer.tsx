import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { RenderPosition, Scenes } from "../base/Scene";
import { Administration } from "../scene/Administration";
import { Confirmation } from "../scene/Confirmation";
import { Diet } from "../scene/Diet";
import { Edit } from "../scene/Edit";
import { History } from "../scene/History";
import { Home } from "../scene/Home";
import { Login } from "../scene/Login";
import { Logout } from "../scene/Logout";
import { Measurements } from "../scene/Measurements";
import { Quantity } from "../scene/Quantity";
import { Register } from "../scene/Register";
import { Search } from "../scene/Search";
import { Settings } from "../scene/Settings";
import { Unknown } from "../scene/Unknown";
import { styled } from "../styling/theme";
import { Navigation } from "./Navigation";
import { Overlay } from "./Overlay";
import { TitleBar } from "./TitleBar";

/**
 * Object where scene component names are mapped to their classes.
 */
const SCENE_COMPONENTS = {
  Administration: Administration,
  Confirmation: Confirmation,
  Diet: Diet,
  Edit: Edit,
  History: History,
  Home: Home,
  Login: Login,
  Logout: Logout,
  Measurements: Measurements,
  Quantity: Quantity,
  Register: Register,
  Search: Search,
  Settings: Settings,
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
@inject("views")
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
    document.documentElement.focus();
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
        aria-hidden={overlaid}
        onClick={this.handleClick}
        overlaid={overlaid}
        position={position}
        ref={this.overlayRef}
      >
        <Container>
          {first ? (
            <Navigation />
          ) : (
            <TitleBar onClose={this.pop} title={scene.title} />
          )}
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
   * Focuses on the first focuseable overlay element if currently active element is outside this overlay.
   */
  private focus = (event: FocusEvent) => {
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

    event.preventDefault();

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
   * Scene rendering position.
   */
  position: RenderPosition;

  /**
   * Whether or not there's another overlay above this one.
   */
  overlaid: boolean;
}

/**
 * Extended overlay component that contains a scene component.
 */
const SceneOverlay = styled(Overlay)<SceneOverlayProps>`
  background-color: ${({ theme }) => theme.translucentBackgroundColor};

  display: flex;
  align-items: center;
  justify-content: ${({ position }) =>
    position === "main" ? "center" : position};

  pointer-events: ${({ overlaid }) => (overlaid ? "none" : "initial")};
`;

/**
 * Container that is rendered on the whole screen.
 */
const Main = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.backgroundColor};
`;

/**
 * Container that is rendered on the left of the screen.
 */
const Left = styled(Main)`
  max-width: ${({ theme }) => theme.formWidth};
`;

/**
 * Container that is rendered in the center of the screen.
 */
const Center = styled(Main)`
  max-width: ${({ theme }) => theme.formWidth};
  height: initial;
  border-radius: ${({ theme }) => theme.borderRadius};

  @media screen and (max-width: ${({ theme }) => theme.formWidth}) {
    height: 100%;
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
