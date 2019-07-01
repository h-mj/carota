import { Translation } from ".";

export const estonian: Translation = {
  components: {
    DeclareNutrition: {
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
      title: "Toitumisalane teave",
      units: {
        g: "g",
        kcal: "kcal"
      }
    },
    Error: {
      invalidInvitation: {
        title:
          "Vabandame, selle konto loomise lehekülje internetiaadress on kehtetu.",
        message:
          "Selle internetiaadressi abil on konto juba loodud või on tegemist vale aadressiga. Kui te pole kontot selle aadressiga loonud, palun võtke ühendust teid kutsunud isikuga."
      },
      unknown: {
        title: "Vabandame, soovitud lehekülge ei leitud.",
        message: "404"
      }
    },
    Input: {
      barcode: {
        placeholder: "Sisestage triipkood",
        reasons: {
          empty: "Palun sisestage triipkood"
        }
      },
      email: {
        placeholder: "Sisestage e-posti aadress",
        reasons: {
          conflict: "Sisestatud e-posti aadress on juba kasutuses",
          empty: "Palun sisestage e-posti aadress",
          invalid: "Palun sisestage kehtiv e-posti aadress"
        }
      },
      language: {
        label: "Valige keel",
        options: {
          English: "English",
          Estonian: "eesti",
          Russian: "русский"
        },
        reasons: {
          empty: "Palun valige keel"
        }
      },
      name: {
        placeholder: "Sisestage nimi",
        reasons: {
          empty: "Palun sisestage nimi"
        }
      },
      password: {
        placeholder: "Sisestage salasõna",
        reasons: {
          empty: "Palun sisestage salasõna",
          invalid: "Salasõna peab sisaldama vähemalt 8 tähemärki"
        }
      },
      unit: {
        label: "Valige ühik",
        options: {
          g: "g",
          ml: "ml"
        },
        reasons: {
          empty: "Palun valige ühik"
        }
      }
    },
    NotificationContainer: {
      loginInvalidCredentials: {
        message: "Vale e-posti aadress või parool."
      }
    }
  },
  forms: {
    login: { submit: "Logige sisse", title: "Logige sisse" },
    register: { submit: "Looge konto", title: "Looge konto" }
  },
  scenes: {
    administration: { title: "Administratsioon" },
    diet: { title: "Dieet" },
    history: { title: "Ajalugu" },
    home: { title: "Avaleht" },
    login: { title: "Logige sisse" },
    logout: { title: "Logige välja" },
    measurements: { title: "Mõõdud" },
    register: { title: "Looge konto" },
    settings: { title: "Seaded" },
    unknown: { title: "Vabandame, soovitud lehekülge ei leitud" }
  },
  title: "Morkovka"
};
