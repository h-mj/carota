import { inject, observer } from "mobx-react";
import * as React from "react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Button } from "../component/Button";
import { Controls, Form } from "../component/collection/form";
import { TitleBar } from "../component/TitleBar";
import { styled } from "../styling/theme";

/**
 * Confirmation scene component props.
 */
interface ConfirmationProps {
  /**
   * Confirmation callback which will be called when user confirms or cancels the confirmation.
   */
  confirm: (confirmed: boolean) => void;

  /**
   * Confirmation message.
   */
  message: string;
}

/**
 * Confirmation scene component translation.
 */
interface ConfirmationTranslation {
  /**
   * Cancel translation.
   */
  cancel: string;

  /**
   * Confirm translation.
   */
  confirm: string;

  /**
   * Confirmation scene title translation.
   */
  title: string;
}

/**
 * Scene using which system can ask for user confirmation if the action is
 * potentially dangerous and irreversible.
 */
@inject("views")
@observer
export class Confirmation extends SceneComponent<
  "Confirmation",
  ConfirmationProps,
  ConfirmationTranslation
> {
  /**
   * Sets the name of this scene.
   */
  public constructor(
    props: DefaultSceneComponentProps<"Confirmation"> & ConfirmationProps
  ) {
    super("Confirmation", props);
  }

  /**
   * Renders the message and confirm and cancel buttons.
   */
  public render() {
    return (
      <>
        <TitleBar close={this.props.scene} title={this.translation.title} />

        <Form as="div">
          <Message>{this.props.message}</Message>

          <Controls>
            <Button onClick={this.cancel} secondary={true}>
              {this.translation.cancel}
            </Button>
            <Button onClick={this.confirm}>{this.translation.confirm}</Button>
          </Controls>
        </Form>
      </>
    );
  }

  /**
   * Cancels the confirmation.
   */
  private cancel = () => {
    this.props.confirm(false);
    this.props.views!.pop(this.props.scene);
  };

  /**
   * Confirms the confirmation.
   */
  private confirm = () => {
    this.props.confirm(true);
    this.props.views!.pop(this.props.scene);
  };
}

/**
 * Confirmation message container.
 */
const Message = styled.div`
  color: ${({ theme }) => theme.colorPrimary};
  text-align: center;
`;
