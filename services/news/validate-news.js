const { 
  throwExeptionIfEmptyString,
  thrrowErrorIfMaxLength,
  thrrowErrorIfMinLength,
} = require("../../common/string-validate");
const {
  toNumberOrExeption,
} = require("../../common/number-validate");
const { 
  throwExeptionIfUndefined,
  throwExeptionIfNotHasProperty
} = require("../../common/object-validate");
const {
  throwErrorIfDateNotBetween,
  throwIfInvalidDate,
} = require("../../common/date-validate");
const { messageBinder } = require("../../common/locale/locale-binder");

const validate = (news) => {
  throwExeptionIfUndefined(news, messageBinder().objectIsMissing);

  throwExeptionIfNotHasProperty(news, "title", messageBinder().titlePropertyIsMissing);
  throwExeptionIfEmptyString(news.title, messageBinder().titlePropertyIsMissing);
  thrrowErrorIfMinLength(news.title, 3, messageBinder().newsTitleIsTooShort);
  thrrowErrorIfMaxLength(news.title, 100, messageBinder().newsTitleIsTooLong);

  throwExeptionIfNotHasProperty(news, "content", messageBinder().contentPropertyIsMissing);
  throwExeptionIfEmptyString(news.content, messageBinder().contentPropertyIsMissing);
  thrrowErrorIfMinLength(news.content, 3, messageBinder().newscontentIsTooShort);
  thrrowErrorIfMaxLength(news.content, 1000, messageBinder().newscontentIsTooLong);

  throwExeptionIfNotHasProperty(news, "date", messageBinder().datePropertyIsMissing);
  throwIfInvalidDate(news.date, messageBinder().datePropertyIsInvalid);
  news.date = new Date(news.date);
  throwErrorIfDateNotBetween(news.date, new Date(2020, 1, 1), new Date(), messageBinder().datePropertyNotInRange);

  throwExeptionIfNotHasProperty(news, "stocks_id", messageBinder().stocks_idPropertyIsMissing);
  if (news.stocks_id.length === 0) {
    throw new Error(messageBinder().stocks_idPropertyIsMissing);
  }

  throwExeptionIfNotHasProperty(news, "GameId", messageBinder().GameIdPropertyIsMissing);
  toNumberOrExeption(news.GameId, messageBinder().GameIdPropertyIsMissing);
};

module.exports = {
  validate,
};
