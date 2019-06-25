import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { InjectedProps } from "../store";
import { DEFAULT_LABEL } from "../styling/colors";
import { UNIT } from "../styling/sizes";

/**
 * Maps error names to it's translated text message parameters.
 */
interface ErrorProperties {
  invalidInvitation: never;
  unknown: never;
}

/**
 * Union of all error names.
 */
export type ErrorNames = keyof ErrorProperties;

/**
 * Error parameters object type of error named `TErrorName`.
 */
type ErrorParameters<TErrorName extends ErrorNames> = {
  [Parameter in ErrorProperties[TErrorName]]: string
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
 * Error component that displays a title and message of occurred error.
 */
@inject("translations")
@observer
export class Error<TErrorName extends ErrorNames> extends React.Component<
  ErrorProps<TErrorName> & InjectedProps
> {
  /**
   * Renders an error component.
   */
  public render() {
    const { name, parameters, translations } = this.props;

    let { title, message } = translations!.translation.errors[name];

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
      <Container>
        <Title>{title}</Title>
        <Message>{message}</Message>
      </Container>
    );
  }
}

/**
 * Component that contains error title and message text components.
 */
const Container = styled.div`
  width: 100%;
  max-width: ${10 * UNIT}rem;
  height: 100%;

  margin: auto;
  padding: ${2 * UNIT}rem ${UNIT / 2}rem;
  box-sizing: border-box;

  display: flex;
  justify-content: center;
  flex-direction: column;
`;

/**
 * Error title text component.
 */
const Title = styled.div`
  margin-bottom: ${UNIT / 2}rem;

  font-size: 2rem;
  letter-spacing: -0.022em;
  line-height: ${UNIT / 2}rem;
  text-align: center;
`;

/**
 * Error message text component.
 */
const Message = styled.div`
  color: ${DEFAULT_LABEL};
  line-height: ${UNIT / 3};
  text-align: center;
`;
