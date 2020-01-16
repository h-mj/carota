import { Translation } from "./";

export const english: Translation = {
  components: {
    Advisees: {
      invite: "Add",
      title: "Advisees"
    },
    AdviseeView: {
      abbreviations: {
        Female: "F",
        Male: "M"
      }
    },
    Body: {
      title: "Measurements"
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
      confirm: "Confirm",
      title: "Confirmation"
    },
    Diet: {
      title: "Daily intake"
    },
    DishEdit: {
      delete: "Delete",
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
    FoodstuffEdit: {
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
    GroupEdit: {
      createSubmit: "Create",
      createTitle: "Create group",
      delete: "Delete",
      editSubmit: "Rename",
      editTitle: "Rename group",
      label: "Name",
      reasons: {
        nonempty: "Please enter group name."
      }
    },
    GroupView: {
      ungrouped: "Ungrouped"
    },
    Head: {
      title: "Carota"
    },
    Invite: {
      loading: "Creating registration link.",
      title: "Registration link"
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
    MealEdit: {
      createSubmit: "Create",
      createTitle: "Create meal",
      delete: "Delete",
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
    Measure: {
      confirmation: "Are you sure you want to delete this measurement?",
      helper: {
        Bicep: "Please enter your bicep circumference:",
        Calf: "Please enter your calf circumference:",
        Chest: "Please enter your chest circumference:",
        Height: "Please enter your height:",
        Hip: "Please enter your hip circumference:",
        Shin: "Please enter your shin circumference:",
        Thigh: "Please enter your thigh circumference:",
        Waist: "Please enter your waist circumference:",
        Weight: "Please enter your weight:",
        Wrist: "Please enter your wrist circumference:"
      },
      label: "Value",
      measurements: "Measurements",
      reasons: {
        nonempty: "Please enter the measured value.",
        positive: "Please enter a value that is greater than 0.",
        toNumber: "Please enter a valid measured value."
      },
      title: "Update measurement",
      update: "Update"
    },
    Menu: {
      Advisees: "Advisees",
      Body: "Measurements",
      Diet: "Daily intake",
      Logout: "Sign out",
      Settings: "Settings",
      Statistics: "Statistics"
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
    Statistics: {
      ranges: {
        normal: "Normal",
        obeseClass1: "Obese Class I",
        obeseClass2: "Obese Class II",
        obeseClass3: "Obese Class III",
        obeseClass4: "Obese Class IV",
        obeseClass5: "Obese Class V",
        obeseClass6: "Obese Class VI",
        overweight: "Overweight",
        severelyUnderweight: "Severely underweight",
        underweight: "Underweight",
        verySeverelyUnderweight: "Very severely underweight"
      },
      timeFrames: {
        all: "All",
        month: "Month",
        quarter: "Quarter",
        week: "Week",
        year: "Year"
      },
      title: "Statistics",
      titles: {
        Bicep: "Bicep circumference",
        bodyMassIndex: "Body mass index",
        Calf: "Calf circumference",
        carbohydrate: "Carbohydrate",
        Chest: "Chest circumference",
        energy: "Energy",
        fat: "Fat",
        Height: "Height",
        Hip: "Hip circumference",
        protein: "Protein",
        Shin: "Shin circumference",
        Thigh: "Thigh circumference",
        Waist: "Waist circumference",
        Weight: "Weight",
        Wrist: "Wrist circumference"
      }
    },
    Unknown: {
      message: "The page you're looking for can not be found."
    }
  },
  locale: "en-US",
  timeLocale: {
    date: "%-m/%-d/%Y",
    dateTime: "%x, %X",
    days: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ],
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
    ],
    periods: ["AM", "PM"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    shortMonths: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    time: "%-I:%M:%S %p"
  },
  units: {
    cm: "cm",
    g: "g",
    kcal: "kcal",
    kg: "kg",
    ml: "ml",
    pcs: "pcs"
  },
  unknownError: "An unknown error occurred."
};
