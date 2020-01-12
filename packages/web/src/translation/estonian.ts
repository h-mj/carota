import { Translation } from "./";

export const estonian: Translation = {
  components: {
    AdviseeView: {
      abbreviations: {
        Female: "N",
        Male: "M"
      }
    },
    Body: {
      title: "Mõõdud"
    },
    Calendar: {
      days: ["E", "T", "K", "N", "R", "L", "P"],
      months: [
        "Jaanuar",
        "Veebruar",
        "Märts",
        "Aprill",
        "Mai",
        "Juuni",
        "Juuli",
        "August",
        "September",
        "Oktoober",
        "November",
        "Detsember"
      ]
    },
    Confirmation: {
      cancel: "Tühista",
      confirm: "Kinnita",
      title: "Kinnitus"
    },
    Diet: {
      title: "Päevane tarbimine"
    },
    Edit: {
      addTitle: "Lisa toiduaine",
      confirm: "Kas olete kindel, et soovite selle toiduaine ära kustutada?",
      delete: "Kustutage",
      editTitle: "Redigeerige toiduainet",
      inputs: {
        barcode: {
          label: "Triipkood",
          reasons: {
            conflict: "Sellise triipkoodiga touaine on juba listatud.",
            nonempty: "Palun sisestage toiduaine triipkood.",
            regexp: "Palun sisestage korrketne toiduaine triipkood."
          }
        },
        name: {
          label: "Nimetus",
          reasons: {
            nonempty: "Palun sisestage toiduaine nimetus."
          }
        },
        packageSize: {
          label: "Pakendi kogus",
          reasons: {
            nonempty: "Palun sisestage pakendi kogus.",
            positive: "Palun sisestage pakendi kogus mis on suurem kui 0.",
            toNumber: "Palun sisestage korrektne pakendi kogus."
          }
        },
        pieceQuantity: {
          label: "Ühe tüki kogus",
          reasons: {
            nonempty: "Palun sisestage ühe tüki kogus.",
            positive: "Palun sisestage ühe tüki kogus mis on suurem kui 0.",
            toNumber: "Palun sisestage korrektne ühe tüki kogus."
          }
        },
        unit: {
          label: "Ühik",
          reasons: {
            defined: "Palun valige ühik."
          }
        }
      },
      nutrients: {
        carbohydrate: "Süsivesikud",
        energy: "Energiasisaldus",
        fat: "Rasvad",
        fibre: "Kiudained",
        monoUnsaturates: "Monoküllastumata rasvhapped",
        polyols: "Polüoolid",
        polyunsaturates: "Polüküllastumata rasvhapped",
        protein: "Valgud",
        salt: "Sool",
        saturates: "Küllastunud rasvhapped",
        starch: "Tärklis",
        sugars: "Suhkrud"
      },
      nutrientsLabel: "Toitumisalane teave",
      nutrientsLabelPer: " 100{unit} kohta",
      submit: "Salvesta"
    },
    FoodstuffView: {
      per: "100{unit} kohta:"
    },
    GroupView: {
      ungrouped: "Rühmitamata"
    },
    GroupEdit: {
      createSubmit: "Looge",
      createTitle: "Grupi loomine",
      editSubmit: "Nimetage ümber",
      editTitle: "Grupi ümbernimetamine",
      label: "Nimetus",
      reasons: {
        nonempty: "Palun sisestage grupi nimetus."
      }
    },
    Head: {
      title: "Carota"
    },
    Login: {
      inputs: {
        email: {
          label: "E-post",
          reasons: {
            nonempty: "Palun sisestage e-posti aadress."
          }
        },
        password: {
          label: "Parool",
          reasons: {
            nonempty: "Palun sisestage salasõna."
          }
        }
      },
      invalidCredentials: "Vale e-posti aadress või parool.",
      submit: "Sisenege →",
      title: "Sisenege"
    },
    Measure: {
      confirmation: "Kas olete kindel, et soovite selle mõõdu kustutada?",
      helper: {
        Bicep: "Palun sisestage oma biitsepi ümbermõõt:",
        Calf: "Palun sisestage oma sääremarja ümbermõõt:",
        Chest: "Palun sisestage oma rindkere ümbermõõt:",
        Height: "Palun sisestage oma pikkus:",
        Hip: "Palun sisestage oma puusa ümbermõõt:",
        Shin: "Palun sisestage oma sääre ümbermõõt:",
        Thigh: "Palun sisestage oma reie ümbermõõt:",
        Waist: "Palun sisestage oma talje ümbermõõt:",
        Weight: "Palun sisestage oma kaal:",
        Wrist: "Palun sisestage oma randme ümbermõõt:"
      },
      label: "Mõõt",
      measurements: "Mõõdud",
      reasons: {
        nonempty: "Palun sisestage mõõdetud väärtus.",
        positive: "Palun sisestage väärtus mis on suurem kui 0.",
        toNumber: "Palun sisestage korrektne mõõdetud väärtus."
      },
      title: "Uuenda mõõtu",
      update: "Uuenda"
    },
    Menu: {
      Advisees: "Nõustatavad",
      Body: "Mõõtmed",
      Diet: "Päevane tarbimine",
      Logout: "Logi välja",
      Settings: "Seaded",
      Statistics: "Statistika"
    },
    Name: {
      createSubmit: "Looge",
      createTitle: "Toidukorra loomine",
      editSubmit: "Nimetage ümber",
      editTitle: "Toidukorda ümbernimetamine",
      label: "Nimetus",
      meals: {
        breakfast: "Hommikusöök",
        dinner: "Õhtusöök",
        lunch: "Lõunasöök"
      },
      or: "Või",
      selectHelper: "Valige toidukorra nimetus:",
      selectReasons: {
        nonempty: "Palun valige toidukorra nimetus."
      },
      textFieldHelper: "Sisestage toidukorra nimetus:",
      textFieldReasons: {
        nonempty: "Palun sisestage toidukorra nimetus."
      }
    },
    Quantity: {
      g: "grammides",
      ml: "milliliitrites",
      quantity: {
        helper: "Sisestage toiduaine kogus:",
        label: "Kogus",
        reasons: {
          nonempty: "Palun sisestage toiduaine kogus.",
          positive: "Palun sistestage kogus mis on suurem kui 0.",
          toNumber: "Palun sistestage korrektne kogus."
        }
      },
      select: "Valige",
      title: "Valige kogus",
      unit: {
        helper: "Kas toiduaine kogus on {ühik} või tükkides?",
        label: "Ühik",
        reasons: {
          defined: "Palun valige toiduaine ühik."
        }
      }
    },
    Register: {
      inputs: {
        birthDate: {
          label: "Sünnikuupäev",
          reasons: {
            nonempty: "Palun sisestage oma sünnikuupäev."
          }
        },
        email: {
          label: "E-post",
          reasons: {
            conflict: "Sisestatud e-posti aadress on juba kasutuses.",
            email: "Palun sisestage kehtiv e-posti aadress.",
            nonempty: "Palun sisestage e-posti aadress."
          }
        },
        language: {
          label: "Keel",
          options: {
            English: "English",
            Estonian: "eesti",
            Russian: "русский"
          },
          reasons: {
            defined: "Palun valige keel."
          }
        },
        name: {
          label: "Nimi",
          reasons: {
            nonempty: "Palun sisestage nimi."
          }
        },
        password: {
          label: "Parool",
          reasons: {
            minLength: "Salasõna peab sisaldama vähemalt 8 tähemärki.",
            nonempty: "Palun sisestage salasõna."
          }
        },
        sex: {
          label: "Sugu",
          options: {
            Female: "Naine",
            Male: "Mees"
          },
          reasons: {
            defined: "Palun valige sugu."
          }
        }
      },
      submit: "Looge konto →",
      title: "Looge konto"
    },
    Scanner: {
      title: "Skanner"
    },
    Search: {
      reasons: {
        minLength: "Päring peab sisaldama vähemalt 3 tähemärki.",
        notFound:
          "Toiduainet ei leitud. Palun proovige leida see nimetuse järgi."
      },
      title: "Otsing"
    },
    Settings: {
      language: "Keel",
      languages: {
        English: "English",
        Estonian: "eesti",
        Russian: "русский"
      },
      title: "Seaded",
      useDarkTheme: "Kasutage tumedat teemat"
    },
    Statistics: {
      ranges: {
        verySeverelyUnderweight: "Väga tõsine alakaal",
        severelyUnderweight: "Tõsine alakaal",
        underweight: "Alakaal",
        normal: "Normaalkaal",
        overweight: "Ülekaal",
        obeseClass1: "Rasvumise I aste",
        obeseClass2: "Rasvumise II aste",
        obeseClass3: "Rasvumise III aste",
        obeseClass4: "Rasvumise IV aste",
        obeseClass5: "Rasvumise V aste",
        obeseClass6: "Rasvumise VI aste"
      },
      timeFrames: {
        all: "Kõik",
        month: "Kuu",
        quarter: "Kvartal",
        week: "Nädal",
        year: "Aasta"
      },
      title: "Statistika",
      titles: {
        Bicep: "Biitsepi ümbermõõt",
        bodyMassIndex: "Kehamassiindeks",
        Calf: "Sääremarja ümbermõõt",
        Chest: "Rindkere ümbermõõt",
        Height: "Pikkus",
        Hip: "Puusa ümbermõõt",
        Shin: "Sääre ümbermõõt",
        Thigh: "Reie ümbermõõt",
        Waist: "Talje ümbermõõt",
        Weight: "Kaal",
        Wrist: "Randme ümbermõõt",
        energy: "Energiasisaldus",
        protein: "Valgud",
        fat: "Rasvad",
        carbohydrate: "Süsivesikud"
      }
    },
    Unknown: {
      message: "Teie otsitavat lehte ei leitud."
    }
  },
  locale: "et-EE",
  timeLocale: {
    dateTime: "%A, %e %B %Y a. %X",
    date: "%d.%m.%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: [
      "pühapäev",
      "esmaspäev",
      "teisipäev",
      "kolmapäev",
      "neljapäev",
      "reede",
      "laupäev"
    ],
    shortDays: ["P", "E", "T", "K", "N", "R", "L"],
    months: [
      "jaanuar",
      "veebruar",
      "märts",
      "aprill",
      "mai",
      "juuni",
      "juuli",
      "august",
      "september",
      "oktoober",
      "november",
      "detsember"
    ],
    shortMonths: [
      "jaan",
      "veebr",
      "märts",
      "apr",
      "mai",
      "juuni",
      "juuli",
      "aug",
      "sept",
      "okt",
      "nov",
      "dets"
    ]
  },
  units: {
    cm: "cm",
    g: "g",
    kcal: "kcal",
    kg: "kg",
    ml: "ml",
    pcs: "tk"
  },
  unknownError: "Ilmnes tundmatu tõrge."
};
