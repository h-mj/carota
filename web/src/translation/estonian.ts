import { Translation } from ".";

export const estonian: Translation = {
  alerts: {
    signInInvalidCredentials: {
      message: "Vale e-posti aadress või parool."
    }
  },
  inputs: {
    email: {
      placeholder: "Sisestage e-posti aadress",
      reasons: { empty: "Palun sisestage e-posti aadress" }
    },
    password: {
      placeholder: "Sisestage salasõna",
      reasons: { empty: "Palun sisestage salasõna" }
    }
  },
  forms: {
    signIn: { submit: "Logige sisse", title: "Logige sisse" }
  },
  scenes: {
    home: { title: "Avaleht" },
    register: { title: "Looge konto" },
    signIn: { title: "Logige sisse" },
    unknown: { title: "Soovitud lehekülge ei leitud" }
  },
  title: "Morkovka"
};
