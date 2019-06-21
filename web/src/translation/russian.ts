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
      reasons: { empty: "Пожалуйста, введите адрес электронной почты" }
    },
    password: {
      placeholder: "Введите пароль",
      reasons: { empty: "Пожалуйста, введите пароль" }
    }
  },
  forms: {
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
