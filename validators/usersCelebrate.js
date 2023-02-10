const { celebrate, Joi } = require('celebrate');

const objectUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const objectUserIdValidator = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
});

const objectUserAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/i),
  }),
});

module.exports = {
  objectUserIdValidator,
  objectUserValidator,
  objectUserAvatarValidator,
};
