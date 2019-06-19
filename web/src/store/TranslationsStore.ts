import { Language } from "api";
import { Translation } from "../translation";
import { english } from "../translation/english";
import { estonian } from "../translation/estonian";
import { russian } from "../translation/russian";
import { observable, computed } from "mobx";

/**
 * Object that stores each language's translation object.
 */
const TRANSLATIONS: { [L in Language]: Translation } = {
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
  @observable private language: Language = "English";

  /**
   * Returns translation object based on current interface language.
   */
  @computed
  public get translation() {
    return TRANSLATIONS[this.language];
  }
}

/**
 * The only `TranslationsStore` class instance.
 */
export const translations = new TranslationsStore();
