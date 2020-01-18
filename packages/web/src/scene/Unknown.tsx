import { inject } from "mobx-react";
import * as React from "react";

import { SceneComponent, SceneComponentProps } from "../base/SceneComponent";
import { Center } from "../component/Center";
import { styled } from "../styling/theme";

/**
 * Unknown scene component translation.
 */
interface UnknownTranslation {
  /**
   * Page not found error message translation.
   */
  message: string;
}

/**
 * Scene component that is rendered if no other scenes match current URL.
 */
@inject("viewStore")
export class Unknown extends SceneComponent<"Unknown", {}, UnknownTranslation> {
  /**
   * Sets the name of this scene.
   */
  public constructor(props: SceneComponentProps<"Unknown">) {
    super("Unknown", props);
  }

  /**
   * Renders an unknown page error.
   */
  public render() {
    return (
      <Center>
        <Wrapper>
          <Message>{this.translation.message}</Message>
          <Code>404</Code>
        </Wrapper>
      </Center>
    );
  }
}

/**
 * Wraps the message and code components and adds a padding around them.
 */
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: ${({ theme }) => theme.padding};
  box-sizing: border-box;
`;

/**
 * 404 error message container.
 */
const Message = styled.div`
  color: ${({ theme }) => theme.colorSecondary};
  line-height: 1.4rem;
  text-align: center;
`;

/**
 * Error code container.
 */
const Code = styled.div`
  color: ${({ theme }) => theme.colorPrimary};
  font-size: 25vmin;
  line-height: 25vmin;
  text-align: center;
`;
