const messageBinder = require("../utils/locale/locale-binder").messageBinder();

function undefinedRouteMiddleware(_, res){
    res.status(404).json({ message: messageBinder.routeNotFound });
}

module.exports = undefinedRouteMiddleware;