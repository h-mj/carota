import { observable } from "mobx";
import { inject, observer } from "mobx-react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Account } from "../model/Account";

/**
 * Scene that is used by advisers to track and advise their advisees.
 */
@inject("accounts", "groups", "views")
@observer
export class Advisees extends SceneComponent<"Advisees"> {
  /**
   * Array of loaded advisee accounts of current account.
   */
  @observable private advisees: Account[] = [];

  /**
   * Creates a new instance of `Advisees` and sets the name of this component.
   */
  public constructor(props: DefaultSceneComponentProps<"Advisees">) {
    super("Advisees", props);

    if (this.props.accounts!.current!.type !== "Adviser") {
      this.props.views!.unknown(); // Show 404 if account is not an adviser.
      return;
    }

    this.loadAdvisees();
  }

  /**
   * Renders the list of advisees and statistics of currently selected advisee.
   */
  public render() {
    return this.advisees.map(account => account.name);
  }

  /**
   * Loads advisees of current account.
   */
  private async loadAdvisees() {
    const { ungrouped, groups } = await this.props.groups!.get(
      this.props.accounts!.current!
    );

    return ([] as Account[]).concat(
      ungrouped,
      groups.map(group => group.accounts).flat()
    );
  }
}
