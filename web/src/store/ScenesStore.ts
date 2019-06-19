import { observable } from "mobx";
import { Scene } from "../scene";

export class ScenesStore {
  @observable public main: Scene = "signIn";
}
