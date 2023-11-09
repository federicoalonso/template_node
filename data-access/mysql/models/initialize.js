
const initModels = require("./init-models");
const { dbConnectionString, environment } = require("../../../conf/config");
const Sequelize = require("sequelize");
const { logger } = require("../../../common/logger");
const { encrypt } = require("../../../common/encrypt");

let sequelize;

const initializeModels = async () => {
    logger.info(
        `[initialize: api] [function: initializeModels] [type:I] system init mysql models}`
    );

    try {
        //open connection
        if (environment === 'test') {
            sequelize = new Sequelize('sqlite::memory:', {
                logging: msg => logger.debug(msg),
            });
        } else {
            sequelize = new Sequelize(dbConnectionString, {
                logging: msg => logger.debug(msg),
            });
        }

        //initialize models
        let models = initModels(sequelize);

        models.sequelize = sequelize;

        //sinchronize models and tables
        await models.Game.sync();
        await models.User.sync();
        await models.UserGameInfo.sync();
        await models.Stock.sync();
        await models.News.sync();
        await models.News_Stoks.sync();
        await models.PriceDetail.sync();
        await models.Transaction.sync();
        await models.UserStockHolding.sync();

        //create default data
        await createDefaultAdmin(models);

        if (environment === 'test') await createDefaultGame(models);

        return models;
    } catch (e) {
        if (process.env.ENVIRONMENT === 'development') {
            console.log(e);
        } else {
            logger.error(
                `[initialize: api] [function: initializeModels] [type:E] ${e} Error connecting database, system will stop.`
            );
        }

        process.exit(1);
    }
}

const createDefaultAdmin = async function (models) {
    try {
        const admin = await models.User.findOne({
            where: {
                role: "admin"
            }
        });

        if (!admin) {
            const saltKey = Math.random().toString(36).substring(2, 15);
            let hash = await encrypt("Password1" + saltKey);
            await models.User.create({
                email: "admin@ort.com",
                password: hash,
                role: "admin",
                salt: saltKey,
                selectedGameId: 0,
            });

            logger.info(
                `[initialize: api] [function: createDefaultAdmin] [type:I] Default admin created.`
            );
        }
    } catch (e) {
        logger.error(
            `[initialize: api] [function: createDefaultAdmin] [type:E] ${e} Error creating default admin.`
        );
    }
}

const createDefaultGame = async function (models) {
    try {
        const games = await models.Game.findAll()

        if (games.length === 0) {
            const game1 = await models.Game.create(
                {
                    name: 'Juego 3',
                    players: 2,
                    initialMoney: 500,
                    startDate: new Date(),
                    endDate: new Date() + 7
                }
            )
            const game2 = await models.Game.create(
                {
                    name: 'Juego 4',
                    players: 1,
                    initialMoney: 500,
                    startDate: new Date(),
                    endDate: new Date() + 7
                }
            )
            const game3 = await models.Game.create(
                {
                    name: 'Juego 5',
                    players: 1,
                    initialMoney: 500,
                    startDate: new Date(),
                    endDate: new Date() + 7
                }
            )
            const userGameInfo1 = await models.UserGameInfo.create(
                {
                    code: '0LYMp5OA',
                    money: 500,
                }
            )
            const userGameInfo2 = await models.UserGameInfo.create(
                {
                    code: '1mVslbZo',
                    money: 500
                }
            )
            const userGameInfo3 = await models.UserGameInfo.create(
                {
                    code: '2mVslbZo',
                    money: 500
                }
            )
            const userGameInfo4 = await models.UserGameInfo.create(
                {
                    code: '3mVslbZo',
                    money: 500
                }
            )
            await game1.addUserGameInfo(userGameInfo1)
            await game1.addUserGameInfo(userGameInfo2)
            await game2.addUserGameInfo(userGameInfo3)
            await game3.addUserGameInfo(userGameInfo4)
        }
        logger.info(
            `[initialize: api] [function: createDefaultGame] [type:I] Default game and codes created.`
        )
    } catch (e) {
        logger.error(
            `[initialize: api] [function: createDefaultGame] [type:E] ${e} Error creating default game.`
        )
    }
}

module.exports = {
    initializeModels,
};
