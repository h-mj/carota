import { Translation } from "./";

export const estonian: Translation = {
  components: {
    Calendar: {
      days: ["E", "T", "K", "N", "R", "L", "P"],
      months: [
        "Jaanuar",
        "Veebruar",
        "Märts",
        "Aprill",
        "Mai",
        "Juuni",
        "Juuli",
        "August",
        "September",
        "Oktoober",
        "November",
        "Detsember"
      ]
    },
    Confirmation: {
      cancel: "Tühista",
      confirm: "Kinnita",
      title: "Kinnitus"
    },
    Edit: {
      addTitle: "Lisa toiduaine",
      confirm: "Kas olete kindel, et soovite selle toiduaine ära kustutada?",
      delete: "Kustutage",
      editTitle: "Redigeeri toiduainet",
      inputs: {
        barcode: {
          label: "Triipkood",
          reasons: {
            empty: "Palun sisestage toiduaine triipkood."
          }
        },
        name: {
          label: "Nimetus",
          reasons: {
            empty: "Palun sisestage toiduaine nimetus."
          }
        },
        pieceQuantity: {
          label: "Ühe tüki kogus",
          reasons: {
            empty: "Palun sisestage ühe tüki kogus.",
            lessThanOrEquals:
              "Palun sisestage ühe tüki kogus mis on suurem kui 0.",
            NaN: "Palun sisestage korrektne ühe tüki kogus."
          }
        },
        quantity: {
          label: "Kogus",
          reasons: {
            empty: "Palun sisestage toiduaine kogus.",
            lessThanOrEquals:
              "Palun sisestage toiduaine kogus mis on suurem kui 0.",
            NaN: "Palun sisestage korrektne toiduaine kogus."
          }
        },
        unit: {
          label: "Ühik",
          reasons: {
            undefined: "Palun valige ühik."
          }
        }
      },
      nutrients: {
        carbohydrate: "Süsivesikud",
        energy: "Energiasisaldus",
        fat: "Rasvad",
        fibre: "Kiudained",
        monoUnsaturates: "Monoküllastumata rasvhapped",
        polyols: "Polüoolid",
        polyunsaturates: "Polüküllastumata rasvhapped",
        protein: "Valgud",
        salt: "Sool",
        saturates: "Küllastunud rasvhapped",
        starch: "Tärklis",
        sugars: "Suhkrud"
      },
      submit: "Salvesta"
    },
    Foodstuff: {
      per: "100{unit} kohta:"
    },
    Head: {
      title: "Morkovka"
    },
    Login: {
      inputs: {
        email: {
          label: "E-post",
          reasons: {
            empty: "Palun sisestage e-posti aadress."
          }
        },
        password: {
          label: "Parool",
          reasons: {
            empty: "Palun sisestage salasõna."
          }
        }
      },
      invalidCredentials: "Vale e-posti aadress või parool.",
      submit: "Sisenege →",
      title: "Sisenege"
    },
    Quantity: {
      g: "grammides",
      ml: "milliliitrites",
      quantity: {
        helper: "Palun sisestage toiduaine kogus:",
        label: "Kogus",
        reasons: {
          empty: "Palun sisestage toiduaine kogus.",
          lessThanOrEquals: "Palun sistestage kogus mis on suurem kui 0.",
          NaN: "Palun sistestage korrektne kogus."
        }
      },
      select: "Valige",
      unit: {
        helper: "Kas toiduaine kogus on {ühik} või tükkides?",
        label: "Ühik",
        reasons: {
          undefined: "Palun valige toiduaine ühik."
        }
      }
    },
    Register: {
      inputs: {
        email: {
          label: "E-post",
          reasons: {
            conflict: "Sisestatud e-posti aadress on juba kasutuses.",
            empty: "Palun sisestage e-posti aadress.",
            notEmail: "Palun sisestage kehtiv e-posti aadress."
          }
        },
        language: {
          label: "Keel",
          options: {
            English: "English",
            Estonian: "eesti",
            Russian: "русский"
          },
          reasons: {
            undefined: "Palun valige keel."
          }
        },
        name: {
          label: "Nimi",
          reasons: {
            empty: "Palun sisestage nimi."
          }
        },
        password: {
          label: "Parool",
          reasons: {
            empty: "Palun sisestage salasõna.",
            lessThan: "Salasõna peab sisaldama vähemalt 8 tähemärki."
          }
        }
      },
      submit: "Looge konto →",
      title: "Looge konto"
    },
    Tabs: {
      abbreviations: [
        "jaan",
        "veebr",
        "märts",
        "apr",
        "mai",
        "juuni",
        "juuli",
        "aug",
        "sept",
        "okt",
        "nov",
        "dets"
      ]
    },
    Unknown: {
      message: "Teie otsitavat lehte ei leitud."
    }
  },
  units: {
    g: "g",
    kcal: "kcal",
    ml: "ml",
    pcs: "tk"
  }
};
