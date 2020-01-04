import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";

/**
 * Scene that is used by advisers to track and advise their advisees.
 */
export class Advisees extends SceneComponent<"Advisees"> {
  /**
   * Creates a new instance of `Advisees` and sets the name of this component.
   */
  public constructor(props: DefaultSceneComponentProps<"Advisees">) {
    super("Advisees", props);
  }

  /**
   * Renders the list of advisees and statistics of currently selected advisee.
   */
  public render() {
    return null;
  }
}
