const messageBinder = require("../common/locale/locale-binder").messageBinder();

function undefinedRouteMiddleware(req, res){
    res.status(404).json({ message: messageBinder.routeNotFound });
}

module.exports = undefinedRouteMiddleware;