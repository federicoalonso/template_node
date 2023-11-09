const { validate } = require("./validate-games");
const {
    ElementNotFoundException,
    ElementAlreadyExist
} = require("../../exceptions/exceptions");
const { messageBinder } = require("../../common/locale/locale-binder");
const { getLoginPayload } = require("../users/users-services");
const { generateToken } = require("../../services/jwt");
const cacheService = require('../cache')

var dbModels;

const setDbModels = function (models) {
    dbModels = models;
};

const create = async function (game) {
    validate(game);

    let gameExists = await dbModels.Game.findOne({
        where: {
            name: game.name,
        },
    });

    if (gameExists) {
        throw new ElementAlreadyExist(messageBinder().alreadyExists);
    }

    let newGame = await dbModels.Game.create(game);

    const codeLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < game.players; i++) {
        let userGameInfo = {
            code: "",
            money: newGame.initialMoney,
        };
        for (let j = 0; j < 8; j++) {
            userGameInfo.code += codeLetters.charAt(Math.floor(Math.random() * codeLetters.length));
        }
        const ugi = await dbModels.UserGameInfo.create(userGameInfo);
        await ugi.setGame(newGame);
    }

    const gameWithCodes = await dbModels.Game.findByPk(newGame.id, {
        include: [
            {
                model: dbModels.UserGameInfo,
                attributes: ["code"],
            },
        ],
    });

    return gameWithCodes;
};

const getOne = async function (id) {
    let game = await dbModels.Game.findByPk(id);
    if (!game) {
        throw new ElementNotFoundException(messageBinder().notFound);
    }
    return game;
};

const getAll = async function (userId, role) {
    if (role === "admin") {
        let games = await dbModels.Game.findAll();
        return games;
    }

    let games = await dbModels.Game.findAll({
        include: [
            {
                model: dbModels.UserGameInfo,
                where: {
                    UserId: userId,
                },
                include: [
                    {
                        model: dbModels.User,
                        attributes: ["selectedGameId"],
                    },
                ],
            },
        ],
    });

    return games;
};

const selectGame = async function (gameId, userId) {
    cacheService.del(`userStocks_${userId}`)

    let game = await dbModels.Game.findByPk(gameId);
    if (!game) {
        throw new ElementNotFoundException(messageBinder().gameNotFound);
    }

    let user = await dbModels.User.findByPk(userId);

    let userGameInfo = await dbModels.UserGameInfo.findOne({
        where: {
            GameId: gameId,
            UserId: userId,
        },
    });

    if (!userGameInfo) {
        throw new ElementNotFoundException(messageBinder().userNotRegisteredInGame);
    }

    user.selectedGameId = gameId;
    await user.save();

    const loginPayload = await getLoginPayload(user.email)
    const token = `Bearer ${generateToken(loginPayload)}`;

    return { game: game, token: token }
}

const getCurrent = async function (userId) {
    let user = await dbModels.User.findByPk(userId);

    let userGameInfo = await dbModels.UserGameInfo.findOne({
        where: {
            GameId: user.selectedGameId,
            UserId: userId,
        },
    });

    return {
        money: userGameInfo.money,
        gameId: userGameInfo.GameId
    };
}

module.exports = {
    create,
    getOne,
    getAll,
    setDbModels,
    selectGame,
    getCurrent
};
