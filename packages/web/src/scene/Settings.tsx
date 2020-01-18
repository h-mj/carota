import { action } from "mobx";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Language } from "server";

import { SceneComponent, SceneComponentProps } from "../base/SceneComponent";
import { CheckBox } from "../component/CheckBox";
import { Form } from "../component/collection/form";
import { Group } from "../component/Group";
import { Head } from "../component/Head";
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
   * Settings page title.
   */
  title: string;

  /**
   * Dark theme toggle checkbox label translation.
   */
  useDarkTheme: string;
}

/**
 * Setting scene component that is used to manage account and application
 * settings.
 */
@inject("accountStore", "viewStore")
@observer
export class Settings extends SceneComponent<
  "Settings",
  {},
  SettingsTranslation
> {
  /**
   * Sets the name of this scene component.
   */
  public constructor(props: SceneComponentProps<"Settings">) {
    super("Settings", props);
  }

  /**
   * Renders setting options.
   */
  public render() {
    return (
      <MediumForm>
        <Head title={this.translation.title} />

        <Group>
          <CheckBox
            name="theme"
            value={this.props.viewStore!.dark}
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
            value={this.props.viewStore!.language}
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
    this.props.viewStore!.dark = !this.props.viewStore!.dark;
  };

  /**
   * Select current language.
   */
  @action
  public selectLanguage = (_: "language", language?: Language) => {
    if (language === undefined) {
      return;
    }

    this.props.accountStore!.setLanguage(language);
  };
}

/**
 * Form component with medium width.
 */
const MediumForm = styled(Form)`
  margin: 0 auto;
  max-width: ${({ theme }) => theme.widthMedium};
`;
