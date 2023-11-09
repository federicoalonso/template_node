const {
  throwExeptionIfEmptyString,
  thrrowErrorIfMaxLength,
  thrrowErrorIfMinLength,
} = require("../../common/string-validate");
const {
  toNumberOrExeption,
  toNumberInRangeOrExeption,
} = require("../../common/number-validate");
const {
  throwExeptionIfUndefined,
  throwExeptionIfNotHasProperty
} = require("../../common/object-validate");
const {
  throwIfInvalidDate,
} = require("../../common/date-validate");
const { messageBinder } = require("../../common/locale/locale-binder");

const validate = (game) => {
  throwExeptionIfUndefined(game, messageBinder().objectIsMissing);

  throwExeptionIfNotHasProperty(game, "name", messageBinder().namePropertyIsMissing);
  throwExeptionIfEmptyString(game.name, messageBinder().namePropertyIsMissing);
  thrrowErrorIfMinLength(game.name, 3, messageBinder().nameIsTooShort);
  thrrowErrorIfMaxLength(game.name, 45, messageBinder().nameIsTooLong);

  throwExeptionIfNotHasProperty(game, "players", messageBinder().playersPropertyIsMissing);
  toNumberOrExeption(game.players, messageBinder().playersPropertyIsMissing);
  toNumberInRangeOrExeption(1, 100, game.players, messageBinder().playersPropertyNotInRange);

  throwExeptionIfNotHasProperty(game, "initialMoney", messageBinder().initialMoneyPropertyIsMissing);
  toNumberOrExeption(game.initialMoney, messageBinder().initialMoneyPropertyIsMissing);
  toNumberInRangeOrExeption(1, Number.MAX_SAFE_INTEGER, game.initialMoney, messageBinder().initialMoneyPropertyNotInRange);

  throwExeptionIfNotHasProperty(game, "startDate", messageBinder().startDatePropertyIsMissing);
  throwIfInvalidDate(game.startDate, messageBinder().datePropertyIsInvalid);

  throwExeptionIfNotHasProperty(game, "endDate", messageBinder().endDatePropertyIsMissing);
  throwIfInvalidDate(game.endDate, messageBinder().datePropertyIsInvalid);
};

module.exports = {
  validate,
};
