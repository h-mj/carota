import { Translation } from ".";

export const russian: Translation = {
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
  }
};
