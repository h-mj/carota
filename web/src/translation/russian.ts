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
    email: {
      placeholder: "Введите адрес электронной почты",
      reasons: {
        conflict:
          "Введенный адрес электронной почты уже используется другим аккаунтом",
        empty: "Пожалуйста, введите адрес электронной почты",
        invalid: "Пожалуйста, введите действительный адрес электронной почты"
      }
    },
    language: {
      options: {
        English: "English",
        Estonian: "eesti",
        Russian: "русский"
      },
      placeholder: "Выберите язык",
      reasons: { empty: "Пожалуйста, выберите язык" }
    },
    name: {
      placeholder: "Введите ваше имя",
      reasons: { empty: "Пожалуйста, введите ваше имя" }
    },
    password: {
      placeholder: "Введите пароль",
      reasons: {
        empty: "Пожалуйста, введите пароль",
        invalid: "Пароль должен содержать не менее 8 символов"
      }
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
