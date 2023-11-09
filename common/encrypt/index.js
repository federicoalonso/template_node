const bcrypt = require("bcrypt");

const { logger } = require("../logger");

const encrypt = async (text) => {
    try {
        let saltRounds = 10;
        let hash = await bcrypt.hash(text, saltRounds);
        return hash;
    } catch (e) {
        logger.error(
            `[encrypt: api] [function: encrypt] [type:E] ${e} Error encrypting text.`
        );
        throw e;
    }
};

const compare = async (text, hash) => {
    try {
        let result = await bcrypt.compare(text, hash);
        return result;
    } catch (e) {
        logger.error(
            `[encrypt: api] [function: compare] [type:E] ${e} Error comparing text.`
        );
        throw e;
    }
}

module.exports = {
    encrypt,
    compare
};