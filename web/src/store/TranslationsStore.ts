import { Languages } from "api";
import { computed, observable } from "mobx";
import { Translation } from "../translation";
import { english } from "../translation/english";
import { estonian } from "../translation/estonian";
import { russian } from "../translation/russian";

/**
 * Object that stores each language's translation object.
 */
const TRANSLATIONS: Readonly<{ [Language in Languages]: Translation }> = {
  English: english,
  Estonian: estonian,
  Russian: russian
};

/**
 * Store responsible for storing and updating current interface language and
 * providing correct translation object based on this language.
 */
export class TranslationsStore {
  /**
   * Current interface language.
   */
  @observable private _language: Languages = "English";

  /**
   * Sets interface language.
   */
  public set language(language: Languages) {
    this._language = language;
  }

  /**
   * Returns translation object based on current interface language.
   */
  @computed
  public get translation() {
    return TRANSLATIONS[this._language];
  }
}

/**
 * The only `TranslationsStore` class instance and which is provided to all
 * components.
 */
export const translations = new TranslationsStore();
