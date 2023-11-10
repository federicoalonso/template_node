const { LOCALE } = require("../../config");

const messageBinder = () => {
  let messageConfig;
  if (LOCALE == "ES") {
    messageConfig = require("./es");
  } else if (LOCALE == "EN") {
    messageConfig = require("./en");
  } else {
    messageConfig = require("./es");
  }
  return messageConfig.crudMessages;
};

module.exports = {
  messageBinder,
};
