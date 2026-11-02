export interface FieldsCustomInput {
  name: string;
  value: string;
  required?: boolean;
  placeholder?: string;
  type: string;
  photo?: string;
  textareaData?: number;
}

interface CustomInputConfig {
  type: string;
  fields: FieldsCustomInput[];
}

export const CustomInputConfigData: CustomInputConfig[] = [
  {
    type: "login",
    fields: [
      {
        name: "email",
        value: "Логин",
        placeholder: "Email",
        required: true,
        type: "email",
      },
      {
        name: "password",
        value: "Пароль",
        placeholder: "Пароль",
        required: true,
        type: "password",
      },
    ],
  },

  {
    type: "register",
    fields: [
      {
        name: "email",
        value: "Email",
        placeholder: "Email",
        required: true,
        type: "email",
      },
      {
        name: "password",
        value: "Пароль",
        placeholder: "Пароль",
        required: true,
        type: "password",
      },
      {
        name: "confirmPassword",
        value: "Повторите пароль",
        placeholder: "Повторите пароль",
        required: true,
        type: "password",
      },
    ],
  },

  {
    type: "editing",
    fields: [
      {
        photo: "",
        name: "photo",
        value: "Изменить фото",
        required: false,
        type: "file",
      },
      {
        name: "full_name",
        value: "ФИО",
        placeholder: "ФИО",
        required: true,
        type: "text",
      },
      {
        name: "city",
        value: "Город",
        placeholder: "Ваш город",
        required: true,
        type: "text",
      },
      {
        name: "bio",
        value: "О себе",
        placeholder: "О себе",
        required: false,
        type: "textarea",
        textareaData: 600,
      },
    ],
  },

  {
    type: "changePassword",
    fields: [
      {
        name: "password",
        value: "Новый пароль",
        placeholder: "Новый пароль",
        required: true,
        type: "password",
      },
      {
        name: "confirmPassword",
        value: "Повторите пароль",
        placeholder: "Повторите пароль",
        required: true,
        type: "password",
      },
    ],
  },

  {
    type: "storyCard",
    fields: [
      {
        name: "photo",
        value: "Загрузите ваше фото",
        placeholder: "",
        required: false,
        type: "file",
      },
      {
        name: "title",
        value: "Заголовок",
        placeholder: "Заголовок",
        required: true,
        type: "text",
      },
      {
        name: "country",
        value: "Страна",
        placeholder: "Страна",
        required: true,
        type: "text",
      },
      {
        name: "city",
        value: "Город",
        placeholder: "Город",
        required: true,
        type: "text",
      },
      {
        name: "description",
        value: "Описание",
        placeholder: "Добавьте описание вашей истории",
        required: true,
        type: "textarea",
        textareaData: 2000,
      },
    ],
  },

  {
    type: "comment",
    fields: [
      {
        name: "author_name",
        value: "Ваше имя",
        placeholder: "Ваше имя",
        required: true,
        type: "text",
      },
      {
        name: "comment",
        value: "Отзыв",
        placeholder: "Добавьте текст отзыва",
        required: true,
        type: "textarea",
        textareaData: 600,
      },
    ],
  },
];
