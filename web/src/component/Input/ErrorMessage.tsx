import * as React from "react";
import { Component } from "../Component";
import { Label } from "./Label";
import {
  DURATION,
  fadeIn,
  fadeOut,
  TIMING_FUNCTION
} from "../../styling/animations";
import { UNIT_HEIGHT } from "../../styling/sizes";
import { styled } from "../../styling/theme";

/**
 * Error message component props.
 */
interface ErrorMessageProps {
  /**
   * Error message.
   */
  message?: string;
}

/**
 * Error message component that displays an error message.
 */
export class ErrorMessage extends Component<ErrorMessageProps> {
  /**
   * Previous error message so that if no error message is provided, this value
   * will be used as error message on fade out.
   */
  private previousMessage?: string;

  /**
   * Updates previous error message value.
   */
  public componentWillReceiveProps(props: ErrorMessageProps) {
    if (props.message !== undefined) {
      this.previousMessage = props.message;
    }
  }

  /**
   * Renders the error message.
   */
  public render() {
    if (this.previousMessage === undefined) {
      return null;
    }

    return (
      <Message active={this.props.message !== undefined} state="invalid">
        {this.previousMessage}
      </Message>
    );
  }
}

/**
 * Message component props.
 */
interface MessageProps {
  /**
   * Whether or not error message is active.
   */
  active: boolean;
}

/**
 * Component that contains the error message.
 */
const Message = styled(Label)<MessageProps>`
  top: initial;
  bottom: -${UNIT_HEIGHT / 8}rem;
  animation: ${({ active }) => (active ? fadeIn : fadeOut)} ${DURATION}s
    ${TIMING_FUNCTION} forwards;
`;
