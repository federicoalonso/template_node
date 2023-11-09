const {
  toNumberOrExeption,
  toNumberInRangeOrExeption,
} = require("../../common/number-validate");
const {
  throwExeptionIfUndefined,
  throwExeptionIfNotHasProperty
} = require("../../common/object-validate");
const { messageBinder } = require("../../common/locale/locale-binder");
const {
  throwIfInvalidDate,
} = require("../../common/date-validate");

const validate = (priceDetail) => {
  throwExeptionIfUndefined(priceDetail, messageBinder().objectIsMissing);

  throwExeptionIfNotHasProperty(priceDetail, "price", messageBinder().pricePropertyIsMissing);
  throwExeptionIfNotHasProperty(priceDetail, "StockId", messageBinder().StockIdPropertyIsMissing);
  toNumberOrExeption(priceDetail.price, messageBinder().pricePropertyNotANumber);
  toNumberInRangeOrExeption(1, Number.MAX_SAFE_INTEGER, priceDetail.price, messageBinder().pricePropertyNotInRange);
  if (priceDetail.date){
    throwIfInvalidDate(priceDetail.date, messageBinder().datePropertyIsInvalid);
  } else {
    priceDetail.date = new Date();
  }
};

module.exports = {
  validate,
};
