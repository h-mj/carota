import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";

/**
 * Scene component that is used to select an amount.
 */
export class Amount extends SceneComponent<"Amount"> {
  /**
   * Sets the name of the scene of this component.
   */
  public constructor(props: DefaultSceneComponentProps<"Amount">) {
    super("Amount", props);
  }

  /**
   * Renders amount selection form.
   */
  public render() {
    return "Amount";
  }
}
