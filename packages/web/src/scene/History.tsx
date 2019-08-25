import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";

export class History extends SceneComponent<"History"> {
  public constructor(props: DefaultSceneComponentProps<"History">) {
    super("History", props);
  }

  public render() {
    return null;
  }
}
