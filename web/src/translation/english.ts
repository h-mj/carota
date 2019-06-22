import { Translation } from ".";

export const english: Translation = {
  alerts: {
    signInInvalidCredentials: {
      message: "Incorrect email address or password."
    }
  },
  errors: {
    invalidInvitation: {
      title: "We are sorry, this sign up address is invalid.",
      message:
        "An account has already been created using this sign up address or the address is invalid. If you haven't already created an account using this web address, please contact the person who invited you."
    },
    unknown: {
      title: "We are sorry, the page you requested has not been found.",
      message:
        "The web address may be misspelled or the page you're looking for is no longer available."
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
    unknown: {
      title: "We are sorry, the page you requested has not been found"
    }
  },
  title: "Morkovka"
};
