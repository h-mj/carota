import * as React from "react";
import { Scene } from "./Scene";
import { Compact } from "../component/container/Compact";
import { Form } from "../component/Form";

/**
 * Renders a form used to create or edit existing food element.
 */
export class FoodEdit extends Scene<"FoodEdit"> {
  /**
   * Renders food information form.
   */
  public render() {
    const form = <Form name="foodInformation" />;

    if (this.props.position === "main") {
      return <Compact>{form}</Compact>;
    }

    return form;
  }
}
