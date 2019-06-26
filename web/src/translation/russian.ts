import { Translation } from ".";

export const russian: Translation = {
  errors: {
    invalidInvitation: {
      title: "К сожалению, этот адрес для регистрации недействителен.",
      message:
        "Аккаунт уже был создан с помощью этого регистрационного адреса или этот веб-адрес недействителен. Если вы еще не создали аккаунт с помощью этого регистрационного адреса, пожалуйста, свяжитесь с человеком, который пригласил вас."
    },
    unknown: {
      title: "К сожалению, запрошенная страница не была найдена.",
      message:
        "Веб-адрес может быть неверный или страница, которую вы ищете, больше не доступна."
    }
  },
  inputs: {
    barcode: {
      name: "Штрихкод",
      placeholder: "Введите штрихкод",
      reasons: {}
    },
    carbohydrate: {
      name: "Углеводы",
      placeholder: "Введите количество углеводов",
      reasons: {}
    },
    email: {
      name: "Адрес электронной почты",
      placeholder: "Введите адрес электронной почты",
      reasons: {
        conflict: "Введенный адрес электронной почты уже используется",
        empty: "Пожалуйста, введите адрес электронной почты",
        invalid: "Пожалуйста, введите действительный адрес электронной почты"
      }
    },
    energy: {
      name: "Энергетическая ценность",
      placeholder: "Введите энергетическая ценность",
      reasons: {}
    },
    fat: {
      name: "Жиры",
      placeholder: "Введите количество жиров",
      reasons: {}
    },
    fibre: {
      name: "Пищевые волокна",
      placeholder: "Введите количество пищевых волокон",
      reasons: {}
    },
    language: {
      name: "Язык",
      options: {
        English: "English",
        Estonian: "eesti",
        Russian: "русский"
      },
      placeholder: "Выберите язык",
      reasons: {
        empty: "Пожалуйста, выберите язык"
      }
    },
    monoUnsaturates: {
      name: "Мононенасыщенные жирные кислоты",
      placeholder: "Введите количество мононенасыщенных жирных кислот",
      reasons: {}
    },
    name: {
      name: "Имя",
      placeholder: "Введите имя",
      reasons: {
        empty: "Пожалуйста, введите имя"
      }
    },
    password: {
      name: "Пароль",
      placeholder: "Введите пароль",
      reasons: {
        empty: "Пожалуйста, введите пароль",
        invalid: "Пароль должен содержать не менее 8 символов"
      }
    },
    polyols: {
      name: "Многоатомные спирты",
      placeholder: "Введите количество многоатомных спиртов",
      reasons: {}
    },
    polyunsaturates: {
      name: "Полиненасыщенные жирные кислоты",
      placeholder: "Введите количество полиненасыщенных жирных кислот",
      reasons: {}
    },
    protein: {
      name: "Белки",
      placeholder: "Введите количество белка",
      reasons: {}
    },
    salt: {
      name: "Соль",
      placeholder: "Введите количество соли",
      reasons: {}
    },
    saturates: {
      name: "Насыщенные жирные кислоты",
      placeholder: "Введите количество насыщенных жирных кислот",
      reasons: {}
    },
    starch: {
      name: "Крахмал",
      placeholder: "Введите количество крахмала",
      reasons: {}
    },
    sugars: {
      name: "Сахара",
      placeholder: "Введите количество сахаров",
      reasons: {}
    },
    unit: {
      name: "Единица",
      options: {
        g: "г",
        ml: "мл"
      },
      placeholder: "Выберите единицу",
      reasons: {}
    }
  },
  forms: {
    login: { submit: "Вход", title: "Вход" },
    register: { submit: "Завести аккаунт", title: "Завести аккаунт" }
  },
  notifications: {
    loginInvalidCredentials: {
      message: "Неверный адрес электронной почты или пароль."
    }
  },
  scenes: {
    administration: { title: "Администрация" },
    diet: { title: "Диета" },
    foodEditor: { title: "Изменить продукт" },
    history: { title: "История" },
    home: { title: "Главная" },
    login: { title: "Вход" },
    logout: { title: "Выход" },
    measurements: { title: "Замеры" },
    register: { title: "Завести аккаунт" },
    settings: { title: "Настройки" },
    unknown: { title: "К сожалению, запрошенная страница не была найдена" }
  },
  title: "Морковка"
};
