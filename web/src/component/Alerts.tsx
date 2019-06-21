import * as React from "react";
import styled, { keyframes } from "styled-components";
import { BACKGROUND, DEFAULT_BORDER, ERROR } from "../styling/colors";
import { BORDER_RADIUS, UNIT } from "../styling/sizes";
import { TRANSITION, TRANSITION_DURATION } from "../styling/animations";
import { InjectedProps } from "../store";
import { inject, observer } from "mobx-react";
import { observable, action } from "mobx";

/**
 * Union of all alert types.
 */
type AlertTypes = "default" | "error";

/**
 * Maps alert name to alert type and alert message parameter names.
 */
interface AlertsProperties {
  signInInvalidCredentials: AlertProperties<"error", never>;
}

/**
 * Specifies alert type and its text message parameter names.
 */
interface AlertProperties<
  TAlertType extends AlertTypes,
  TParameterNames extends string
> {
  /**
   * Union of all text message parameter names.
   */
  parameterNames: TParameterNames;

  /**
   * Alert type.
   */
  type: TAlertType;
}

/**
 * Union of all alert names.
 */
export type AlertNames = keyof AlertsProperties;

/**
 * Alert parameters type that maps parameter names of given alert name to string
 * values.
 */
export type AlertParameters<TAlertName extends AlertNames> = {
  [AlertName in AlertNames]: AlertName extends TAlertName
    ? { [Parameter in AlertsProperties[AlertName]["parameterNames"]]: string }
    : never
}[AlertNames];

/**
 * Object that maps alert names to their types.
 */
const NAME_TO_TYPE: Readonly<
  { [AlertName in AlertNames]: AlertsProperties[AlertName]["type"] }
> = {
  signInInvalidCredentials: "error"
};

/**
 * Alert object type.
 */
export interface Alert<TAlertName extends AlertNames> {
  /**
   * ID of the Alert. Used to reference this object by string and property `key`
   * value if all alerts are rendered.
   */
  id: string;

  /**
   * Alert name, that is used to retrieve alert type and its translated text message.
   */
  name: TAlertName;

  /**
   * Alert's text message parameter values.
   */
  parameters: AlertParameters<TAlertName>;
}

/**
 * Alerts component properties.
 */
interface AlertsProps {
  /**
   * List of active alerts.
   */
  alerts: Array<Alert<AlertNames>>;
}

@inject("scenes", "translations")
@observer
export class Alerts extends React.Component<AlertsProps & InjectedProps> {
  /**
   * Stores all alerts that should be visible. Also includes "fading" alerts
   * that are no longer included in `alerts` prop.
   */
  @observable private renderedAlerts: Array<Alert<AlertNames>> = [];

  /**
   * Maps fading alert id to its timeout, which after a period of time removes
   * the alert from `renderedAlerts` array.
   */
  @observable private fadeTimeouts: Map<string, number> = new Map();

  /**
   * Adds new alerts to `renderedAlerts` array, maps removed alerts ids to their
   * timeouts in `fadeTimeouts` map and renders all rendered alerts.
   */
  public render() {
    const { alerts } = this.props;

    // Add new alerts to `renderedAlerts`.
    for (const alert of alerts) {
      if (!this.renderedAlerts.includes(alert)) {
        this.renderedAlerts.push(alert);
      }
    }

    // Make removed alerts fade away.
    for (const alert of this.renderedAlerts) {
      if (!alerts.includes(alert) && !this.fadeTimeouts.has(alert.id)) {
        this.fadeTimeouts.set(
          alert.id,
          setTimeout(this.popAlert, TRANSITION_DURATION * 1000, alert)
        );
      }
    }

    return (
      <AlertsContainer>
        {this.renderedAlerts.map(this.renderAlert)}
      </AlertsContainer>
    );
  }

  /**
   * Renders one of the alerts.
   */
  private renderAlert = (alert: Alert<AlertNames>) => {
    const { id, name, parameters } = alert;

    let message = this.props.translations!.translation.alerts[name].message;

    // Replace message parameters with their values.
    for (const parameter in parameters) {
      message = message.replace(
        `{${parameter}}`,
        parameters[parameter as keyof typeof parameters]
      );
    }

    return (
      <AlertContainer key={id}>
        <AlertElement
          fading={this.fadeTimeouts.has(id)}
          onClick={() => this.props.scenes!.popAlert(alert)}
          type={NAME_TO_TYPE[name]}
        >
          {message}
        </AlertElement>
      </AlertContainer>
    );
  };

  /**
   * Removes an alert from both `renderedAlerts` array and `fadeTimeouts` map.
   */
  @action
  private popAlert = (alert: Alert<AlertNames>) => {
    this.renderedAlerts.splice(this.renderedAlerts.indexOf(alert), 1);
    this.fadeTimeouts.delete(alert.id);
  };
}

/**
 * Container that contains all alert components.
 */
const AlertsContainer = styled.div`
  position: absolute;
  bottom: ${UNIT / 2}rem;
  left: ${UNIT / 2}rem;
`;

/**
 * Container that contains the alert component.
 */
const AlertContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: ${UNIT}rem;
`;

/**
 * Alert fade in animation.
 */
const alertFadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

/**
 * Object that maps alert types to alert border color.
 */
const TYPE_TO_BORDER_COLOR: Readonly<{ [AlertType in AlertTypes]: string }> = {
  default: DEFAULT_BORDER,
  error: ERROR
};

/**
 * Actual alert component properties.
 */
interface AlertElementProps {
  /**
   * Boolean showing whether or not this alert is fading away.
   */
  fading: boolean;

  /**
   * Alert type.
   */
  type: AlertTypes;
}

/**
 * Alert component that displays the alert message.
 */
const AlertElement = styled.div<AlertElementProps>`
  display: flex;
  align-items: center;

  height: ${(3 * UNIT) / 4}rem;
  padding: 0 ${UNIT / 4}rem;
  box-sizing: border-box;

  background-color: ${BACKGROUND};

  border-radius: ${BORDER_RADIUS}rem;
  box-shadow: 0 0 0 1px ${props => TYPE_TO_BORDER_COLOR[props.type]},
    inset 0 0 0 1px ${props => TYPE_TO_BORDER_COLOR[props.type]};

  opacity: ${props => (props.fading ? 0 : 1)};
  transform: translateX(${props => (props.fading ? -100 : 0)}%);

  animation: ${alertFadeIn} ${TRANSITION_DURATION}s;

  ${TRANSITION}

  cursor: pointer;
`;
