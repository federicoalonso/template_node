const { locale } = require("../../conf/config");

const messageBinder = () => {
  let messageConfig;
  if (locale == "ES") {
    messageConfig = require("./es");
  } else if (locale == "EN") {
    messageConfig = require("./en");
  } else {
    messageConfig = require("./es");
  }
  return messageConfig.crudMessages;
};

module.exports = {
  messageBinder,
};
