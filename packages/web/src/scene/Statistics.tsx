import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";

/**
 * Scene component that displays statistics about consumed nutrition and body
 * measurements.
 */
export class Statistics extends SceneComponent<"Statistics"> {
  /**
   * Sets the name of this component.
   */
  public constructor(props: DefaultSceneComponentProps<"Statistics">) {
    super("Statistics", props);
  }

  /**
   * Renders various informational components.
   */
  public render() {
    return null;
  }
}
