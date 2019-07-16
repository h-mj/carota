import { FoodSaveBody } from "api";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { SceneContext } from "./SceneContext";
import { DefaultSceneProps, Scene } from "./Scene";
import { Compact } from "../component/container/Compact";
import { Fluid } from "../component/container/Fluid";
import { Form, FormSubmitHandler, FormValues } from "../component/Form";
import { Food } from "../model/Food";

/**
 * Food editing scene props.
 */
interface FoodEditProps {
  /**
   * Food model instance.
   */
  food?: Food;
}

/**
 * Renders a form used to create or edit existing food element.
 */
@inject("foods", "views")
@observer
export class FoodEdit extends Scene<"FoodEdit", FoodEditProps> {
  /**
   * Initial food information form values.
   */
  private values?: FormValues<"foodInformation">;

  /**
   * Creates a new instance of FoodEdit and creates initial form valuer object
   * based on `food` prop, if provided.
   */
  public constructor(props: FoodEditProps & DefaultSceneProps<"FoodEdit">) {
    super(props);

    const { food } = this.props;

    if (food === undefined) {
      return;
    }

    const { name, barcode, unit } = food;

    type Nutrient = keyof typeof food.nutritionDeclaration;

    const nutritionDeclaration: Partial<
      Record<Nutrient, string | undefined>
    > = {};

    for (const nutrient in food.nutritionDeclaration) {
      const value = food.nutritionDeclaration[nutrient as Nutrient];

      nutritionDeclaration[nutrient as Nutrient] =
        value === undefined ? undefined : value.toString();
    }

    this.values = {
      name,
      barcode: barcode || "",
      unit,
      nutritionDeclaration
    };
  }

  /**
   * Renders food information form.
   */
  public render() {
    const Container = this.props.position === "main" ? Compact : Fluid;

    return (
      <Container>
        <Form
          name="foodInformation"
          onSubmit={this.handleSubmit}
          values={this.values}
        />
      </Container>
    );
  }

  private handleSubmit: FormSubmitHandler<"foodInformation"> = async values => {
    const { food, foods, position, views } = this.props;

    const body = {
      id: food !== undefined ? food.id : undefined,
      ...values
    };

    const error = await views!.load(
      foods!.save((body as unknown) as FoodSaveBody) // Let backend handle the validation for now
    );

    if (error === undefined) {
      if (position === "main") {
        views!.redirect(new SceneContext("FoodSearch", {}, {}));
      } else {
        views!.refocus();
      }
    }

    return error;
  };
}
