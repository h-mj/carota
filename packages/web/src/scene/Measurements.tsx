import * as React from "react";
import { Quantity } from "server";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { Collection } from "../component/Collection";
import { MeasurementsChart } from "../component/MeasurementsChart";
import { TitleBar } from "../component/TitleBar";

/**
 * Measurements scene component props.
 */
interface MeasurementsProps {
  /**
   * Function that closes this scene.
   */
  close: () => void;

  /**
   * Quantity which measurements are displayed.
   */
  quantity: Quantity;
}

/**
 * Displays all measurements of some body quantity.
 */
export class Measurements extends SceneComponent<
  "Measurements",
  MeasurementsProps
> {
  /**
   * Creates a new instance of `Measurements` and sets the name of this scene
   * component.
   */
  public constructor(
    props: MeasurementsProps & DefaultSceneComponentProps<"Measurements">
  ) {
    super("Measurements", props);
  }

  /**
   * Renders measurements of provided body quantity.
   */
  public render() {
    return (
      <>
        <TitleBar
          onClose={this.props.close}
          title="Previous bicep measurements"
        />

        <Collection>
          <MeasurementsChart quantity={this.props.quantity} />
        </Collection>
      </>
    );
  }
}
