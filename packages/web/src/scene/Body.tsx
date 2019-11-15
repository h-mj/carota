import { inject, observer } from "mobx-react";
import * as React from "react";
import { Quantity } from "server";

import { Scenes } from "../base/Scene";
import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Silhouette } from "../component/Silhouette";
import { styled } from "../styling/theme";

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
  }

  /**
   * Renders the body silhouette and measurement managing controls.
   */
  public render() {
    return (
      <Container>
        <Silhouette
          onAddClick={this.showMeasure}
          onMeasurementsClick={this.showMeasure}
        />
      </Container>
    );
  }

  /**
   * Shows `Measure` scene when user clicks on any measurement line on the
   * silhouette.
   */
  private showMeasure = (quantity: Quantity) => {
    this.scene = this.props.views!.push("center", "Measure", {
      close: this.close,
      quantity
    });
  };

  /**
   * Closes pushed scene.
   */
  private close = () => {
    this.props.views!.pop(this.scene!);
  };
}

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;
