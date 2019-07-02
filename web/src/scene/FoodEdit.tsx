import * as React from "react";
import { Scene } from "./Scene";
import { Form } from "../component/Form";
import { Thin } from "../component/container/Thin";

export class FoodEdit extends Scene<"FoodEdit"> {
  public render() {
    return (
      <Thin>
        <Form name="foodInformation" />
      </Thin>
    );
  }
}
