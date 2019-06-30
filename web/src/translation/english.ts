import { Translation } from ".";

export const english: Translation = {
  components: {
    Error: {
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
    Input: {
      barcode: {
        placeholder: "Enter a barcode",
        reasons: {
          empty: "Please enter a barcode"
        }
      },
      email: {
        placeholder: "Enter an email address",
        reasons: {
          conflict: "Entered email address is already in use",
          empty: "Please enter an email address",
          invalid: "Please enter a valid email address"
        }
      },
      name: {
        placeholder: "Enter a name",
        reasons: {
          empty: "Please enter a name"
        }
      },
      language: {
        label: "Select a language",
        options: {
          English: "English",
          Estonian: "eesti",
          Russian: "русский"
        },
        reasons: {
          empty: "Please select a language"
        }
      },
      password: {
        placeholder: "Enter a password",
        reasons: {
          empty: "Please enter a password",
          invalid: "Password must be at least 8 characters long"
        }
      },
      unit: {
        label: "Select a unit",
        options: {
          g: "g",
          ml: "ml"
        },
        reasons: {
          empty: "Please select a unit"
        }
      }
    },
    NotificationContainer: {
      loginInvalidCredentials: {
        message: "Incorrect email address or password."
      }
    }
  },
  forms: {
    login: { submit: "Sign in", title: "Sign in" },
    register: { submit: "Sign up", title: "Sign up" }
  },
  scenes: {
    administration: { title: "Administration" },
    diet: { title: "Diet" },
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
