const {
  HttpErrorCodes,
  evalException,
  ElementInvalidException
} = require('../../exceptions/exceptions')
const { webServer } =  require("../../conf/config");
const { generateToken } = require('../../services/jwt')
const { messageBinder } = require('../../common/locale/locale-binder')

const startUsersRoutes = async (router, usersLogic) => {

  router.post(webServer.routes.users.signup, async function (req, res) {
    try {
      let aSignUp = req.body;
      await usersLogic.register(aSignUp);

      const registerPayload = await usersLogic.getLoginPayload(aSignUp.email);

      const token = `Bearer ${generateToken(registerPayload)}`;

      const response = {
        user: registerPayload,
        token: token
      };

      res.setHeader('Authorization', token);
      return res.status(HttpErrorCodes.HTTP_201_CREATED).send(response);
    } catch (err) {
      return evalException(err, res)
    }
  })

  router.post(webServer.routes.users.login, async function (req, res) {
    try {
      let aLogin = req.body
      let match = await usersLogic.login(aLogin)

      if (match) {
        const loginPayload = await usersLogic.getLoginPayload(aLogin.email)

        const token = `Bearer ${generateToken(loginPayload)}`;

        const response = {
          user: loginPayload,
          token: token
        };

        res.setHeader('Authorization', token);
        return res.status(HttpErrorCodes.HTTP_200_OK).send(response);
      } else {
        throw new ElementInvalidException(messageBinder().passwordIncorrect)
      }
    } catch (err) {
      return evalException(err, res)
    }
  })
}

module.exports = {
  startUsersRoutes
}
