import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { Component } from "./Component";
import { Center } from "./container/Center";
import { Medium } from "./container/Medium";
import { DEFAULT_LABEL } from "../styling/colors";
import { UNIT } from "../styling/sizes";

/**
 * Maps error names to it's translated text message parameters.
 */
interface ErrorPropertyTypes {
  invalidInvitation: never;
  unknown: never;
}

/**
 * Union of all error names.
 */
export type ErrorNames = keyof ErrorPropertyTypes;

/**
 * Error parameters object type of error named `TErrorName`.
 */
type ErrorParameters<TErrorName extends ErrorNames> = {
  [Parameter in ErrorPropertyTypes[TErrorName]]: string
};

/**
 * Error component props.
 */
interface ErrorProps<TErrorName extends ErrorNames> {
  /**
   * Name of the error.
   */
  name: TErrorName;

  /**
   * Error title and message text parameters.
   */
  parameters: ErrorParameters<TErrorName>;
}

/**
 * Type that maps error names to their translations.
 */
type ErrorsTranslation = { [ErrorName in ErrorNames]: ErrorTranslation };

/**
 * Translations of an error component.
 */
interface ErrorTranslation {
  title: string;
  message: string;
}

/**
 * Error component that displays a title and message of occurred error.
 */
@inject("translations")
@observer
export class Error<TErrorName extends ErrorNames> extends Component<
  ErrorProps<TErrorName>,
  ErrorsTranslation
> {
  /**
   * Renders an error component.
   */
  public render() {
    const { name, parameters } = this.props;

    let { title, message } = this.translation[name];

    // Replace parameters in both title and message texts
    for (const parameter in parameters) {
      title = title.replace(
        `{${parameter}}`,
        parameters[parameter as keyof typeof parameters]
      );

      message = message.replace(
        `{${parameter}}`,
        parameters[parameter as keyof typeof parameters]
      );
    }

    return (
      <Center>
        <Medium>
          <Title>{title}</Title>
          <Message>{message}</Message>
        </Medium>
      </Center>
    );
  }
}

/**
 * Error title text component.
 */
const Title = styled.div`
  margin-bottom: ${UNIT / 4}rem;
  font-size: 2rem;
  letter-spacing: -0.022em;
  line-height: 2.5rem;
  text-align: center;
`;

/**
 * Error message text component.
 */
const Message = styled.div`
  color: ${DEFAULT_LABEL};
  line-height: 1.5rem;
  text-align: center;
`;
