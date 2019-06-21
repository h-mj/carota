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
      reasons: {
        conflict: "Entered email address is already used by another account",
        empty: "Please enter an email address",
        invalid: "Please enter a valid email address"
      }
    },
    language: {
      options: {
        English: "English",
        Estonian: "eesti",
        Russian: "русский"
      },
      placeholder: "Select a language",
      reasons: { empty: "Please select a language" }
    },
    name: {
      placeholder: "Enter your name",
      reasons: { empty: "Please enter your name" }
    },
    password: {
      placeholder: "Enter a password",
      reasons: {
        empty: "Please enter a password",
        invalid: "Password must be at least 8 characters long"
      }
    }
  },
  forms: {
    register: { submit: "Sign up", title: "Sign up" },
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
