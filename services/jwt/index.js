const { publicKey, privateKey } = require('../../conf/config');
const jwt = require("jsonwebtoken");
const { messageBinder } = require("../../common/locale/locale-binder");
const { MissingToken } = require("../../exceptions/exceptions");

const verifyOptions = {
    algorithms: ["RS256"],
};

const signOptions = {
    algorithm: 'RS256',
    expiresIn: '4h'
};

function verifyToken(bearer_token) {

    if (!bearer_token) {
        throw new MissingToken(messageBinder().missingToken);
    }

    const token = bearer_token.split(" ")[1];

    if (!token) {
        return new MissingToken(messageBinder().missingToken);
    }

    const decoded = jwt.verify(token, publicKey, verifyOptions);

    return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        selectedGameId: decoded.selectedGameId,
    }
}

function generateToken(payload) {
    return jwt.sign(payload, privateKey, signOptions);
}

module.exports = {
    verifyToken,
    generateToken,
};
