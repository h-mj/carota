import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Component } from "./Component";
import { DURATION, fadeIn, fadeOut } from "../styling/animations";
import { setTimeout } from "../utility/promises";
import { UNIT_HEIGHT } from "../styling/sizes";
import { keyframes, State, StateProps, styled } from "../styling/theme";
import { Field } from "./Input/Field";

/**
 * Specifies notification type and its text message parameter names.
 */
interface Types<TState extends State, TParameterNames extends string> {
  /**
   * Union of all text message parameter names.
   */
  parameterNames?: TParameterNames[];

  /**
   * Notification type.
   */
  state: TState;
}

/**
 * Returns `Types` type object which defines notification component state and
 * parameters based on notification name.
 *
 * @param state Notification component state.
 * @param parameterNames Notification component message parameter names.
 */
const withTypes = <TState extends State, TParameterNames extends string>(
  state: TState,
  parameterNames?: TParameterNames[]
): Types<TState, TParameterNames> => ({
  state,
  parameterNames
});

/**
 * Maps notification name to notification type and message parameter names.
 */
const NOTIFICATION_TYPES = {
  loginInvalidCredentials: withTypes("invalid")
};

/**
 * Union of all notification names.
 */
export type NotificationNames = keyof typeof NOTIFICATION_TYPES;

/**
 * Notification message parameters type that maps parameter names of given notification name to string
 * values.
 */
export type NotificationMessageParameters<
  TNotificationNames extends NotificationNames
> = typeof NOTIFICATION_TYPES[TNotificationNames] extends infer ITypes
  ? ITypes extends Types<infer _, infer IParameterNames>
    ? string extends IParameterNames
      ? {}
      : Record<IParameterNames, string>
    : never
  : never;

/**
 * Notification object type.
 */
export class Notification<TNotificationName extends NotificationNames> {
  /**
   * ID of the notification. Used to reference this object by string and it is
   * used as property `key` value if all notifications are rendered.
   */
  public id: string;

  /**
   * Notification name, that is used to retrieve notification type and its translated text message.
   */
  public name: TNotificationName;

  /**
   * Notification message parameter values.
   */
  public parameters: NotificationMessageParameters<TNotificationName>;

  /**
   * Creates a new Notification instance.
   *
   * @param name Notification name.
   * @param parameters Notification message parameters.
   */
  public constructor(
    name: TNotificationName,
    parameters: NotificationMessageParameters<TNotificationName>
  ) {
    this.id =
      Math.random()
        .toString(36)
        .substring(2) + Date.now().toString(36);
    this.name = name;
    this.parameters = parameters;
  }
}

/**
 * Union of all possible notification classes.
 */
export type Notifications = {
  [NotificationName in NotificationNames]: Notification<NotificationName>
}[NotificationNames];

/**
 * Translations of an notification component.
 */
interface NotificationTranslation {
  message: string;
}

/**
 * Component that displays all notifications in the bottom left corner.
 */
@inject("views")
@observer
export class NotificationContainer extends Component<
  {},
  Record<NotificationNames, NotificationTranslation>
> {
  /**
   * Stores all notifications that should be visible. Also includes "fading" notifications
   * that are no longer included in `notifications` prop.
   */
  @observable private visibleNotifications: Array<Notifications> = [];

  /**
   * Adds new notifications to `visibleNotifications` array, and fades inactive notifications out.
   */
  public componentWillUpdate() {
    const { notifications } = this.props.views!;

    // Add new notifications to `visibleNotifications`,
    for (const notification of notifications) {
      if (!this.visibleNotifications.includes(notification)) {
        this.visibleNotifications.push(notification);
      }
    }

    // and make inactive notifications fade out.
    for (const notification of this.visibleNotifications) {
      if (!notifications.includes(notification)) {
        this.fadeNotification(notification);
      }
    }
  }

  /**
   * Renders all visible notifications.
   */
  public render() {
    // `this.visibleNotifications.length` is always greater or equal to
    // `this.props.views!.notifications.length`, so the first part of and
    // statement is useless. The reason why it is included is that otherwise
    // this component won't be re-rendered, because the reference to array
    // doesn't change and MobX thinks nothing will be changed as a result of
    // re-rendering.
    if (
      this.props.views!.notifications.length === 0 &&
      this.visibleNotifications.length === 0
    ) {
      return null;
    }

    return (
      <NotificationBox>
        {this.visibleNotifications.map(this.renderNotification)}
      </NotificationBox>
    );
  }

  /**
   * Renders one of the notifications.
   */
  private renderNotification = (notification: Notifications) => {
    const { notifications } = this.props.views!;
    const { id, name, parameters } = notification;

    let message = this.translation[name].message;

    // Replace message parameters with their values.
    for (const parameter in parameters) {
      message = message.replace(
        `{${parameter}}`,
        parameters[parameter as keyof typeof parameters]
      );
    }

    return (
      <NotificationElement
        key={id}
        isActive={notifications.includes(notification)}
        onClick={() => this.props.views!.conceal(notification)}
        state={NOTIFICATION_TYPES[name].state}
      >
        {message}
      </NotificationElement>
    );
  };

  /**
   * Removes an notification from `visibleNotifications` array after a timeout.
   */
  @action
  private async fadeNotification(notification: Notifications) {
    await setTimeout(DURATION);
    this.visibleNotifications.splice(
      this.visibleNotifications.indexOf(notification),
      1
    );
  }
}

/**
 * Container that contains all notifications.
 */
const NotificationBox = styled.div`
  position: fixed;
  bottom: ${UNIT_HEIGHT / 4}rem;
  left: ${UNIT_HEIGHT / 4}rem;
`;

/**
 * NotificationElement component move in animation.
 */
const moveIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

/**
 * NotificationElement component move out animation.
 */
const moveOut = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
`;

/**
 * Actual notification component properties.
 */
interface NotificationElementProps extends StateProps {
  /**
   * Whether or not this notification is active.
   */
  isActive: boolean;
}

/**
 * Notification component that displays the message.
 */
const NotificationElement = styled(Field)<NotificationElementProps>`
  margin-top: ${UNIT_HEIGHT / 4}rem;
  padding: 0 ${UNIT_HEIGHT / 4}rem;
  box-sizing: border-box;

  animation: ${props => (props.isActive ? fadeIn : fadeOut)} ${DURATION}s,
    ${props => (props.isActive ? moveIn : moveOut)} ${DURATION}s;

  cursor: pointer;
`;
