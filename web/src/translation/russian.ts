import { Translation } from ".";

export const russian: Translation = {
  Alert: {
    invalidInvitation: {
      message:
        "Аккаунт уже был создан с помощью этого регистрационного адреса или этот веб-адрес недействителен. Если вы еще не создали аккаунт с помощью этого регистрационного адреса, пожалуйста, свяжитесь с человеком, который пригласил вас.",
      title: "К сожалению, этот адрес для регистрации недействителен."
    },
    unknown: {
      message:
        "Веб-адрес может быть неверный или страница, которую вы ищете, больше не доступна.",
      title: "К сожалению, запрошенная страница не была найдена."
    }
  },
  Edit: {
    inputs: {
      barcode: {
        label: "Штрих-код",
        reasons: {
          empty: "Пожалуйста, введите штрих-код."
        }
      },
      name: {
        label: "Название",
        reasons: {
          empty: "Пожалуйста, введите название продукта."
        }
      },
      pieceQuantity: {
        label: "Количество куска",
        reasons: {
          empty: "Пожалуйста, введите количество одного куска."
        }
      },
      quantity: {
        label: "Количество",
        reasons: {
          empty: "Пожалуйста, введите количество продукта."
        }
      },
      unit: {
        label: "Единица",
        reasons: {
          invalid: "Пожалуйста, выберите единицу."
        }
      }
    },
    nutrients: {
      carbohydrate: "Углеводы",
      energy: "Энергетическая ценность",
      fat: "Жиры",
      fibre: "Пищевые волокна",
      monoUnsaturates: "Мононенасыщенные жирные кислоты",
      polyols: "Многоатомные спирты",
      polyunsaturates: "Полиненасыщенные жирные кислоты",
      protein: "Белки",
      salt: "Соль",
      saturates: "Насыщенные жирные кислоты",
      starch: "Крахмал",
      sugars: "Сахара"
    },
    submit: "Сохранить",
    units: {
      g: "г",
      kcal: "ккал",
      ml: "мл"
    }
  },
  Head: {
    title: "Морковка"
  },
  Login: {
    inputs: {
      email: {
        label: "Эл. почта",
        reasons: {
          empty: "Пожалуйста, введите адрес электронной почты."
        }
      },
      password: {
        label: "Пароль",
        reasons: {
          empty: "Пожалуйста, введите пароль."
        }
      }
    },
    invalidCredentials: "Неверный адрес электронной почты или пароль.",
    submit: "Вход →",
    title: "Вход"
  },
  Navigation: {
    Administration: "Администрация",
    Diet: "Диета",
    Edit: "Редакция",
    History: "История",
    Home: "Главная",
    Login: "Вход",
    Logout: "Выход",
    Measurements: "Замеры",
    Quantity: "Количество",
    Register: "Создать аккаунт",
    Search: "Поиск",
    Settings: "Настройки",
    Unknown: "К сожалению, запрошенная страница не была найдена"
  },
  Register: {
    inputs: {
      email: {
        label: "Эл. почта",
        reasons: {
          conflict: "Введенный адрес электронной почты уже используется.",
          empty: "Пожалуйста, введите адрес электронной почты.",
          invalid: "Пожалуйста, введите действительный адрес электронной почты."
        }
      },
      language: {
        label: "Язык",
        options: {
          English: "English",
          Estonian: "eesti",
          Russian: "русский"
        },
        reasons: {
          invalid: "Пожалуйста, выберите язык."
        }
      },
      name: {
        label: "Имя",
        reasons: {
          empty: "Пожалуйста, введите имя."
        }
      },
      password: {
        label: "Пароль",
        reasons: {
          empty: "Пожалуйста, введите пароль.",
          invalid: "Пароль должен содержать не менее 8 символов."
        }
      }
    },
    submit: "Создать аккаунт →",
    title: "Создать аккаунт"
  },
  SearchResult: {
    per: "На 100{unit}:",
    units: {
      g: "г",
      kcal: "ккал",
      ml: "мл"
    }
  }
};
