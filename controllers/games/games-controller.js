const {
  HttpErrorCodes,
  evalException,
} = require("../../exceptions/exceptions");
const { webServer } = require("../../conf/config");
const { verifyToken } = require('../../services/jwt')
const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const startGamesRoutes = async function startGamesRoutes(router, gamesLogic) {
  router.get(webServer.routes.games.getGames, authMiddleware, async function (req, res) {
    try {
      let {id: userId, role} = verifyToken(req.headers.authorization);
      let games = await gamesLogic.getAll(userId, role);
      return res.status(HttpErrorCodes.HTTP_200_OK).send(games);
    } catch (err) {
      return evalException(err, res);
    }
  });

  router.get(webServer.routes.games.getGame, authMiddleware, async function (req, res) {
    try {
      let id = req.params.id;
      let game = await gamesLogic.getOne(id);
      return res.status(HttpErrorCodes.HTTP_200_OK).send(game);
    } catch (err) {
      return evalException(err, res);
    }
  });

  router.post(webServer.routes.games.createGame, adminMiddleware, async function (req, res) {
    try {
      let aGame = req.body;
      let newGame = await gamesLogic.create(aGame);
      return res.status(HttpErrorCodes.HTTP_201_CREATED).send(newGame);
    } catch (err) {
      return evalException(err, res);
    }
  });

  router.put(webServer.routes.games.selectGame, authMiddleware, async function (req, res) {
    try {
      let gameId = req.params.id;
      let { id: userId } = verifyToken(req.headers.authorization);

      let { game, token } = await gamesLogic.selectGame(gameId, userId);
      return res.status(HttpErrorCodes.HTTP_200_OK).send({game: game, authorization: token });
    } catch (err) {
      return evalException(err, res);
    }
  });

  router.get(webServer.routes.games.currentGame, authMiddleware, async function (req, res) {
    try {
      let { id: userId } = verifyToken(req.headers.authorization);
      let game = await gamesLogic.getCurrent(userId);
      return res.status(HttpErrorCodes.HTTP_200_OK).send(game);
    } catch (err) {
      return evalException(err, res);
    }
  });
};

module.exports = {
  startGamesRoutes,
};
