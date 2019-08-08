import { inject, observer } from "mobx-react";
import * as React from "react";
import { Component } from "./Component";
import { Center } from "./collection/container";
import { styled } from "../styling/theme";

/**
 * Maps alert names to it's translated text message parameter names.
 */
const ALERT_PARAMETER_NAMES = {
  invalidInvitation: [] as const,
  unknown: [] as const
};

/**
 * Union of all alert names.
 */
type AlertNames = keyof typeof ALERT_PARAMETER_NAMES;

/**
 * Parameters type of alerts named `TAlertNames`.
 */
type AlertParameters<TAlertNames extends AlertNames> = Record<
  typeof ALERT_PARAMETER_NAMES[TAlertNames] extends readonly (infer IParameterNames)[]
    ? IParameterNames extends string
      ? IParameterNames
      : never
    : never,
  string
>;

/**
 * Alert component props.
 */
interface AlertProps<TAlertName extends AlertNames> {
  /**
   * Name of the alert.
   */
  name: TAlertName;

  /**
   * Alert title and message text parameters.
   */
  parameters: AlertParameters<TAlertName>;
}

/**
 * Translation of some alert.
 */
interface AlertTranslation {
  title: string;
  message: string;
}

/**
 * Alert component that displays alert title and translated message.
 */
@inject("views")
@observer
export class Alert<
  TAlertName extends AlertNames = AlertNames
> extends Component<
  AlertProps<TAlertName>,
  Record<AlertNames, AlertTranslation>
> {
  /**
   * Renders an alert component.
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
        <Title>{title}</Title>
        <Message>{message}</Message>
      </Center>
    );
  }
}

/**
 * Alert title text component.
 */
const Title = styled.div`
  max-width: ${({ theme }) => theme.formWidth};
  margin-bottom: calc(${({ theme }) => theme.padding} / 3);
  color: ${({ theme }) => theme.primaryColor};
  font-size: 2rem;
  letter-spacing: -0.022em;
  line-height: 2.5rem;
`;

/**
 * Alert message text component.
 */
const Message = styled.div`
  max-width: ${({ theme }) => theme.formWidth};
  color: ${({ theme }) => theme.secondaryColor};
  line-height: 1.5rem;
  text-align: justify;
`;
