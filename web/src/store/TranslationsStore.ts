import { Language } from "api";
import { Translation } from "../translation";
import { english } from "../translation/english";
import { estonian } from "../translation/estonian";
import { russian } from "../translation/russian";
import { observable, computed } from "mobx";

const TRANSLATIONS: { [L in Language]: Translation } = {
  English: english,
  Estonian: estonian,
  Russian: russian
};

export class TranslationsStore {
  @observable private language: Language = "English";

  @computed
  public get translation() {
    return TRANSLATIONS[this.language];
  }
}
