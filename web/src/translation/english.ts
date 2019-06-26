import { Translation } from ".";

export const english: Translation = {
  errors: {
    invalidInvitation: {
      title: "We are sorry, this sign up address is invalid.",
      message:
        "An account has already been created using this sign up address or the address is invalid. If you haven't already created an account using this web address, please contact the person who invited you."
    },
    unknown: {
      title: "We are sorry, the page you requested has not been found.",
      message:
        "The web address may be misspelled or the page you're looking for is no longer available."
    }
  },
  inputs: {
    barcode: { name: "Barcode", placeholder: "Enter a barcode", reasons: {} },
    carbohydrate: {
      name: "Carbohydrate",
      placeholder: "Enter an amount of carbohydrate",
      reasons: {}
    },
    email: {
      name: "Email address",
      placeholder: "Enter an email address",
      reasons: {
        conflict: "Entered email address is already in use",
        empty: "Please enter an email address",
        invalid: "Please enter a valid email address"
      }
    },
    energy: {
      name: "Energy",
      placeholder: "Enter an amount of energy",
      reasons: {}
    },
    fat: {
      name: "Fat",
      placeholder: "Enter an amount of fat",
      reasons: {}
    },
    fibre: {
      name: "Fibre",
      placeholder: "Enter an amount of fibre",
      reasons: {}
    },
    language: {
      name: "Language",
      options: {
        English: "English",
        Estonian: "eesti",
        Russian: "русский"
      },
      placeholder: "Select a language",
      reasons: {
        empty: "Please select a language"
      }
    },
    monoUnsaturates: {
      name: "Mono-unsaturates",
      placeholder: "Enter an amount of mono-unsaturates",
      reasons: {}
    },
    name: {
      name: "Name",
      placeholder: "Enter a name",
      reasons: {
        empty: "Please enter a name"
      }
    },
    password: {
      name: "Password",
      placeholder: "Enter a password",
      reasons: {
        empty: "Please enter a password",
        invalid: "Password must be at least 8 characters long"
      }
    },
    polyols: {
      name: "Polyols",
      placeholder: "Enter an amount of polyols",
      reasons: {}
    },
    polyunsaturates: {
      name: "Polyunsaturates",
      placeholder: "Enter an amount of polyunsaturates",
      reasons: {}
    },
    protein: {
      name: "Protein",
      placeholder: "Enter an amount of protein",
      reasons: {}
    },
    salt: {
      name: "Salt",
      placeholder: "Enter an amount of salt",
      reasons: {}
    },
    saturates: {
      name: "Saturates",
      placeholder: "Enter an amount of saturates",
      reasons: {}
    },
    starch: {
      name: "Starch",
      placeholder: "Enter an amount of starch",
      reasons: {}
    },
    sugars: {
      name: "Sugars",
      placeholder: "Enter an amount of sugars",
      reasons: {}
    },
    unit: {
      name: "Unit",
      options: {
        g: "g",
        ml: "ml"
      },
      placeholder: "Select a unit",
      reasons: {}
    }
  },
  forms: {
    login: { submit: "Sign in", title: "Sign in" },
    nutritionInformation: { submit: "Save", title: "Nutrition information" },
    register: { submit: "Sign up", title: "Sign up" }
  },
  notifications: {
    loginInvalidCredentials: {
      message: "Incorrect email address or password."
    }
  },
  scenes: {
    administration: { title: "Administration" },
    diet: { title: "Diet" },
    foodEditor: { title: "Edit food" },
    history: { title: "History" },
    home: { title: "Home" },
    login: { title: "Sign in" },
    logout: { title: "Sign out" },
    measurements: { title: "Measurements" },
    register: { title: "Sign up" },
    settings: { title: "Settings" },
    unknown: {
      title: "We are sorry, the page you requested has not been found"
    }
  },
  title: "Morkovka"
};
