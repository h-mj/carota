import * as React from "react";
import { Scene } from "./Scene";
import { Form } from "../component/Form";
import { Thin } from "../component/container/Thin";

export class FoodEditor extends Scene<"foodEditor"> {
  public render() {
    return (
      <Thin>
        <Form name="nutritionInformation" tabular={true} />
      </Thin>
    );
  }
}
