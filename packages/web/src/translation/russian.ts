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
            conflict: "Продукт с таким штрих-кодом уже существуют.",
            nonempty: "Пожалуйста, введите штрих-код.",
            regexp: "Пожалуйста, введите правильный штрих-код."
          }
        },
        name: {
          label: "Название",
          reasons: {
            nonempty: "Пожалуйста, введите название продукта."
          }
        },
        packageSize: {
          label: "Количество в упаковке",
          reasons: {
            nonempty: "Пожалуйста, введите количество продукта в упаковке.",
            positive: "Пожалуйста, введите количество больше чем 0.",
            toNumber:
              "Пожалуйста, введите правильное количество продукта в упаковке."
          }
        },
        pieceQuantity: {
          label: "Количество одной штуки",
          reasons: {
            nonempty: "Пожалуйста, введите количество одной штуки.",
            positive:
              "Пожалуйста, введите количество одной штуки больше чем 0.",
            toNumber: "Пожалуйста, введите правильное количество одной штуки.."
          }
        },
        unit: {
          label: "Единица",
          reasons: {
            defined: "Пожалуйста, выберите единицу."
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
    FoodstuffView: {
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
            nonempty: "Пожалуйста, введите адрес электронной почты."
          }
        },
        password: {
          label: "Пароль",
          reasons: {
            nonempty: "Пожалуйста, введите пароль."
          }
        }
      },
      invalidCredentials: "Неверный адрес электронной почты или пароль.",
      submit: "Вход →",
      title: "Вход"
    },
    Name: {
      createSubmit: "Создать",
      createTitle: "Создать прием пищи",
      editSubmit: "Переименование приема пищи",
      editTitle: "Переименовать",
      label: "Название",
      meals: {
        breakfast: "Завтрак",
        dinner: "Ужин",
        lunch: "Обед"
      },
      or: "Или",
      selectHelper: "Выберите название приема пищи:",
      selectReasons: {
        nonempty: "Пожалуйста, выберите название приема пищи."
      },
      textFieldHelper: "Введите название приема пищи:",
      textFieldReasons: {
        nonempty: "Пожалуйста, введите название приема пищи."
      }
    },
    Quantity: {
      g: "граммах",
      ml: "миллилитрах",
      quantity: {
        helper: "Введите количество продукта:",
        label: "Количество",
        reasons: {
          nonempty: "Пожалуйста, введите количество продукта.",
          positive: "Пожалуйста, введите количество больше чем 0.",
          toNumber: "Пожалуйста, введите правильное количество."
        }
      },
      select: "Выбрать",
      title: "Выбрать количество",
      unit: {
        helper: "Количество продукта в {unit} или в штуках?",
        label: "Единица",
        reasons: {
          defined: "Пожалуйста, выберите единицу."
        }
      }
    },
    Register: {
      inputs: {
        email: {
          label: "Эл. почта",
          reasons: {
            conflict: "Введенный адрес электронной почты уже используется.",
            email:
              "Пожалуйста, введите действительный адрес электронной почты.",
            nonempty: "Пожалуйста, введите адрес электронной почты."
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
            defined: "Пожалуйста, выберите язык."
          }
        },
        name: {
          label: "Имя",
          reasons: {
            nonempty: "Пожалуйста, введите имя."
          }
        },
        password: {
          label: "Пароль",
          reasons: {
            minLength: "Пароль должен содержать не менее 8 символов.",
            nonempty: "Пожалуйста, введите пароль."
          }
        },
        sex: {
          label: "Пол",
          options: {
            Female: "Женщина",
            Male: "Мужчина"
          },
          reasons: {
            defined: "Пожалуйста, выберите свой пол."
          }
        }
      },
      submit: "Создать аккаунт →",
      title: "Создать аккаунт"
    },
    Scanner: {
      title: "Сканер"
    },
    Search: {
      reasons: {
        minLength: "Запрос должен содержать не менее 3 символов.",
        notFound:
          "Продукт найден. Пожалуйста, попробуйте найти его по названию."
      },
      title: "Поиск"
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
  },
  unknownError: "Произошла неизвестная ошибка."
};
