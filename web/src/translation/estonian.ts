import { Translation } from ".";

export const estonian: Translation = {
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
  }
};
