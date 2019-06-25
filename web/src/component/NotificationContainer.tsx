import { action, observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import styled, { keyframes } from "styled-components";
import { InjectedProps } from "../store";
import { fadeIn, fadeOut, TRANSITION_DURATION } from "../styling/animations";
import { BACKGROUND, DEFAULT_BORDER, ERROR } from "../styling/colors";
import { BORDER_RADIUS, UNIT } from "../styling/sizes";
import { setTimeout } from "../utility/forms";

/**
 * Union of all notification types.
 */
type NotificationTypes = "default" | "error";

/**
 * Maps notification name to notification type and message parameter names.
 */
interface NotificationsTypes {
  loginInvalidCredentials: Types<"error">;
}

/**
 * Specifies notification type and its text message parameter names.
 */
interface Types<
  TNotificationType extends NotificationTypes,
  TParameterNames extends string = never
> {
  /**
   * Union of all text message parameter names.
   */
  parameterNames: TParameterNames;

  /**
   * Notification type.
   */
  type: TNotificationType;
}

/**
 * Union of all notification names.
 */
export type NotificationNames = keyof NotificationsTypes;

/**
 * Notification message parameters type that maps parameter names of given notification name to string
 * values.
 */
export type NotificationMessageParameters<
  TNotificationName extends NotificationNames
> = {
  [NotificationName in NotificationNames]: NotificationName extends TNotificationName
    ? {
        [Parameter in NotificationsTypes[NotificationName]["parameterNames"]]: string
      }
    : never
}[NotificationNames];

/**
 * Object that maps notification names to their types.
 */
const NAME_TO_TYPE: Readonly<
  {
    [NotificationName in NotificationNames]: NotificationsTypes[NotificationName]["type"]
  }
> = {
  loginInvalidCredentials: "error"
};

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
 * Union of all notifications.
 */
export type Notifications = {
  [NotificationName in NotificationNames]: Notification<NotificationName>
}[NotificationNames];

/**
 * NotificationContainer component properties.
 */
interface NotificationContainerProps {
  /**
   * Array of active notifications.
   */
  notifications: Array<Notification<NotificationNames>>;
}

@inject("translations", "view")
@observer
export class NotificationContainer extends React.Component<
  NotificationContainerProps & InjectedProps
> {
  /**
   * Stores all notifications that should be visible. Also includes "fading" notifications
   * that are no longer included in `notifications` prop.
   */
  @observable private visibleNotifications: Array<
    Notification<NotificationNames>
  > = [];

  /**
   * Set containing notifications that are no longer active and are fading away.
   */
  @observable private fadingNotificationIds: Set<string> = new Set();

  /**
   * Adds new notifications to `visibleNotifications` array, adds visible but no
   * longer active notification IDs to `fadingNotificationIds` and renders all
   * visible notifications.
   */
  public render() {
    const { notifications } = this.props;

    // Add new notifications to `visibleNotifications`.
    for (const notification of notifications) {
      if (!this.visibleNotifications.includes(notification)) {
        this.visibleNotifications.push(notification);
      }
    }

    // Make inactive notifications fade away.
    for (const notification of this.visibleNotifications) {
      if (
        !notifications.includes(notification) &&
        !this.fadingNotificationIds.has(notification.id)
      ) {
        this.fadeNotification(notification);
      }
    }

    if (this.visibleNotifications.length === 0) {
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
  private renderNotification = (
    notification: Notification<NotificationNames>
  ) => {
    const { id, name, parameters } = notification;

    let message = this.props.translations!.translation.notifications[name]
      .message;

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
        isActive={!this.fadingNotificationIds.has(id)}
        onClick={() => this.props.view!.conceal(notification)}
        type={NAME_TO_TYPE[name]}
      >
        {message}
      </NotificationElement>
    );
  };

  /**
   * Removes an notification from both `visibleNotifications` array and
   * `fadingNotificationIds` set.
   */
  @action
  private async fadeNotification(
    notification: Notification<NotificationNames>
  ) {
    this.fadingNotificationIds.add(notification.id);
    await setTimeout(TRANSITION_DURATION);
    this.visibleNotifications.splice(
      this.visibleNotifications.indexOf(notification),
      1
    );
    this.fadingNotificationIds.delete(notification.id);
  }
}

/**
 * Container that contains all notifications.
 */
const NotificationBox = styled.div`
  position: fixed;
  bottom: ${UNIT / 4}rem;
  left: ${UNIT / 4}rem;
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
 * Object that maps notification types to border color.
 */
const TYPE_TO_BORDER_COLOR: Readonly<
  { [NotificationType in NotificationTypes]: string }
> = {
  default: DEFAULT_BORDER,
  error: ERROR
};

/**
 * Actual notification component properties.
 */
interface NotificationElementProps {
  /**
   * Whether or not this notification is active.
   */
  isActive: boolean;

  /**
   * Notification type.
   */
  type: NotificationTypes;
}

/**
 * Notification component that displays the message.
 */
const NotificationElement = styled.div<NotificationElementProps>`
  display: flex;
  align-items: center;

  height: ${UNIT}rem;
  margin-top: ${UNIT / 4}rem;
  padding: 0 ${UNIT / 4}rem;
  box-sizing: border-box;

  background-color: ${BACKGROUND};

  border-radius: ${BORDER_RADIUS}rem;
  box-shadow: 0 0 0 1px ${props => TYPE_TO_BORDER_COLOR[props.type]},
    inset 0 0 0 1px ${props => TYPE_TO_BORDER_COLOR[props.type]};

  animation: ${props => (props.isActive ? fadeIn : fadeOut)}
      ${TRANSITION_DURATION}s,
    ${props => (props.isActive ? moveIn : moveOut)} ${TRANSITION_DURATION}s;

  cursor: pointer;
`;
