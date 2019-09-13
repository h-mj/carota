import { Translation } from ".";

export const english: Translation = {
  components: {
    Alert: {
      invalidInvitation: {
        message:
          "An account has already been created using this sign up address or the address is invalid. If you haven't already created an account using this web address, please contact the person who invited you.",
        title: "We are sorry, this sign up address is invalid."
      },
      unknown: {
        message:
          "The web address may be misspelled or the page you're looking for is no longer available.",
        title: "We are sorry, the page you requested has not been found."
      }
    },
    Calendar: {
      days: ["M", "T", "W", "T", "F", "S", "S"],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ]
    },
    Confirmation: {
      cancel: "Cancel",
      confirm: "Confirm"
    },
    Edit: {
      confirm: "Are you sure you want to delete this product?",
      delete: "Delete",
      inputs: {
        barcode: {
          label: "Barcode",
          reasons: {
            empty: "Please enter a product barcode."
          }
        },
        name: {
          label: "Name",
          reasons: {
            empty: "Please enter a product name."
          }
        },
        pieceQuantity: {
          label: "Quantity of one piece",
          reasons: {
            empty: "Please enter quantity of one piece."
          }
        },
        quantity: {
          label: "Quantity",
          reasons: {
            empty: "Please enter product quantity."
          }
        },
        unit: {
          label: "Unit",
          reasons: {
            undefined: "Please select a unit."
          }
        }
      },
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
      submit: "Save"
    },
    FoodInfo: {
      per: "Per 100{unit}:"
    },
    Head: {
      title: "Morkovka"
    },
    Login: {
      inputs: {
        email: {
          label: "Email",
          reasons: {
            empty: "Please enter an email address."
          }
        },
        password: {
          label: "Password",
          reasons: {
            empty: "Please enter a password."
          }
        }
      },
      invalidCredentials: "Incorrect email address or password.",
      submit: "Sign in →",
      title: "Sign in"
    },
    Navigation: {
      Administration: "Administration",
      Confirmation: "Confirmation",
      Diet: "Diet",
      Edit: "Edit",
      History: "History",
      Home: "Home",
      Login: "Sign in",
      Logout: "Sign out",
      Measurements: "Measurements",
      Quantity: "Quantity",
      Register: "Sign up",
      Search: "Search",
      Settings: "Settings",
      Unknown: "We are sorry, the page you requested has not been found"
    },
    Quantity: {
      g: "grams",
      ml: "milliliters",
      quantity: {
        helper: "Please enter product quantity:",
        label: "Quantity",
        reasons: {
          empty: "Please enter product quantity.",
          less_than_or_equals: "Please enter quantity that is greater than 0.",
          not_a_number: "Please enter correct quantity."
        }
      },
      select: "Select",
      unit: {
        helper: "Is product quantity in {unit} or in pieces?",
        label: "Unit",
        reasons: {
          undefined: "Please select a unit."
        }
      }
    },
    Register: {
      inputs: {
        email: {
          label: "Email",
          reasons: {
            conflict: "Entered email address is already in use.",
            empty: "Please enter an email address.",
            not_email: "Please enter a valid email address."
          }
        },
        language: {
          label: "Language",
          options: {
            English: "English",
            Estonian: "eesti",
            Russian: "русский"
          },
          reasons: {
            undefined: "Please select a language."
          }
        },
        name: {
          label: "Name",
          reasons: {
            empty: "Please enter a name."
          }
        },
        password: {
          label: "Password",
          reasons: {
            empty: "Please enter a password.",
            invalid: "Password must be at least 8 characters long."
          }
        }
      },
      submit: "Create account →",
      title: "Create account"
    }
  },
  units: {
    g: "g",
    kcal: "kcal",
    ml: "ml",
    pcs: "pcs"
  }
};
