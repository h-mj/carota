import * as React from "react";
import { Scene } from "./Scene";
import { Compact } from "../component/container/Compact";
import { Form } from "../component/Form";
import { Fluid } from "../component/container/Fluid";

/**
 * Renders a form used to create or edit existing food element.
 */
export class FoodEdit extends Scene<"FoodEdit"> {
  /**
   * Renders food information form.
   */
  public render() {
    const Container = this.props.position === "main" ? Compact : Fluid;

    return (
      <Container>
        <Form name="foodInformation" />
      </Container>
    );
  }
}
