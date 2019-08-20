import { Translation } from ".";

export const estonian: Translation = {
  components: {
    Alert: {
      invalidInvitation: {
        message:
          "Selle internetiaadressi abil on konto juba loodud või on tegemist vale aadressiga. Kui te pole kontot selle aadressiga loonud, palun võtke ühendust teid kutsunud isikuga.",
        title:
          "Vabandame, selle konto loomise lehekülje internetiaadress on kehtetu."
      },
      unknown: {
        message: "404",
        title: "Vabandame, soovitud lehekülge ei leitud."
      }
    },
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
        },
        unit: {
          label: "Ühik",
          reasons: {
            invalid: "Palun valige ühik."
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
      submit: "Salvesta"
    },
    Head: {
      title: "Morkovka"
    },
    Login: {
      inputs: {
        email: {
          label: "E-post",
          reasons: {
            empty: "Palun sisestage e-posti aadress."
          }
        },
        password: {
          label: "Parool",
          reasons: {
            empty: "Palun sisestage salasõna."
          }
        }
      },
      invalidCredentials: "Vale e-posti aadress või parool.",
      submit: "Sisenege →",
      title: "Sisenege"
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
      Quantity: "Quantity",
      Search: "Otsing",
      Settings: "Seaded",
      Unknown: "Vabandame, soovitud lehekülge ei leitud"
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
    },
    SearchResult: {
      per: "100{unit} kohta:"
    }
  },
  units: {
    g: "g",
    kcal: "kcal",
    ml: "ml",
    pcs: "tk"
  }
};
