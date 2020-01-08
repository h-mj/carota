import { observer } from "mobx-react";
import * as React from "react";

import { Component } from "../base/Component";
import { Account } from "../model/Account";
import { Group } from "../model/Group";
import { GroupView } from "./GroupView";

/**
 * Group list component props.
 */
interface GroupListProps {
  /**
   * List of advisee groups.
   */
  groupList: Group[];

  /**
   * List of ungrouped advisee accounts.
   */
  ungrouped: Account[];
}

/**
 * Component that displays a list of groups.
 */
@observer
export class GroupList extends Component<GroupListProps> {
  /**
   * Renders all provided ungrouped advisee accounts alongside all advisee
   * groups.
   */
  public render() {
    return (
      <>
        {this.props.ungrouped.length > 0 && (
          <GroupView group={this.props.ungrouped} />
        )}

        {this.props.groupList.map(group => (
          <GroupView key={group.id} group={group} />
        ))}
      </>
    );
  }
}
