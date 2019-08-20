import { Translation } from ".";

export const english: Translation = {
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
  Edit: {
    inputs: {
      barcode: {
        label: "Barcode",
        reasons: {
          empty: "Please enter product barcode."
        }
      },
      name: {
        label: "Name",
        reasons: {
          empty: "Please enter product name."
        }
      },
      pieceQuantity: {
        label: "Piece quantity",
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
          invalid: "Please select a unit."
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
    submit: "Save",
    units: {
      g: "g",
      kcal: "kcal",
      ml: "ml"
    }
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
  Register: {
    inputs: {
      email: {
        label: "Email",
        reasons: {
          conflict: "Entered email address is already in use.",
          empty: "Please enter an email address.",
          invalid: "Please enter a valid email address."
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
          invalid: "Please select a language."
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
  },
  SearchResult: {
    per: "Per 100{unit}:",
    units: {
      g: "g",
      kcal: "kcal",
      ml: "ml"
    }
  }
};
