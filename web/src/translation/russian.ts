import { Translation } from ".";

export const russian: Translation = {
  alerts: {
    signInInvalidCredentials: {
      message: "Неверный адрес электронной почты или пароль."
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
    register: { submit: "Завести аккаунт", title: "Завести аккаунт" },
    signIn: { submit: "Вход", title: "Вход" }
  },
  scenes: {
    home: { title: "Главная страница" },
    register: { title: "Завести аккаунт" },
    signIn: { title: "Вход" },
    unknown: { title: "Запрошенная страница не найдена" }
  },
  title: "Морковка"
};
