import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";

/**
 * Scene component that is used to select a quantity of some food item.
 */
export class Quantity extends SceneComponent<"Quantity"> {
  /**
   * Sets the name of the scene of this component.
   */
  public constructor(props: DefaultSceneComponentProps<"Quantity">) {
    super("Quantity", props);
  }

  /**
   * Renders quantity selection form.
   */
  public render() {
    return "Quantity";
  }
}
