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
      units: {
        g: "г",
        kcal: "ккал"
      }
    },
    Form: {
      foodInformation: { submit: "Сохранить" }
    },
    Head: {
      title: "Морковка"
    },
    Input: {
      barcode: {
        label: "Введите штрихкод",
        reasons: {
          empty: "Пожалуйста, введите штрихкод"
        }
      },
      name: {
        label: "Введите имя",
        reasons: {
          empty: "Пожалуйста, введите имя"
        }
      },
      nutritionDeclaration: {
        label: "Пищевая ценность",
        reasons: {}
      },
      unit: {
        label: "Выберите единицу",
        options: {
          g: "г",
          ml: "мл"
        },
        reasons: {
          missing: "Пожалуйста, выберите единицу"
        }
      }
    },
    Navigation: {
      Administration: "Администрация",
      Diet: "Диета",
      FoodEdit: "Редактировать продукт",
      FoodSearch: "Поиск продуктов",
      History: "История",
      Home: "Главная",
      Login: "Вход",
      Logout: "Выход",
      Measurements: "Замеры",
      Register: "Завести аккаунт",
      Settings: "Настройки",
      Unknown: "К сожалению, запрошенная страница не была найдена"
    },
    NotificationContainer: {
      loginInvalidCredentials: {
        message: "Неверный адрес электронной почты или пароль."
      }
    }
  },
  scenes: {
    Login: {
      inputs: {
        email: {
          label: "Эл. почта",
          reasons: { empty: "Пожалуйста, введите адрес электронной почты" }
        },
        password: {
          label: "Пароль",
          reasons: { empty: "Пожалуйста, введите пароль" }
        }
      },
      submit: "Вход →",
      title: "Вход"
    },
    Register: {
      inputs: {
        email: {
          label: "Эл. почта",
          reasons: {
            conflict: "Введенный адрес электронной почты уже используется.",
            empty: "Пожалуйста, введите адрес электронной почты.",
            invalid:
              "Пожалуйста, введите действительный адрес электронной почты."
          }
        },
        language: {
          label: "Язык",
          options: {
            English: "English",
            Estonian: "eesti",
            Russian: "русский"
          },
          reasons: {
            missing: "Пожалуйста, выберите язык."
          }
        },
        name: {
          label: "Имя",
          reasons: {
            empty: "Пожалуйста, введите имя."
          }
        },
        password: {
          label: "Пароль",
          reasons: {
            empty: "Пожалуйста, введите пароль.",
            invalid: "Пароль должен содержать не менее 8 символов."
          }
        }
      },
      submit: "Завести аккаунт →",
      title: "Завести аккаунт"
    }
  }
};
