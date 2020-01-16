import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Collection } from "../component/Collection";
import { TextField } from "../component/TextField";
import { TitleBar } from "../component/TitleBar";
import { Invitation } from "../model/Invitation";

/**
 * Invite scene component props.
 */
interface InviteProps {
  /**
   * Scene close callback function.
   */
  onClose: () => void;
}

/**
 * Invite scene component translation.
 */
interface InviteTranslation {
  /**
   * Loading text.
   */
  loading: string;

  /**
   * Title bar title text.
   */
  title: string;
}

/**
 * Invitation creation scene component.
 */
@inject("invitationStore", "viewStore")
@observer
export class Invite extends SceneComponent<
  "Invite",
  InviteProps,
  InviteTranslation
> {
  /**
   * Created invitation model.
   */
  @observable private invitation?: Invitation;

  /**
   * Creates a new instance of `Invite` and sets the name of this scene
   * component.
   */
  public constructor(
    props: DefaultSceneComponentProps<"Invite"> & InviteProps
  ) {
    super("Invite", props);

    this.createInvitation();
  }

  /**
   * Displays created invitation registration URL.
   */
  public render() {
    return (
      <>
        <TitleBar onClose={this.props.onClose} title={this.translation.title} />

        <Collection>
          <TextField
            name="url"
            readOnly={true}
            value={
              this.invitation === undefined
                ? this.translation.loading
                : `${window.location.origin}/register/${this.invitation.id}`
            }
          />
        </Collection>
      </>
    );
  }

  /**
   * Creates a new invitation for advisee of currently authenticated account.
   */
  private async createInvitation() {
    this.invitation = await this.props.invitationStore!.createForAdvisee();
  }
}
