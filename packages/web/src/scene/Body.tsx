import { inject, observer } from "mobx-react";
import * as React from "react";
import { Quantity } from "server";

import { Scenes } from "../base/Scene";
import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Button } from "../component/Button";
import { Collection } from "../component/Collection";
import { EditButton } from "../component/EditButton";

/**
 * Array of all measurable body quantities.
 */
const QUANTITIES: Quantity[] = [
  "Bicep",
  "Calf",
  "Chest",
  "Height",
  "Hip",
  "Shin",
  "Thigh",
  "Waist",
  "Weight",
  "Wrist"
];

/**
 * Displays body silhouette with body measurements.
 */
@inject("views")
@observer
export class Body extends SceneComponent<"Body"> {
  /**
   * Pushed `Measure` or `Measurements` scene reference.
   */
  private scene?: Scenes;

  /**
   * Creates a new instance of `Body` and sets the name of this scene component.
   */
  public constructor(props: DefaultSceneComponentProps<"Body">) {
    super("Body", props);

    console.log(this.scene);
  }

  /**
   * Renders the body silhouette and measurement managing controls.
   */
  public render() {
    return (
      <Collection>
        {QUANTITIES.map(quantity => (
          <React.Fragment key={quantity}>
            <Button onClick={this.showMeasure}>{quantity}</Button>
            <EditButton onClick={this.showMeasurements} />
          </React.Fragment>
        ))}
      </Collection>
    );
  }

  private showMeasure = () => {
    this.scene = this.props.views!.push("center", "Measure", {
      close: this.close,
      quantity: "Bicep"
    });
  };

  private showMeasurements = () => {
    this.scene = this.props.views!.push("left", "Measurements", {
      close: this.close,
      quantity: "Bicep"
    });
  };

  private close = () => {
    this.props.views!.pop(this.scene!);
  };
}
