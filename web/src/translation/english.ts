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
      units: {
        g: "g",
        kcal: "kcal"
      }
    },
    Form: {
      foodInformation: { submit: "Save" },
      register: { submit: "Sign up" }
    },
    Head: {
      title: "Morkovka"
    },
    Input: {
      barcode: {
        label: "Enter a barcode",
        reasons: {
          empty: "Please enter a barcode"
        }
      },
      email: {
        label: "Enter an email address",
        reasons: {
          conflict: "Entered email address is already in use",
          empty: "Please enter an email address",
          invalid: "Please enter a valid email address"
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
          missing: "Please select a language"
        }
      },
      name: {
        label: "Enter a name",
        reasons: {
          empty: "Please enter a name"
        }
      },
      nutritionDeclaration: {
        label: "Nutrition information",
        reasons: {}
      },
      password: {
        label: "Enter a password",
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
          missing: "Please select a unit"
        }
      }
    },
    Navigation: {
      Administration: "Administration",
      Diet: "Diet",
      FoodEdit: "Edit food",
      FoodSearch: "Search food",
      History: "History",
      Home: "Home",
      Login: "Sign in",
      Logout: "Sign out",
      Measurements: "Measurements",
      Register: "Sign up",
      Settings: "Settings",
      Unknown: "We are sorry, the page you requested has not been found"
    },
    NotificationContainer: {
      loginInvalidCredentials: {
        message: "Incorrect email address or password."
      }
    }
  },
  scenes: {
    Login: {
      inputs: {
        email: {
          label: "Email",
          reasons: { empty: "Please enter an email address" }
        },
        password: {
          label: "Password",
          reasons: { empty: "Please enter a password" }
        }
      },
      title: "Sign in",
      submit: "Sign in →"
    }
  }
};
