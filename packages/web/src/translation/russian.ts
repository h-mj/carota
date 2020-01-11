import { Translation } from "./";

export const russian: Translation = {
  components: {
    AdviseeView: {
      abbreviations: {
        Female: "Ж",
        Male: "М"
      }
    },
    Body: {
      title: "Замеры"
    },
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
    GroupView: {
      ungrouped: "Негруппированные"
    },
    GroupEdit: {
      createSubmit: "Создать",
      createTitle: "Создать группу",
      editSubmit: "Переименовать",
      editTitle: "Переименование группы",
      label: "Название",
      reasons: {
        nonempty: "Пожалуйста, выберите название группы."
      }
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
    Measure: {
      confirmation: "Вы уверены, что хотите удалить этот замер?",
      helper: {
        Bicep: "Пожалуйста, введите объем бицепса:",
        Calf: "Пожалуйста, введите объем икры ноги:",
        Chest: "Пожалуйста, введите объем груди:",
        Height: "Пожалуйста, введите ваш рост:",
        Hip: "Пожалуйста, введите объем бедер:",
        Shin: "Пожалуйста, введите объем голени:",
        Thigh: "Пожалуйста, введите объем бедра:",
        Waist: "Пожалуйста, введите объем талии:",
        Weight: "Пожалуйста, введите ваш вес:",
        Wrist: "Пожалуйста, введите объем запястья:"
      },
      label: "Значение",
      measurements: "Замеры",
      reasons: {
        nonempty: "Пожалуйста, введите измеренное значение.",
        positive: "Пожалуйста, введите значение больше 0.",
        toNumber: "Пожалуйста, введите правильное значение измерения."
      },
      title: "Обновить замер",
      update: "Обновить"
    },
    Menu: {
      Advisees: "Клиенты",
      Body: "Замеры",
      Diet: "Суточная потребления",
      Logout: "Выйти",
      Settings: "Настройки",
      Statistics: "Статистика"
    },
    Name: {
      createSubmit: "Создать",
      createTitle: "Создать прием пищи",
      editSubmit: "Переименовать",
      editTitle: "Переименование приема пищи",
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
        birthDate: {
          label: "Дата рождения",
          reasons: {
            nonempty: "Пожалуйста, введите вашу дату рождения."
          }
        },
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
    Settings: {
      language: "Язык",
      languages: {
        English: "English",
        Estonian: "eesti",
        Russian: "русский"
      },
      title: "Настройки",
      useDarkTheme: "Использовать темную тему"
    },
    Statistics: {
      ranges: {
        verySeverelyUnderweight: "Очень выраженный дефицит массы",
        severelyUnderweight: "Выраженный дефицит массы",
        underweight: "Недостаточная масса тела",
        normal: "Норма",
        overweight: "Предожирение",
        obeseClass1: "Ожирение I степени",
        obeseClass2: "Ожирение II степени",
        obeseClass3: "Ожирение III степени",
        obeseClass4: "Ожирение IV степени",
        obeseClass5: "Ожирение V степени",
        obeseClass6: "Ожирение VI степени"
      },
      timeFrames: {
        all: "Все",
        month: "Месяц",
        quarter: "Квартал",
        week: "Неделя",
        year: "Год"
      },
      title: "Статистика",
      titles: {
        Bicep: "Объем бицепса",
        bodyMassIndex: "Индекс массы тела",
        Calf: "Объем икры ноги",
        Chest: "Объем груди",
        Height: "Рост",
        Hip: "Объем бедер",
        Shin: "Объем голени",
        Thigh: "Объем бедра",
        Waist: "Объем талии",
        Weight: "Вес",
        Wrist: "Объем запястья",
        energy: "Энергетическая ценность",
        protein: "Белки",
        fat: "Жиры",
        carbohydrate: "Углеводы"
      }
    },
    TrashCan: {
      delete: "Удалить"
    },
    Unknown: {
      message: "Страница, которую Вы ищете, не может быть найдена."
    }
  },
  locale: "ru-RU",
  timeLocale: {
    dateTime: "%A, %e %B %Y г. %X",
    date: "%d.%m.%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: [
      "воскресенье",
      "понедельник",
      "вторник",
      "среда",
      "четверг",
      "пятница",
      "суббота"
    ],
    shortDays: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
    months: [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря"
    ],
    shortMonths: [
      "янв",
      "фев",
      "мар",
      "апр",
      "май",
      "июн",
      "июл",
      "авг",
      "сен",
      "окт",
      "ноя",
      "дек"
    ]
  },
  units: {
    cm: "см",
    g: "г",
    kcal: "ккал",
    kg: "кг",
    ml: "мл",
    pcs: "шт"
  },
  unknownError: "Произошла неизвестная ошибка."
};
