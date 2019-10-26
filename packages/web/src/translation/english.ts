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
            nonempty: "Please enter a barcode."
          }
        },
        name: {
          label: "Name",
          reasons: {
            nonempty: "Please enter a name of this foodstuff."
          }
        },
        pieceQuantity: {
          label: "Quantity of one piece",
          reasons: {
            nonempty: "Please enter quantity of one piece.",
            positive: "Please enter one piece quantity that is greater than 0.",
            toNumber: "Please enter correct one piece quantity."
          }
        },
        quantity: {
          label: "Quantity",
          reasons: {
            nonempty: "Please enter foodstuff quantity.",
            positive: "Please enter quantity that is greater than 0.",
            toNumber: "Please enter correct quantity."
          }
        },
        unit: {
          label: "Unit",
          reasons: {
            defined: "Please select a unit."
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
            nonempty: "Please enter an email address."
          }
        },
        password: {
          label: "Password",
          reasons: {
            nonempty: "Please enter a password."
          }
        }
      },
      invalidCredentials: "Incorrect email address or password.",
      submit: "Sign in →",
      title: "Sign in"
    },
    Name: {
      createSubmit: "Create",
      createTitle: "Create meal",
      editSubmit: "Rename",
      editTitle: "Rename meal",
      label: "Name",
      meals: {
        breakfast: "Breakfast",
        dinner: "Dinner",
        lunch: "Lunch"
      },
      or: "Or",
      selectHelper: "Select meal name:",
      selectReasons: {
        nonempty: "Please select meal name."
      },
      textFieldHelper: "Enter meal name:",
      textFieldReasons: {
        nonempty: "Please enter meal name."
      }
    },
    Quantity: {
      g: "grams",
      ml: "milliliters",
      quantity: {
        helper: "Enter foodstuff quantity:",
        label: "Quantity",
        reasons: {
          nonempty: "Please enter foodstuff quantity.",
          positive: "Please enter quantity that is greater than 0.",
          toNumber: "Please enter correct quantity."
        }
      },
      select: "Select",
      title: "Select quantity",
      unit: {
        helper: "Is the quantity in {unit} or in pieces?",
        label: "Unit",
        reasons: {
          defined: "Please select a unit."
        }
      }
    },
    Register: {
      inputs: {
        email: {
          label: "Email",
          reasons: {
            conflict: "Entered email address is already in use.",
            email: "Please enter a valid email address.",
            nonempty: "Please enter an email address."
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
            defined: "Please select a language."
          }
        },
        name: {
          label: "Name",
          reasons: {
            nonempty: "Please enter a name."
          }
        },
        password: {
          label: "Password",
          reasons: {
            minLength: "Password must be at least 8 characters long.",
            nonempty: "Please enter a password."
          }
        },
        sex: {
          label: "Sex",
          options: {
            Female: "Female",
            Male: "Male"
          },
          reasons: {
            defined: "Please select your sex."
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
