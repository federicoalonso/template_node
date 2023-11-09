const { validate } = require("./validate-prices");
const {
    ElementNotFoundException,
} = require("../../exceptions/exceptions");
const { messageBinder } = require("../../common/locale/locale-binder");


var dbModels;

const setDbModels = function (models) {
    dbModels = models;
};

const create = async (priceDetail) => {
    validate(priceDetail);

    let stockExists = await dbModels.Stock.findByPk(priceDetail.StockId);

    if (!stockExists) {
        throw new ElementNotFoundException(messageBinder().stockNotFound);
    }

    let newPrice = await dbModels.PriceDetail.create(priceDetail);

    return newPrice;
};

const getAll = async (stockId) => {
    let stockExists = await dbModels.Stock.findByPk(stockId);

    if (!stockExists) {
        throw new ElementNotFoundException(messageBinder().stockNotFound);
    }

    let prices = await dbModels.PriceDetail.findAll({
        where: {
            StockId: stockId,
        },
    });
    return prices;
};

const getLast = async (stockId) => {
    let stockExists = await dbModels.Stock.findByPk(stockId);

    if (!stockExists) {
        throw new ElementNotFoundException(messageBinder().stockNotFound);
    }
    
    let prices = await dbModels.PriceDetail.findAll({
        limit: parseInt(process.env.LIMITCOTIZATIONSTO, 10) || 20,
        order: [["date", "DESC"]],
        where: {
            StockId: stockId,
        },
    });
    return prices.reverse();
};

const getCurrentPrice = async (stockId) => {
    let priceDetail = await dbModels.PriceDetail.findOne({
        where: {
            StockId: stockId,
        },
        order: [["date", "DESC"]],
    });
    return priceDetail.price;
}

module.exports = {
    create,
    getAll,
    getCurrentPrice,
    setDbModels,
    getLast,
};
