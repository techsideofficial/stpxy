const util = require("hive-js-util");
const yonius = require("yonius");

const conf = {};

const start = async () => {
    await Promise.all([startConfig(), startLogging()]);
};

const startConfig = async () => {
    await yonius.load();
    conf.HOST = yonius.conf("HOST", "127.0.0.1");
    conf.PORT = yonius.conf("PORT", 3000, "int");
    conf.KEY = yonius.conf("PROXY_KEY", null);
    conf.PRX_TARGET = yonius.conf("PROXY_TARGET", "https://app.platforme.com/");
    conf.PRX_TARGET = yonius.conf("PRX_TARGET", conf.TARGET);
    conf.PRX_KEEPALIVE = yonius.conf("PRX_KEEPALIVE", 600000, "int");
};

const startLogging = async () => {
    const logger = util.Logging.getLogger(undefined, {
        level: util.Logging.constants.DEBUG
    });

    if (util.Logging.ConsolaHandler.isReady()) {
        logger.addHandler(new util.Logging.ConsolaHandler());
        logger.setFormatter(new util.Logging.SimpleFormatter("{asctime} {message}"));
    } else {
        logger.addHandler(new util.Logging.StreamHandler());
        logger.setFormatter(new util.Logging.SimpleFormatter());
    }
};

module.exports = {
    conf: conf,
    start: start,
    startConfig: startConfig,
    startLogging: startLogging
};
