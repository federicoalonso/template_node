const {
  throwExeptionIfEmptyString,
  thrrowErrorIfMaxLength,
  thrrowErrorIfMinLength
} = require('../../common/string-validate')
const { toNumberOrExeption } = require('../../common/number-validate')
const {
  throwExeptionIfUndefined,
  throwExeptionIfNotHasProperty
} = require('../../common/object-validate')
const { messageBinder } = require('../../common/locale/locale-binder')

const validate = (stock) => {
  throwExeptionIfUndefined(stock, messageBinder().objectIsMissing)

  throwExeptionIfNotHasProperty(
    stock,
    'name',
    messageBinder().namePropertyIsMissing
  )
  throwExeptionIfEmptyString(stock.name, messageBinder().namePropertyIsMissing)
  thrrowErrorIfMinLength(stock.name, 3, messageBinder().stockNameIsTooShort)
  thrrowErrorIfMaxLength(stock.name, 50, messageBinder().stockNameIsTooLong)

  // code ASDASD
  throwExeptionIfNotHasProperty(
    stock,
    'code',
    messageBinder().codePropertyIsMissing
  )
  throwExeptionIfEmptyString(stock.code, messageBinder().codePropertyIsMissing)
  thrrowErrorIfMinLength(stock.code, 3, messageBinder().stockCodeIsTooShort)
  thrrowErrorIfMaxLength(stock.code, 6, messageBinder().stockCodeIsTooLong)

  // description varchar 255
  throwExeptionIfNotHasProperty(
    stock,
    'description',
    messageBinder().descriptionPropertyIsMissing
  )
  throwExeptionIfEmptyString(
    stock.description,
    messageBinder().descriptionPropertyIsMissing
  )
  thrrowErrorIfMinLength(
    stock.description,
    3,
    messageBinder().stockDescriptionIsTooShort
  )
  thrrowErrorIfMaxLength(
    stock.description,
    255,
    messageBinder().stockDescriptionIsTooLong
  )

  // GameId integer
  throwExeptionIfNotHasProperty(
    stock,
    'GameId',
    messageBinder().GameIdPropertyIsMissing
  )
  toNumberOrExeption(stock.GameId, messageBinder().GameIdPropertyIsMissing)

  throwExeptionIfNotHasProperty(
    stock,
    'amount',
    messageBinder().amountPropertyIsMissing
  )

  throwExeptionIfNotHasProperty(
    stock,
    'availableAmount',
    messageBinder().availableAmountPropertyIsMissing
  )
}

module.exports = {
  validate
}
