import * as React from "react";
import { Scene } from "./Scene";
import { Form } from "../component/Form";
import { Thin } from "../component/container/Thin";

export class FoodInformation extends Scene<"FoodInformation"> {
  public render() {
    return (
      <Thin>
        <Form name="foodInformation" />
      </Thin>
    );
  }
}
