import { Translation } from ".";

export const english: Translation = {
  components: {
    Alert: {
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
    DeclareNutrition: {
      nutrients: {
        carbohydrate: "Carbohydrate",
        energy: "Energy",
        fat: "Fat",
        fibre: "Fibre",
        monoUnsaturates: "Mono-unsaturates",
        polyols: "Polyols",
        polyunsaturates: "Polyunsaturates",
        protein: "Protein",
        salt: "Salt",
        saturates: "Saturates",
        starch: "Starch",
        sugars: "Sugars"
      },
      title: "Nutrition information",
      units: {
        g: "g",
        kcal: "kcal"
      }
    },
    Form: {
      login: { submit: "Sign in" },
      foodInformation: { submit: "Save" },
      register: { submit: "Sign up" }
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
  scenes: {
    Administration: { title: "Administration" },
    Diet: { title: "Diet" },
    FoodEdit: { title: "Edit food" },
    FoodSearch: { title: "Search food" },
    History: { title: "History" },
    Home: { title: "Home" },
    Login: { title: "Sign in" },
    Logout: { title: "Sign out" },
    Measurements: { title: "Measurements" },
    Register: { title: "Sign up" },
    Settings: { title: "Settings" },
    Unknown: {
      title: "We are sorry, the page you requested has not been found"
    }
  },
  title: "Morkovka"
};
