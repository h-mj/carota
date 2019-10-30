import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { Scene } from "../base/Scene";
import { TranslatedComponent } from "../base/TranslatedComponent";
import { fadeIn } from "../styling/animations";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";
import { Anchor } from "./Anchor";
import { Burger } from "./collection/icons";
import { Overlay } from "./Overlay";

/**
 * Navigation menu component.
 */
@inject("views")
@observer
export class Menu extends TranslatedComponent<"Menu"> {
  /**
   * Whether navigation menu is visible.
   */
  @observable private visible = false;

  /**
   * Sets the name of this component.
   */
  public constructor(props: {}) {
    super("Menu", props);
  }

  /**
   * Renders the menu component.
   */
  public render() {
    return (
      <>
        <Button onClick={this.handleOpenClick}>
          <Burger />
        </Button>

        {this.visible && (
          <MenuOverlay onClick={this.handleOverlayClick}>
            <MenuContainer>
              <Navigation>
                <Item onClick={this.handleRedirect} scene={new Scene("Diet", {}, {})}>Daily intake</Item>
                <Item onClick={this.handleRedirect} scene={new Scene("Logout", {}, {})}>Sign out</Item>
              </Navigation>
            </MenuContainer>
          </MenuOverlay>
        )}
      </>
    );
  }

  /**
   * Shows the navigation menu.
   */
  @action
  private handleOpenClick = () => {
    this.visible = true;
  };

  /**
   * Hides the navigation menu on redirect.
   */
  @action
  private handleRedirect = () => {
    this.visible = false;
  };

  /**
   * Hides the menu if user clicks on overlay.
   */
  @action
  private handleOverlayClick: React.MouseEventHandler<
    HTMLDivElement
  > = event => {
    if (event.target !== event.currentTarget) {
      return;
    }

    this.visible = false;
  };
}

/**
 * Button which opens the menu.
 */
const Button = styled.button`
  ${RESET};

  position: fixed;
  left: ${({ theme }) => theme.heightHalf};
  bottom: ${({ theme }) => theme.heightHalf};

  width: ${({ theme }) => theme.height};
  height: ${({ theme }) => theme.height};

  border: solid 1px ${({ theme }) => theme.borderColor};
  border-radius: ${({ theme }) => theme.heightHalf};
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.backgroundColor};

  & > svg {
    display: block;
    width: 100%;
  }

  cursor: pointer;
`;

/**
 * Navigation menu overlay component.
 */
const MenuOverlay = styled(Overlay)`
  z-index: 4;

  background-color: ${({ theme }) => theme.backgroundColorTranslucent};

  animation: ${fadeIn} ${({ theme }) => theme.transition};
`;

/**
 * Navigation menu container that positions and pads out the actual `Navigation`
 * component.
 */
const MenuContainer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;

  padding: ${({ theme }) => theme.heightHalf};
  box-sizing: border-box;

  max-width: calc(${({ theme }) => theme.widthSmall} / 1.5);
  width: 100%;
`;

/**
 * Navigation anchor item component.
 */
const Item = styled(Anchor)`
  display: block;

  width: 100%;
  height: ${({ theme }) => theme.height};

  display: flex;
  align-items: center;

  padding: 0 ${({ theme }) => theme.paddingSecondary};
  box-sizing: border-box;

  color: ${({ theme }) => theme.colorPrimary};
  text-decoration: none;
`;

/**
 * Navigation component that contains all anchor components.
 */
const Navigation = styled.nav`
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.backgroundColor};
`;
