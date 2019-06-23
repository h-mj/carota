import { Translation } from ".";

export const estonian: Translation = {
  alerts: {
    loginInvalidCredentials: {
      message: "Vale e-posti aadress või parool."
    }
  },
  errors: {
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
  inputs: {
    email: {
      placeholder: "Sisestage e-posti aadress",
      reasons: {
        conflict:
          "Sisestatud e-posti aadress on juba kasutuses teise konto poolt",
        empty: "Palun sisestage e-posti aadress",
        invalid: "Palun sisestage kehtiv e-posti aadress"
      }
    },
    language: {
      options: {
        English: "English",
        Estonian: "eesti",
        Russian: "русский"
      },
      placeholder: "Valige keel",
      reasons: { empty: "Palun valige keel" }
    },
    name: {
      placeholder: "Sisestage oma nimi",
      reasons: { empty: "Palun sisestage oma nimi" }
    },
    password: {
      placeholder: "Sisestage salasõna",
      reasons: {
        empty: "Palun sisestage salasõna",
        invalid: "Salasõna peab sisaldama vähemalt 8 tähemärki"
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
