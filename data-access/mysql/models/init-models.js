const DataTypes = require("sequelize").DataTypes;

const _Games = require("./Game");
const _Stocks = require("./Stock");
const _News = require("./News");
const _Users = require("./User");
const _PriceDetails = require("./PriceDetail");
const _UserGameInfo = require("./UserGameInfo");
const _Transactions = require("./Transaction");
const _UserStockHoldings = require("./UserStockHolding");

const initModels = (sequelize) => {
  let Game = _Games(sequelize, DataTypes);
  let Stock = _Stocks(sequelize, DataTypes);
  let News = _News(sequelize, DataTypes);
  let User = _Users(sequelize, DataTypes);
  let PriceDetail = _PriceDetails(sequelize, DataTypes);
  let UserGameInfo = _UserGameInfo(sequelize, DataTypes);
  let Transaction = _Transactions(sequelize, DataTypes);
  let UserStockHolding = _UserStockHoldings(sequelize, DataTypes);

  const News_Stoks = sequelize.define('News_Stoks', {}, { timestamps: false });

  Game.hasMany(Stock);
  Stock.belongsTo(Game, { foreignKey: 'GameId' });

  News.belongsToMany(Stock, {
    through: 'News_Stoks',
    foreignKey: 'NewsId',
    otherKey: 'StockId'
  });
  Stock.belongsToMany(News, {
    through: 'News_Stoks',
    foreignKey: 'StockId',
    otherKey: 'NewsId'
  });
  News.belongsTo(Game, { foreignKey: 'GameId' });

  Stock.hasMany(PriceDetail);
  PriceDetail.belongsTo(Stock, { foreignKey: 'StockId' });

  Game.hasMany(UserGameInfo);
  UserGameInfo.belongsTo(Game, { foreignKey: 'GameId' });

  User.hasMany(UserGameInfo);
  UserGameInfo.belongsTo(User, { foreignKey: 'UserId' });

  User.hasMany(Transaction);
  Transaction.belongsTo(User, { foreignKey: 'UserId' });

  Stock.hasMany(Transaction);
  Transaction.belongsTo(Stock, { foreignKey: 'StockId' });

  User.hasMany(UserStockHolding);
  UserStockHolding.belongsTo(User, { foreignKey: 'UserId' });

  Stock.hasMany(UserStockHolding);
  UserStockHolding.belongsTo(Stock, { foreignKey: 'StockId' });

  Game.hasMany(UserStockHolding);
  UserStockHolding.belongsTo(Game, { foreignKey: 'GameId' });

  return {
    Game,
    Stock,
    News,
    News_Stoks,
    User,
    PriceDetail,
    UserGameInfo,
    Transaction,
    UserStockHolding
  };
}

module.exports = initModels;
