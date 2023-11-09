const { ElementInvalidException } = require("../exceptions/exceptions");
const { messageBinder } = require("./locale/locale-binder");

const thrrowErrorIfNotValidEmail = function (email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(email)) {
    throw new ElementInvalidException(messageBinder().invalidEmailFormat);
  }
  return email;
};

module.exports = {
  thrrowErrorIfNotValidEmail,
};
