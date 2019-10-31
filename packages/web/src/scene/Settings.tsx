import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { CheckBox } from "../component/CheckBox";
import { Form } from "../component/collection/form";
import { styled } from "../styling/theme";

@inject("views")
@observer
export class Settings extends SceneComponent<"Settings"> {
  public constructor(props: DefaultSceneComponentProps<"Settings">) {
    super("Settings", props);
  }

  public render() {
    return (
      <MediumForm>
        <CheckBox
          name="theme"
          value={this.props.views!.dark}
          label="Use dark theme"
          onChange={this.toggleDarkTheme}
        />
      </MediumForm>
    );
  }

  @action
  public toggleDarkTheme = () => {
    this.props.views!.dark = !this.props.views!.dark;
  };
}

const MediumForm = styled(Form)`
  margin: 0 auto;
  max-width: ${({ theme }) => theme.widthMedium};
`;
