import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Language } from "server";

import {
  DefaultSceneComponentProps,
  SceneComponent
} from "../base/SceneComponent";
import { CheckBox } from "../component/CheckBox";
import { Form } from "../component/collection/form";
import { Group } from "../component/Group";
import { Select } from "../component/Select";
import { styled } from "../styling/theme";

/**
 * List of available languages.
 */
const LANGUAGES = ["English", "Estonian", "Russian"] as const;

/**
 * Setting scene component translation.
 */
interface SettingsTranslation {
  /**
   * Language select label translation.
   */
  language: string;

  /**
   * Language name translations.
   */
  languages: Record<typeof LANGUAGES[number], string>;

  /**
   * Dark theme toggle checkbox label translation.
   */
  useDarkTheme: string;
}

/**
 * Setting scene component that is used to manage account and application
 * settings.
 */
@inject("accounts", "views")
@observer
export class Settings extends SceneComponent<
  "Settings",
  {},
  SettingsTranslation
> {
  /**
   * Sets the name of this scene component.
   */
  public constructor(props: DefaultSceneComponentProps<"Settings">) {
    super("Settings", props);
  }

  /**
   * Renders setting options.
   */
  public render() {
    return (
      <MediumForm>
        <Group>
          <CheckBox
            name="theme"
            value={this.props.views!.dark}
            label={this.translation.useDarkTheme}
            onChange={this.toggleDarkTheme}
          />

          <Select
            label={this.translation.language}
            name="language"
            onChange={this.selectLanguage}
            options={LANGUAGES.map(language => ({
              label: this.translation.languages[language],
              value: language
            }))}
            value={this.props.views!.language}
          />
        </Group>
      </MediumForm>
    );
  }

  /**
   * Toggles whether the dark theme should be used.
   */
  @action
  public toggleDarkTheme = () => {
    this.props.views!.dark = !this.props.views!.dark;
  };

  /**
   * Select current language.
   */
  @action
  public selectLanguage = (_: "language", language?: Language) => {
    if (language === undefined) {
      return;
    }

    this.props.accounts!.setLanguage(language);
  };
}

/**
 * Form component with medium width.
 */
const MediumForm = styled(Form)`
  margin: 0 auto;
  max-width: ${({ theme }) => theme.widthMedium};
`;
