import { inject, observer } from "mobx-react";
import * as React from "react";

import { TranslatedComponent } from "../base/TranslatedComponent";
import { Account } from "../model/Account";
import { Group } from "../model/Group";
import { styled } from "../styling/theme";
import { AdviseeList } from "./AdviseeList";

/**
 * Group view component props.
 */
interface GroupViewProps {
  /**
   * Advisee group model or a list of ungrouped accounts.
   */
  group: Group | Account[];
}

/**
 * Group view component translation.
 */
interface GroupViewTranslation {
  /**
   * Ungrouped advisee account group title.
   */
  ungrouped: string;
}

/**
 * Component that displays specified group.
 */
@inject("views")
@observer
export class GroupView extends TranslatedComponent<
  "GroupView",
  GroupViewProps,
  GroupViewTranslation
> {
  /**
   * Creates a new instance of `GroupView` and sets the name of this component.
   */
  public constructor(props: GroupViewProps) {
    super("GroupView", props);
  }

  /**
   * Renders the group view component alongside a list of advisees component.
   */
  public render() {
    const name = Array.isArray(this.props.group)
      ? this.translation.ungrouped
      : this.props.group.name;

    return (
      <Container>
        <Header>{name}</Header>
        <AdviseeList group={this.props.group} />
      </Container>
    );
  }
}

/**
 * Group information container component.
 */
const Container = styled.div`
  margin: ${({ theme }) => theme.padding};

  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.borderColor};

  overflow: hidden;
`;

/**
 * Group header component.
 */
const Header = styled.div`
  width: 100%;
  height: ${({ theme }) => theme.height};

  padding: 0 ${({ theme }) => theme.paddingSecondary};
  box-sizing: border-box;

  box-shadow: 0 1px 0 0 ${({ theme }) => theme.borderColor};

  display: flex;
  align-items: center;

  color: ${({ theme }) => theme.colorPrimary};
`;
