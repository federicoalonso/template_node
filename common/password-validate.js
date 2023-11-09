const { ElementInvalidException } = require("../exceptions/exceptions");
const { messageBinder } = require("./locale/locale-binder");

const throwExeptionIfNotStrongPassword = function (password) {
  // 12 characters at least
  // at least 3 of 4 (uppercase, lowercase, numbers, special characters)
  let uppercaseRegex = new RegExp("[A-Z]");
  let lowercaseRegex = new RegExp("[a-z]");
  let numberRegex = new RegExp("[0-9]");
  // allowed special characters are: !@#$%^&*()_+|~-={}[]:;<>?,./
  let specialCharacterRegex = new RegExp("[!@#$%^&*()_+|~\\-={}\\[\\]:;<>?,./]");
  let spacesRegex = new RegExp("\\s");  // spaces are not allowed
  let lengthRegex = new RegExp(".{12,}");
  
  let differentCharacters = 0;
  if (uppercaseRegex.test(password)) {
    differentCharacters++;
  }
  if (lowercaseRegex.test(password)) {
    differentCharacters++;
  }
  if (numberRegex.test(password)) {
    differentCharacters++;
  }
  if (specialCharacterRegex.test(password)) {
    differentCharacters++;
  }
  if (spacesRegex.test(password)) {
    throw new ElementInvalidException(messageBinder().passwordCannotContainSpaces);
  }
  if (!lengthRegex.test(password)) {
    throw new ElementInvalidException(messageBinder().passwordMustBeAtLeast12CharactersLong);
  }
  if (differentCharacters < 3) {
    throw new ElementInvalidException(messageBinder().passwordMustContainAtLeast3DifferentCharacters);
  }
};

module.exports = {
  throwExeptionIfNotStrongPassword,
};
