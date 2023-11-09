const { validate } = require("./validate-users");
const {
  ElementNotFoundException,
  ElementInvalidException
} = require("../../exceptions/exceptions");
const { messageBinder } = require("../../common/locale/locale-binder");
const { encrypt, compare } = require("../../common/encrypt");

var dbModels;

const setDbModels = function (models) {
  dbModels = models;
};

const register = async (registerReq) => {
  validate(registerReq);

  const email = registerReq.email;
  const codeReq = registerReq.code;
  const password = registerReq.password;
  const userGameInfo = await dbModels.UserGameInfo.findOne({
    where: {
      code: codeReq,
    },
  });

  if (!userGameInfo) {
    throw new ElementNotFoundException(messageBinder().codeNotFound);
  }
  if (userGameInfo.UserId) {
    throw new ElementInvalidException(messageBinder().codeAlreadyUsed);
  }

  // check if email already exists
  let user = await dbModels.User.findOne({
    where: {
      email: email,
    },
  });
  // check if password is correct
  if (user) {
    let match = await compare(password + user.salt, user.password);
    if (!match) {
      throw new ElementInvalidException(messageBinder().passwordIncorrect);
    }
    // check if user is already registered to the game
    let userGameInfos = await dbModels.UserGameInfo.findAll({
      where: {
        UserId: user.id,
      },
    });
    let gameIds = userGameInfos.map((info) => {
      return info.GameId;
    });
    if (gameIds.includes(userGameInfo.GameId)) {
      throw new ElementInvalidException(messageBinder().userAlreadyRegisteredToGame);
    }
    // add user id to userGameInfo
    userGameInfo.UserId = user.id;
    await userGameInfo.save();
  }

  // create user
  if (!user) {
    let saltKey = Math.random().toString(36).substring(2, 15);
    let hash = await encrypt(password + saltKey);
    let newUser = await dbModels.User.create({
      email: email,
      password: hash,
      role: "user",
      salt: saltKey,
      selectedGameId: userGameInfo.GameId,
    });
    // add user id to userGameInfo
    userGameInfo.UserId = newUser.id;
    user = newUser;
    await userGameInfo.save();
  }

  user.password = undefined;
  return user;
};

const login = async function ({email, password}) {
	let user = await dbModels.User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new ElementInvalidException(messageBinder().passwordIncorrect);
  }

	let match = await compare(password + user.salt, user.password);
	return match;
};

const getLoginPayload = async function (email) {
  let user = await dbModels.User.findOne({
    where: {
      email: email,
    },
    attributes: ["id", "email", "role", "selectedGameId"],
  });

  if(user.role === 'admin') {
    return {
      id: user.id,
      email: user.email,
      role: user.role
    };
  }

  // get games Ids that the user is registered to
  let userGameInfos = await dbModels.UserGameInfo.findAll({
    where: {
      UserId: user.id,
    },
    attributes: ["GameId"],
  });
  let gamesIds = userGameInfos.map((info) => {
    return info.GameId;
  });
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    gamesIds: gamesIds,
    selectedGameId: user.selectedGameId
  };
};

module.exports = {
  setDbModels,
  register,
  getLoginPayload,
  login
};
