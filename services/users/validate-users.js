const { thrrowErrorIfNotValidEmail } = require("../../common/email-validate");
const { throwExeptionIfNotStrongPassword } = require("../../common/password-validate");
const {
    throwExeptionIfUndefined,
    throwExeptionIfNotHasProperty
} = require("../../common/object-validate");
const { messageBinder } = require("../../common/locale/locale-binder");

const validate = (user) => {
    throwExeptionIfUndefined(user, messageBinder().objectIsMissing);

    throwExeptionIfNotHasProperty(user, "email", messageBinder().emailPropertyIsMissing);
    thrrowErrorIfNotValidEmail(user.email, messageBinder().emailHasInvalidFormat);

    throwExeptionIfNotHasProperty(user, "password", messageBinder().passwordPropertyIsMissing);
    throwExeptionIfNotStrongPassword(user.password);

    throwExeptionIfNotHasProperty(user, "code", messageBinder().codePropertyIsMissing);
};

module.exports = {
    validate,
};
