import { Translation } from "./";

export const english: Translation = {
  components: {
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
      confirm: "Confirm",
      title: "Confirmation"
    },
    Diet: {
      title: "Daily intake"
    },
    Edit: {
      addTitle: "Add foodstuff",
      confirm: "Are you sure you want to delete this foodstuff?",
      delete: "Delete",
      editTitle: "Edit foodstuff",
      inputs: {
        barcode: {
          label: "Barcode",
          reasons: {
            empty: "Please enter a barcode."
          }
        },
        name: {
          label: "Name",
          reasons: {
            empty: "Please enter a name of this foodstuff."
          }
        },
        pieceQuantity: {
          label: "Quantity of one piece",
          reasons: {
            empty: "Please enter quantity of one piece.",
            lessThanOrEquals:
              "Please enter one piece quantity that is greater than 0.",
            NaN: "Please enter correct one piece quantity."
          }
        },
        quantity: {
          label: "Quantity",
          reasons: {
            empty: "Please enter foodstuff quantity.",
            lessThanOrEquals: "Please enter quantity that is greater than 0.",
            NaN: "Please enter correct quantity."
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
      nutrientsLabel: "Nutritional information",
      nutrientsLabelPer: " per 100{unit}",
      submit: "Save"
    },
    FoodstuffInfo: {
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
    Name: {
      label: "Name",
      meals: {
        breakfast: "Breakfast",
        lunch: "Lunch",
        dinner: "Dinner"
      },
      or: "Or",
      selectHelper: "Select meal name:",
      selectReasons: {
        empty: "Please select created meal name."
      },
      submit: "Create",
      textFieldHelper: "Enter created meal name:",
      textFieldReasons: {
        empty: "Please enter created meal name."
      },
      title: "Create meal"
    },
    Quantity: {
      g: "grams",
      ml: "milliliters",
      quantity: {
        helper: "Enter foodstuff quantity:",
        label: "Quantity",
        reasons: {
          empty: "Please enter foodstuff quantity.",
          lessThanOrEquals: "Please enter quantity that is greater than 0.",
          NaN: "Please enter correct quantity."
        }
      },
      select: "Select",
      title: "Select quantity",
      unit: {
        helper: "Is the quantity in {unit} or in pieces?",
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
            notEmail: "Please enter a valid email address."
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
            lessThan: "Password must be at least 8 characters long."
          }
        }
      },
      submit: "Create account →",
      title: "Create account"
    },
    Search: {
      title: "Search"
    },
    Tabs: {
      abbreviations: [
        "Jan.",
        "Feb.",
        "Mar.",
        "Apr.",
        "May",
        "Jun.",
        "Jul.",
        "Aug.",
        "Sep.",
        "Oct.",
        "Nov.",
        "Dec."
      ]
    },
    TrashCan: {
      delete: "Delete"
    },
    Unknown: {
      message: "The page you're looking for can not be found."
    }
  },
  units: {
    g: "g",
    kcal: "kcal",
    ml: "ml",
    pcs: "pcs"
  }
};
