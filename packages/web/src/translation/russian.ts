import { Translation } from "./";

export const russian: Translation = {
  components: {
    Calendar: {
      days: ["П", "В", "С", "Ч", "П", "С", "В"],
      months: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь"
      ]
    },
    Confirmation: {
      cancel: "Отмена",
      confirm: "Подтвердить",
      title: "Подтверждение"
    },
    Diet: {
      title: "Суточная потребления"
    },
    Edit: {
      addTitle: "Добавить продукт",
      confirm: "Вы уверены, что хотите удалить этот продукт?",
      delete: "Удалить",
      editTitle: "Изменить продукт",
      inputs: {
        barcode: {
          label: "Штрих-код",
          reasons: {
            empty: "Пожалуйста, введите штрих-код."
          }
        },
        name: {
          label: "Название",
          reasons: {
            empty: "Пожалуйста, введите название продукта."
          }
        },
        pieceQuantity: {
          label: "Количество одной штуки",
          reasons: {
            empty: "Пожалуйста, введите количество одной штуки.",
            lessThanOrEquals:
              "Пожалуйста, введите количество одной штуки больше чем 0.",
            NaN: "Пожалуйста, введите правильное количество одной штуки.."
          }
        },
        quantity: {
          label: "Количество",
          reasons: {
            empty: "Пожалуйста, введите количество продукта.",
            lessThanOrEquals: "Пожалуйста, введите количество больше чем 0.",
            NaN: "Пожалуйста, введите правильное количество."
          }
        },
        unit: {
          label: "Единица",
          reasons: {
            undefined: "Пожалуйста, выберите единицу."
          }
        }
      },
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
      nutrientsLabel: "Пищевая ценность",
      nutrientsLabelPer: " на 100{unit}:",
      submit: "Сохранить"
    },
    FoodstuffInfo: {
      per: "На 100{unit}:"
    },
    Head: {
      title: "Морковка"
    },
    Login: {
      inputs: {
        email: {
          label: "Эл. почта",
          reasons: {
            empty: "Пожалуйста, введите адрес электронной почты."
          }
        },
        password: {
          label: "Пароль",
          reasons: {
            empty: "Пожалуйста, введите пароль."
          }
        }
      },
      invalidCredentials: "Неверный адрес электронной почты или пароль.",
      submit: "Вход →",
      title: "Вход"
    },
    Name: {
      label: "Название",
      meals: {
        breakfast: "Завтрак",
        lunch: "Обед",
        dinner: "Ужин"
      },
      or: "Или",
      selectHelper: "Выберите название созданной приема пищи:",
      selectReasons: {
        empty: "Пожалуйста, выберите название созданной приема пищи."
      },
      submit: "Создать",
      textFieldHelper: "Введите название созданной приема пищи:",
      textFieldReasons: {
        empty: "Пожалуйста, введите название созданной приема пищи."
      },
      title: "Создать прием пищи"
    },
    Quantity: {
      g: "граммах",
      ml: "миллилитрах",
      quantity: {
        helper: "Введите количество продукта:",
        label: "Количество",
        reasons: {
          empty: "Пожалуйста, введите количество продукта.",
          lessThanOrEquals: "Пожалуйста, введите количество больше чем 0.",
          NaN: "Пожалуйста, введите правильное количество."
        }
      },
      select: "Выбрать",
      title: "Выбрать количество",
      unit: {
        helper: "Количество продукта в {unit} или в штуках?",
        label: "Единица",
        reasons: {
          undefined: "Пожалуйста, выберите единицу."
        }
      }
    },
    Search: {
      title: "Поиск"
    },
    Register: {
      inputs: {
        email: {
          label: "Эл. почта",
          reasons: {
            conflict: "Введенный адрес электронной почты уже используется.",
            empty: "Пожалуйста, введите адрес электронной почты.",
            notEmail:
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
            undefined: "Пожалуйста, выберите язык."
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
            lessThan: "Пароль должен содержать не менее 8 символов."
          }
        }
      },
      submit: "Создать аккаунт →",
      title: "Создать аккаунт"
    },
    Tabs: {
      abbreviations: [
        "янв.",
        "февр.",
        "март",
        "апр.",
        "май",
        "июнь",
        "июль",
        "авг.",
        "сент.",
        "окт.",
        "нояб.",
        "дек."
      ]
    },
    TrashCan: {
      delete: "Удалить"
    },
    Unknown: {
      message: "Страница, которую Вы ищете, не может быть найдена."
    }
  },
  units: {
    g: "г",
    kcal: "ккал",
    ml: "мл",
    pcs: "шт"
  }
};
