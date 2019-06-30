import { Translation } from ".";

export const estonian: Translation = {
  components: {
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
    NotificationContainer: {
      loginInvalidCredentials: {
        message: "Vale e-posti aadress või parool."
      }
    }
  },
  inputs: {
    barcode: {
      name: "Triipkood",
      placeholder: "Sisestage triipkood",
      reasons: {}
    },
    carbohydrate: {
      name: "Süsivesikud",
      placeholder: "Sisestage süsivesikute kogus",
      reasons: {}
    },
    email: {
      name: "E-posti aadress",
      placeholder: "Sisestage e-posti aadress",
      reasons: {
        conflict: "Sisestatud e-posti aadress on juba kasutuses",
        empty: "Palun sisestage e-posti aadress",
        invalid: "Palun sisestage kehtiv e-posti aadress"
      }
    },
    energy: {
      name: "Energiasisaldus",
      placeholder: "Sisestage energiasisaldus",
      reasons: {}
    },
    fat: {
      name: "Rasvad",
      placeholder: "Sisestage rasvade kogus",
      reasons: {}
    },
    fibre: {
      name: "Kiudained",
      placeholder: "Sisestage kiudainete kogus",
      reasons: {}
    },
    language: {
      name: "Keel",
      options: {
        English: "English",
        Estonian: "eesti",
        Russian: "русский"
      },
      placeholder: "Valige keel",
      reasons: {
        empty: "Palun valige keel"
      }
    },
    monoUnsaturates: {
      name: "Monoküllastumata rasvhapped",
      placeholder: "Sisestage monoküllastumata rasvhapete kogus",
      reasons: {}
    },
    name: {
      name: "Nimi",
      placeholder: "Sisestage nimi",
      reasons: {
        empty: "Palun sisestage nimi"
      }
    },
    password: {
      name: "Salasõna",
      placeholder: "Sisestage salasõna",
      reasons: {
        empty: "Palun sisestage salasõna",
        invalid: "Salasõna peab sisaldama vähemalt 8 tähemärki"
      }
    },
    polyols: {
      name: "Polüoolid",
      placeholder: "Sisestage polüoolide kogus",
      reasons: {}
    },
    polyunsaturates: {
      name: "Polüküllastumata rasvhapped",
      placeholder: "Sisestage polüküllastumata rasvhapete kogus",
      reasons: {}
    },
    protein: {
      name: "Valgud",
      placeholder: "Sisestage valkude kogus",
      reasons: {}
    },
    salt: {
      name: "Sool",
      placeholder: "Sisestage soola kogus",
      reasons: {}
    },
    saturates: {
      name: "Küllastunud rasvhapped",
      placeholder: "Sisestage küllastunud rasvhapete kogus",
      reasons: {}
    },
    starch: {
      name: "Tärklis",
      placeholder: "Sisestage tärklise kogus",
      reasons: {}
    },
    sugars: {
      name: "Suhkrud",
      placeholder: "Sisestage Suhkrute kogus",
      reasons: {}
    },
    unit: {
      name: "Ühik",
      options: {
        g: "g",
        ml: "ml"
      },
      placeholder: "Valige ühik",
      reasons: {}
    }
  },
  forms: {
    login: { submit: "Logige sisse", title: "Logige sisse" },
    register: { submit: "Looge konto", title: "Looge konto" }
  },
  scenes: {
    administration: { title: "Administratsioon" },
    diet: { title: "Dieet" },
    foodEditor: { title: "Muuda toiduaine" },
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
