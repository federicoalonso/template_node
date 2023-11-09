const {
  toNumberOrExeption,
  toNumberInRangeOrExeption
} = require('../../common/number-validate')
const {
  throwExeptionIfUndefined,
  throwExeptionIfNotHasProperty
} = require('../../common/object-validate')
const { messageBinder } = require('../../common/locale/locale-binder')

const validate = (recommendation) => {
  throwExeptionIfUndefined(recommendation, messageBinder().objectIsMissing)
  throwExeptionIfNotHasProperty(
    recommendation,
    'type',
    messageBinder().typePropertyIsMissing
  )
  throwExeptionIfNotHasProperty(
    recommendation,
    'stockId',
    messageBinder().stockIdPropertyIsMissing
  )
  throwExeptionIfNotHasProperty(
    recommendation,
    'userId',
    messageBinder().userIdPropertyIsMissing
  )
  toNumberOrExeption(recommendation.userId, messageBinder().userIdIsNotANumber)
  toNumberInRangeOrExeption(
    1,
    Number.MAX_SAFE_INTEGER,
    recommendation.stockId,
    messageBinder().stockIdIsNotInRange
  )
  toNumberInRangeOrExeption(
    1,
    Number.MAX_SAFE_INTEGER,
    recommendation.userId,
    messageBinder().userIdIsNotInRange
  )
}

module.exports = {
  validate
}
