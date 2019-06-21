import { Translation } from ".";

export const english: Translation = {
  alerts: {
    signInInvalidCredentials: {
      message: "Incorrect email address or password."
    }
  },
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
  },
  scenes: {
    home: { title: "Home" },
    register: { title: "Sign up" },
    signIn: { title: "Sign in" },
    unknown: { title: "The page you requested cannot be found" }
  },
  title: "Morkovka"
};
