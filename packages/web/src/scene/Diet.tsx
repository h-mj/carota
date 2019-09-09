import { action, observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Calendar } from "../component/Calendar";

@observer
export class Diet extends SceneComponent<"Diet"> {
  @observable private date: Date = new Date();

  public constructor(props: DefaultSceneComponentProps<"Diet">) {
    super("Diet", props);
  }

  public render() {
    return <Calendar value={this.date} onChange={this.handleChange} />;
  }

  @action
  private handleChange = (date: Date) => {
    this.date = date;
  };
}
