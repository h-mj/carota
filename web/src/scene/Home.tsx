import { DefaultSceneProps, Scene } from "./Scene";

export class Home extends Scene<"Home"> {
  public constructor(props: DefaultSceneProps<"Home">) {
    super("Home", props);
  }

  public render() {
    return null;
  }
}
