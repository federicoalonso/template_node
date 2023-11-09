const { validate } = require("./validate-news");
const {
    ElementNotFoundException,
} = require("../../exceptions/exceptions");
const { messageBinder } = require("../../common/locale/locale-binder");

var dbModels;

const setDbModels = function (models) {
    dbModels = models;
};

const create = async function (news) {
    validate(news);

    let newNews = await dbModels.News.create(news);

    for (let i = 0; i < news.stocks_id.length; i++) {
        let stock = await dbModels.Stock.findByPk(news.stocks_id[i]);
        if (!stock)
            throw new ElementNotFoundException(messageBinder().stockNotFound);
        await newNews.addStock(stock);
    }
    return newNews;
};


const getOne = async function (id) {
    let news = await dbModels.News.findByPk(id);
    if (!news)
        throw new ElementNotFoundException(messageBinder().notFound);
    return news;
};
const getAll = async function (userId, stockId = null, limit = 20, offset = 0) {
  const user = await dbModels.User.findByPk(userId)
  if (!user) {
    throw new ElementNotFoundException(messageBinder().userNotFound)
  }

  const transactionWhereConditions = {
    GameId: user.selectedGameId,
  }

  let news = await dbModels.News.findAndCountAll({
    where: transactionWhereConditions,
    include: [
      {
        model: dbModels.Stock,
        as: 'Stocks',
        attributes: ['id', 'name', 'code', 'GameId'],
        where: stockId !== null ? { id: stockId } : undefined,
        required: stockId !== null,
      },
    ],
    order: [['createdAt', 'DESC']],
    limit: limit,
    offset: offset,
  })

  return news
}



const getByStock = async function (userId, stockId, limit = 5) {
  const user = await dbModels.User.findByPk(userId)
  if (!user) {
    throw new ElementNotFoundException(messageBinder().userNotFound)
  }

  const news = await dbModels.News.findAll({
    include: {
      model: dbModels.Stock,
      where: { id: stockId },
      attributes: ['id', 'name', 'code', 'description'],
    },
    limit,
  })

  if (!news) {
    throw new ElementNotFoundException(messageBinder().notFound)
  }

  const invalidNews = news.some(
    (newsItem) => newsItem.GameId !== user.selectedGameId
  )
  if (invalidNews) {
    throw new UserNotRegisteredInGameException(
      messageBinder().userNotRegisteredInGame
    )
  }
  return news
}


const remove = async function (id) {
    let news = await dbModels.News.findByPk(id);
    if (!news)
        throw new ElementNotFoundException(messageBinder().notFound);
    await news.destroy();
};

module.exports = {
    create,
    getOne,
    getAll,
    getByStock,
    remove,
    setDbModels,
};