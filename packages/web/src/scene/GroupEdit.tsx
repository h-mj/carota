import { deviate } from "deviator";
import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Button } from "../component/Button";
import { Controls, Form } from "../component/collection/form";
import { TextField } from "../component/TextField";
import { TitleBar } from "../component/TitleBar";
import { Group } from "../model/Group";
import { reasonAt } from "../utility/form";

/**
 * Validates group name value.
 */
const nameValidator = deviate<string>()
  .trim()
  .nonempty();

/**
 * Group edit scene component props.
 */
interface GroupEditProps {
  /**
   * Group that is currently being edited.
   */
  group?: Group;

  /**
   * Scene close callback.
   */
  onClose: () => void;
}

/**
 * Group edit scene component translation.
 */
interface GroupEditTranslation {
  /**
   * Submit button text if new group is being created.
   */
  createSubmit: string;

  /**
   * Scene title bar text if new group is being created.
   */
  createTitle: string;

  /**
   * Delete button text.
   */
  delete: string;

  /**
   * Submit button text if existing group is being edited.
   */
  editSubmit: string;

  /**
   * Scene title bar text if existing group is being edited.
   */
  editTitle: string;

  /**
   * Group name text field label text.
   */
  label: string;

  /**
   * Error reason translations.
   */
  reasons: Record<string, string>;
}

/**
 * Group creation and editing scene component.
 */
@inject("groupStore", "viewStore")
@observer
export class GroupEdit extends SceneComponent<
  "GroupEdit",
  GroupEditProps,
  GroupEditTranslation
> {
  /**
   * Name input field value.
   */
  @observable private name = this.props.group?.name ?? "";

  /**
   * Name field validation error reason. If it is `undefined`, there's currently
   * no error.
   */
  @observable private reason?: string;

  /**
   * Whether group creation or renaming request has been submitted.
   */
  private submitting = false;

  /**
   * Creates a new instance of `GroupEdit` and sets the name of this component.
   */
  public constructor(
    props: DefaultSceneComponentProps<"GroupEdit"> & GroupEditProps
  ) {
    super("GroupEdit", props);
  }

  /**
   * Renders group editing form.
   */
  public render() {
    return (
      <>
        <TitleBar
          onClose={this.props.onClose}
          title={
            this.props.group === undefined
              ? this.translation.createTitle
              : this.translation.editTitle
          }
        />

        <Form noValidate={true} onSubmit={this.handleSubmit}>
          <TextField
            autoFocus={true}
            errorMessage={this.reason}
            invalid={this.reason !== undefined}
            label={this.translation.label}
            name="name"
            onChange={this.handleChange}
            value={this.name}
          />

          <Controls>
            {this.props.group !== undefined &&
              this.props.group.accounts.length === 0 && (
                <Button
                  invalid={this.reason !== undefined}
                  onClick={this.handleDeletion}
                  secondary={true}
                  type="button"
                >
                  {this.translation.delete}
                </Button>
              )}
            <Button invalid={this.reason !== undefined}>
              {this.props.group === undefined
                ? this.translation.createSubmit
                : this.translation.editSubmit}
            </Button>
          </Controls>
        </Form>
      </>
    );
  }

  /**
   * Updates group name field value on its change.
   */
  private handleChange = (name: "name", value: string) => {
    this[name] = value;
  };

  /**
   * Prevents default form submission event either changes provided group name
   * or creates a new group with entered name.
   */
  private handleSubmit: React.FormEventHandler<
    HTMLFormElement
  > = async event => {
    event.preventDefault();

    if (this.submitting) {
      return;
    }

    this.submitting = true;

    const result = nameValidator(this.name);

    if (result.ok) {
      const error =
        this.props.group === undefined
          ? await this.props.groupStore!.create(this.name)
          : await this.props.group.rename(this.name);

      if (error === undefined) {
        this.props.onClose();
        return;
      }

      this.reason = reasonAt(error, "name");
    } else {
      this.reason = result.value;
    }

    this.submitting = false;
  };

  /**
   * Handles delete button click mouse event.
   */
  private handleDeletion = async () => {
    if (
      this.props.group === undefined ||
      this.props.group.accounts.length > 0
    ) {
      return;
    }

    if (this.submitting) {
      return;
    }

    this.submitting = true;

    await this.props.group.delete();
    this.props.onClose();

    this.submitting = false;
  };
}
