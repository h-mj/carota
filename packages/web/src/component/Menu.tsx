import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { Scene } from "../base/Scene";
import { TranslatedComponent } from "../base/TranslatedComponent";
import { Account } from "../model/Account";
import { fadeIn } from "../styling/animations";
import { RESET } from "../styling/stylesheets";
import { styled } from "../styling/theme";
import { Anchor } from "./Anchor";
import { Burger } from "./collection/icons";
import { Overlay } from "./Overlay";

/**
 * Function that always returns true.
 */
const ALWAYS = () => true;

/**
 * Array of scene name and requirement functions pairs which specify which items
 * will appear in the navigation menu and on what condition.
 */
const NAVIGABLE_SCENE_REQUIREMENTS = [
  [new Scene("Diet", undefined, {}), ALWAYS],
  [new Scene("Body", undefined, {}), ALWAYS],
  [new Scene("Statistics", undefined, {}), ALWAYS],
  [
    new Scene("Advisees", undefined, {}),
    (account: Account) => account.type === "Adviser"
  ],
  [new Scene("Settings", undefined, {}), ALWAYS],
  [new Scene("Logout", undefined, {}), ALWAYS]
] as const;

/**
 * Menu item translations.
 */
type MenuTranslation = Record<
  typeof NAVIGABLE_SCENE_REQUIREMENTS[number][0]["name"],
  string
>;

/**
 * Navigation menu component.
 */
@inject("accountStore", "viewStore")
@observer
export class Menu extends TranslatedComponent<"Menu", {}, MenuTranslation> {
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
                {NAVIGABLE_SCENE_REQUIREMENTS.map(
                  ([scene, requirement]) =>
                    requirement(this.props.accountStore!.current!) && (
                      <Item
                        key={scene.name}
                        onClick={this.handleRedirect}
                        scene={scene}
                      >
                        {this.translation[scene.name]}
                      </Item>
                    )
                )}
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

  transition: ${({ theme }) => theme.transition};

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
  background-color: ${({ theme }) => theme.backgroundColorSecondary};
  animation: ${fadeIn} ${({ theme }) => theme.transition};
`;
