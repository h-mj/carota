import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Calendar } from "../component/Calendar";
import { Table } from "../component/Table";
import { styled } from "../styling/theme";

/**
 * Diet scene that is used to add, edit and delete the consumed meals at given date.
 */
@observer
export class Diet extends SceneComponent<"Diet"> {
  /**
   * Current date which meals are currently shown.
   */
  @observable private date: Date = new Date();

  /**
   * Sets the name of this scene.
   */
  public constructor(props: DefaultSceneComponentProps<"Diet">) {
    super("Diet", props);
  }

  /**
   * Renders `Table` components for each meal of currently selected date and
   * calendar component on the side, which is used to change the date.
   */
  public render() {
    return (
      <Container>
        <Main>
          <Table />
          <Table />
          <Table />
          <Table />
          <Table />
        </Main>

        <Side>
          <Calendar value={this.date} onChange={this.handleChange} />
        </Side>
      </Container>
    );
  }

  @action
  private handleChange = (date: Date) => {
    this.date = date;
  };
}

/**
 * Wrapper component that contains all other components of this scene.
 */
const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  overflow: auto;
`;

/**
 * Component which wraps all `Table` components.
 */
const Main = styled.div`
  width: 100%;
  height: 100%;

  overflow-y: auto;

  & > *:not(:last-child) {
    border-bottom: solid 1px ${({ theme }) => theme.borderColor};
  }
`;

/**
 * Container which is positioned on the right and contains the calendar component.
 */
const Side = styled.div`
  max-width: ${({ theme }) => theme.formWidth};
  width: 100%;
  height: 100%;

  overflow: auto;

  border-left: solid 1px ${({ theme }) => theme.borderColor};
`;
