const util = require("hive-js-util");
const yonius = require("yonius");

const conf = {};

const start = async () => {
    await startBase();
    await Promise.all([startConfig(), startLogging()]);
};

const stop = async () => {};

const startBase = async () => {
    await yonius.load();
};

const startConfig = async () => {
    conf.HOST = yonius.conf("HOST", "127.0.0.1");
    conf.PORT = yonius.conf("PORT", 8080, "int");
    conf.KEY = yonius.conf("PROXY_KEY", null);
    conf.PRX_TARGET = yonius.conf("PROXY_TARGET", "https://kw68rhbc86kr.statuspage.io/api/v2/components.json");
    conf.PRX_TARGET = yonius.conf("PRX_TARGET", "https://kw68rhbc86kr.statuspage.io/api/v2/components.json");
    conf.PRX_KEEPALIVE = yonius.conf("PRX_KEEPALIVE", 600000, "int");
    conf.WHITELIST = _buildWhiteList();
};

const startLogging = async () => {
    const level = yonius.conf("LEVEL", "DEBUG").toUpperCase();

    const logger = util.Logging.getLogger(undefined, {
        level: util.Logging.constants[level]
    });

    if (util.Logging.ConsolaHandler.isReady()) {
        logger.addHandler(new util.Logging.ConsolaHandler());
        logger.setFormatter(new util.Logging.SimpleFormatter("{asctime} {message}"));
    } else {
        logger.addHandler(new util.Logging.StreamHandler());
        logger.setFormatter(new util.Logging.SimpleFormatter());
    }
};

const _buildWhiteList = () => {
    const whiteList = {};
    const WHITELIST = yonius.conf("WHITELIST", [], "list");
    WHITELIST.forEach(list => {
        const [param, values] = list.split(":", 2);
        whiteList[param] = values.split(",");
    });
    return whiteList;
};

module.exports = {
    conf: conf,
    start: start,
    stop: stop
};
