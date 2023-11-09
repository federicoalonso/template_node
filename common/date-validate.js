const { ElementInvalidException } = require("../exceptions/exceptions");

const throwErrorIfDateNotBetween = function (val, minDate, maxDate, message) {
  if (val <= minDate || val >= maxDate) {
    throw new ElementInvalidException(message);
  }
}

const throwIfInvalidDate = function (val, message) {
  let date = new Date(val);
  if (date == "Invalid Date") {
    throw new ElementInvalidException(message);
  }
}

module.exports = {
  throwErrorIfDateNotBetween,
  throwIfInvalidDate,
};
