import { inject, observer } from "mobx-react";
import * as React from "react";
import { Scene } from "./Scene";
import { Compact } from "../component/container/Compact";
import { Fluid } from "../component/container/Fluid";
import { Form, FormSubmitHandler } from "../component/Form";
import { FoodSaveBody } from "api";
import { setTimeout } from "../utility/promises";

/**
 * Renders a form used to create or edit existing food element.
 */
@inject("foods", "views")
@observer
export class FoodEdit extends Scene<"FoodEdit"> {
  /**
   * Waiting reason when submitting data to server.
   */
  private static WAIT_REASON = "foodEdit";

  /**
   * Renders food information form.
   */
  public render() {
    const Container = this.props.position === "main" ? Compact : Fluid;

    return (
      <Container>
        <Form name="foodInformation" onSubmit={this.handleSubmit} />
      </Container>
    );
  }

  private handleSubmit: FormSubmitHandler<"foodInformation"> = async values => {
    this.props.views!.wait(FoodEdit.WAIT_REASON);

    const [error] = await Promise.all([
      this.props.foods!.save((values as unknown) as FoodSaveBody), // Let backend handle the validation for now.
      setTimeout(1)
    ]);

    this.props.views!.done(FoodEdit.WAIT_REASON);

    return error;
  };
}
