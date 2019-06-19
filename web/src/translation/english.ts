import { Translation } from ".";

export const english: Translation = {
  inputs: {
    email: {
      placeholder: "Enter an email address",
      reasons: { empty: "Please enter an email address" }
    },
    password: {
      placeholder: "Enter a password",
      reasons: { empty: "Please enter a password" }
    }
  },
  forms: {
    signIn: { submit: "Sign in", title: "Sign in" }
  }
};
