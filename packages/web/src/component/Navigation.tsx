import * as React from "react";
import { styled } from "../styling/theme";
import { RESET } from "../styling/stylesheets";
import { Anchor } from "./Anchor";
import { Scene } from "../base/Scene";

/**
 * Navigation bar component that is either rendered on the left of the page if
 * viewed from a desktop, or bottom on mobile devices.
 */
export class Navigation extends React.Component {
  /**
   * Renders the navigation bar.
   */
  public render() {
    return (
      <Container>
        <Anchor scene={new Scene("Logout", {}, {})}>
          <Item>↳</Item>
        </Anchor>
      </Container>
    );
  }
}

/**
 * Navigation bar container.
 */
const Container = styled.div`
  width: ${({ theme }) => theme.height};
  height: 100%;

  flex-shrink: 0;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  background-color: ${({ theme }) => theme.backgroundColor};
  border-right: solid 1px ${({ theme }) => theme.borderColor};

  @media screen and (max-width: ${({ theme }) => theme.widthCutoff}) {
    width: 100%;
    height: ${({ theme }) => theme.height};

    flex-direction: row;

    border-top: solid 1px ${({ theme }) => theme.borderColor};
    border-right: 0;
  }
`;

/**
 * Navigation item component.
 */
const Item = styled.button`
  ${RESET};

  width: ${({ theme }) => theme.height};
  height: ${({ theme }) => theme.height};

  color: ${({ theme }) => theme.colorSecondary};
  font-size: 1rem;
  text-align: center;

  cursor: pointer;
`;
