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
            conflict: "Foodstuff with this barcode already exists",
            nonempty: "Please enter a barcode.",
            regexp: "Please enter a valid barcode."
          }
        },
        name: {
          label: "Name",
          reasons: {
            nonempty: "Please enter a name of this foodstuff."
          }
        },
        packageSize: {
          label: "Package size",
          reasons: {
            nonempty: "Please enter foodstuff package size.",
            positive: "Please enter a package size that is greater than 0.",
            toNumber: "Please enter correct package size."
          }
        },
        pieceQuantity: {
          label: "Piece quantity",
          reasons: {
            nonempty: "Please enter quantity of one piece.",
            positive: "Please enter one piece quantity that is greater than 0.",
            toNumber: "Please enter correct one piece quantity."
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
    FoodstuffView: {
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
    Menu: {
      Diet: "Daily intake",
      Logout: "Sign out",
      Settings: "Settings"
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
        birthDate: {
          label: "Birth date",
          reasons: {
            nonempty: "Please enter your birth date."
          }
        },
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
    Scanner: {
      title: "Scanner"
    },
    Search: {
      reasons: {
        minLength: "Search query must be at least 3 characters long.",
        notFound: "Foodstuff was not found. Please try to find it by name."
      },
      title: "Search"
    },
    Settings: {
      language: "Language",
      languages: {
        English: "English",
        Estonian: "eesti",
        Russian: "русский"
      },
      title: "Settings",
      useDarkTheme: "Use dark theme"
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
  },
  unknownError: "An unknown error occurred."
};
