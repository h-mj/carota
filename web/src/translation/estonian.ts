import { Translation } from ".";

export const estonian: Translation = {
  components: {
    Alert: {
      invalidInvitation: {
        title:
          "Vabandame, selle konto loomise lehekülje internetiaadress on kehtetu.",
        message:
          "Selle internetiaadressi abil on konto juba loodud või on tegemist vale aadressiga. Kui te pole kontot selle aadressiga loonud, palun võtke ühendust teid kutsunud isikuga."
      },
      unknown: {
        title: "Vabandame, soovitud lehekülge ei leitud.",
        message: "404"
      }
    },
    Head: {
      title: "Morkovka"
    },
    Navigation: {
      Administration: "Administratsioon",
      Diet: "Dieet",
      Edit: "Redaktsioon",
      History: "Ajalugu",
      Home: "Avaleht",
      Login: "Logige sisse",
      Logout: "Logige välja",
      Measurements: "Mõõdud",
      Register: "Looge konto",
      Search: "Otsing",
      Settings: "Seaded",
      Unknown: "Vabandame, soovitud lehekülge ei leitud"
    },
    NotificationContainer: {
      loginInvalidCredentials: {
        message: "Vale e-posti aadress või parool."
      }
    },
    SearchResult: {
      per: "100{unit} kohta:",
      units: {
        g: "g",
        kcal: "kcal",
        ml: "ml"
      }
    }
  },
  scenes: {
    Edit: {
      inputs: {
        barcode: {
          label: "Triipkood",
          reasons: {
            empty: "Palun sisestage toiduaine triipkood."
          }
        },
        name: {
          label: "Nimetus",
          reasons: {
            empty: "Palun sisestage toiduaine nimetus."
          }
        },
        unit: {
          label: "Ühik",
          reasons: {
            invalid: "Palun valige ühik."
          }
        },
        pieceQuantity: {
          label: "Tüki kogus",
          reasons: {
            empty: "Palun sisestage ühe tüki kogus."
          }
        },
        quantity: {
          label: "Kogus",
          reasons: {
            empty: "Palun sisestage toiduaine kogus."
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
      submit: "Salvesta",
      units: {
        g: "g",
        kcal: "kcal",
        ml: "ml"
      }
    },
    Login: {
      inputs: {
        email: {
          label: "E-post",
          reasons: { empty: "Palun sisestage e-posti aadress." }
        },
        password: {
          label: "Parool",
          reasons: { empty: "Palun sisestage salasõna." }
        }
      },
      submit: "Sisenege →",
      title: "Sisenege"
    },
    Register: {
      inputs: {
        email: {
          label: "E-post",
          reasons: {
            conflict: "Sisestatud e-posti aadress on juba kasutuses.",
            empty: "Palun sisestage e-posti aadress.",
            invalid: "Palun sisestage kehtiv e-posti aadress."
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
            invalid: "Palun valige keel."
          }
        },
        name: {
          label: "Nimi",
          reasons: {
            empty: "Palun sisestage nimi."
          }
        },
        password: {
          label: "Parool",
          reasons: {
            empty: "Palun sisestage salasõna.",
            invalid: "Salasõna peab sisaldama vähemalt 8 tähemärki."
          }
        }
      },
      submit: "Looge konto →",
      title: "Looge konto"
    }
  }
};
