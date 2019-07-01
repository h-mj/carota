import { Translation } from ".";

export const russian: Translation = {
  components: {
    DeclareNutrition: {
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
      title: "TODO",
      units: {
        g: "г",
        kcal: "ккал"
      }
    },
    Error: {
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
    Input: {
      barcode: {
        placeholder: "Введите штрихкод",
        reasons: {
          empty: "Пожалуйста, введите штрихкод"
        }
      },
      email: {
        placeholder: "Введите адрес электронной почты",
        reasons: {
          conflict: "Введенный адрес электронной почты уже используется",
          empty: "Пожалуйста, введите адрес электронной почты",
          invalid: "Пожалуйста, введите действительный адрес электронной почты"
        }
      },
      language: {
        label: "Выберите язык",
        options: {
          English: "English",
          Estonian: "eesti",
          Russian: "русский"
        },
        reasons: {
          empty: "Пожалуйста, выберите язык"
        }
      },
      name: {
        placeholder: "Введите имя",
        reasons: {
          empty: "Пожалуйста, введите имя"
        }
      },
      password: {
        placeholder: "Введите пароль",
        reasons: {
          empty: "Пожалуйста, введите пароль",
          invalid: "Пароль должен содержать не менее 8 символов"
        }
      },
      unit: {
        label: "Выберите единицу",
        options: {
          g: "г",
          ml: "мл"
        },
        reasons: {
          empty: "Пожалуйста, выберите единицу"
        }
      }
    },
    NotificationContainer: {
      loginInvalidCredentials: {
        message: "Неверный адрес электронной почты или пароль."
      }
    }
  },
  forms: {
    login: { submit: "Вход", title: "Вход" },
    register: { submit: "Завести аккаунт", title: "Завести аккаунт" }
  },
  scenes: {
    administration: { title: "Администрация" },
    diet: { title: "Диета" },
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
