import { inject, observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";
import { Component } from "./Component";
import { Center } from "./container/Center";
import { Medium } from "./container/Medium";
import { UNIT_HEIGHT } from "../styling/sizes";
import { LIGHT } from "../styling/light";

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
        <Medium>
          <Title>{title}</Title>
          <Message>{message}</Message>
        </Medium>
      </Center>
    );
  }
}

/**
 * Alert title text component.
 */
const Title = styled.div`
  margin-bottom: ${UNIT_HEIGHT / 4}rem;
  color: ${LIGHT.colorPrimary};
  font-size: 2rem;
  letter-spacing: -0.022em;
  line-height: 2.5rem;
  text-align: center;
`;

/**
 * Alert message text component.
 */
const Message = styled.div`
  color: ${LIGHT.colorSecondary};
  line-height: 1.5rem;
  text-align: center;
`;
