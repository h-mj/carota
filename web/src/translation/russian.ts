import { Translation } from ".";

export const russian: Translation = {
  components: {
    Alert: {
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
      title: "Пищевая ценность",
      units: {
        g: "г",
        kcal: "ккал"
      }
    },
    Form: {
      login: { submit: "Вход", title: "Вход" },
      foodInformation: { submit: "Сохранить", title: "Информация о еде" },
      register: { submit: "Завести аккаунт", title: "Завести аккаунт" }
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
  scenes: {
    Administration: { title: "Администрация" },
    Diet: { title: "Диета" },
    FoodInformation: { title: "Информация о еде" },
    History: { title: "История" },
    Home: { title: "Главная" },
    Login: { title: "Вход" },
    Logout: { title: "Выход" },
    Measurements: { title: "Замеры" },
    Register: { title: "Завести аккаунт" },
    Settings: { title: "Настройки" },
    Unknown: { title: "К сожалению, запрошенная страница не была найдена" }
  },
  title: "Морковка"
};
