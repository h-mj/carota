import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { DURATION, fadeIn, fadeOut } from "../styling/animations";
import { RESET } from "../styling/stylesheets";
import { keyframes, styled } from "../styling/theme";

/**
 * Union of notification types.
 */
export type NotificationType = "success" | "error";

/**
 * Notification object type.
 */
export interface Notification {
  /**
   * Unique notification identifier.
   */
  id: string;

  /**
   * Notification text.
   */
  text: string;

  /**
   * Notification type.
   */
  type: NotificationType;
}

/**
 * Component that renders active notifications.
 */
@inject("views")
@observer
export class Notifications extends Component {
  /**
   * Array of visible notifications that include all active notifications as
   * well as notifications that are fading out.
   */
  @observable private visibleNotifications: Notification[] = [];

  /**
   * Update visible notifications if new notification was added and fade out
   * notifications that are no longer active.
   */
  public componentDidUpdate() {
    const { notifications } = this.props.views!;

    // Add new active notifications to visible notifications.
    for (const notification of notifications) {
      if (!this.visibleNotifications.includes(notification)) {
        this.visibleNotifications.push(notification);
      }
    }

    // Fade out inactive notifications.
    for (const notification of this.visibleNotifications) {
      if (!notifications.includes(notification)) {
        this.fadeNotification(notification);
      }
    }
  }

  /**
   * Renders all notifications.
   */
  public render() {
    if (
      this.props.views!.notifications.length === 0 &&
      this.visibleNotifications.length === 0
    ) {
      return null;
    }

    return (
      <Container>
        {this.visibleNotifications.map(notification => (
          <NotificationContainer
            active={this.props.views!.notifications.includes(notification)}
            key={notification.id}
            notificationType={notification.type}
            onClick={() => this.props.views!.conceal(notification)}
            value={notification.id}
          >
            {notification.text}
          </NotificationContainer>
        ))}
      </Container>
    );
  }

  /**
   * Removes a notification from visible notifications after a timeout.
   */
  private async fadeNotification(notification: Notification) {
    await this.props.views!.wait(DURATION);

    const index = this.visibleNotifications.indexOf(notification);

    if (index === -1) {
      return;
    }

    this.visibleNotifications.splice(index, 1);
  }
}

/**
 * Container component that contains all notifications.
 */
const Container = styled.div`
  position: fixed;

  top: ${({ theme }) => theme.padding};
  left: ${({ theme }) => theme.padding};
  right: ${({ theme }) => theme.padding};
`;

/**
 * Notification move in animation keyframes.
 */
const moveIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

/**
 * Notification move out animation keyframes.
 */
const moveOut = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
`;

/**
 * Notification container props.
 */
interface NotificationContainerProps {
  /**
   * Whether or not animation is active.
   */
  active: boolean;

  /**
   * Notification type.
   */
  notificationType: NotificationType;
}

/**
 * Container element that represents a notification.
 */
const NotificationContainer = styled.button<NotificationContainerProps>`
  ${RESET};

  display: block;

  margin-top: ${({ theme }) => theme.paddingSecondary};
  padding: calc(
      (${({ theme }) => theme.height} - ${({ theme }) => theme.lineHeight}) / 2 -
        1px
    )
    ${({ theme }) => theme.paddingSecondary};

  border: solid 1px
    ${({ notificationType, theme }) =>
      notificationType === "error" ? theme.red : theme.green};
  box-shadow: ${({ notificationType, theme }) =>
    notificationType === "error"
      ? `inset 0 0 0 1px ${theme.red}`
      : `inset 0 0 0 1px ${theme.orange}`};

  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.backgroundColor};

  color: ${({ theme }) => theme.primaryColor};
  line-height: ${({ theme }) => theme.lineHeight};

  animation: ${({ active }) => (active ? fadeIn : fadeOut)} ${DURATION}s,
    ${({ active }) => (active ? moveIn : moveOut)} ${DURATION}s;

  cursor: pointer;
`;
