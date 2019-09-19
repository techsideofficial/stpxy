const util = require("hive-js-util");

const HOSTNAME = process.env.HOST ? process.env.HOST : "127.0.0.1";
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const KEY = process.env.PROXY_KEY ? process.env.PROXY_KEY : null;
const TARGET = process.env.PROXY_TARGET ? process.env.PROXY_TARGET : "https://app.platforme.com/";
const PRX_TARGET = process.env.PRX_TARGET ? process.env.PRX_TARGET : TARGET;
const PRX_KEEPALIVE = process.env.PRX_KEEPALIVE ? parseInt(process.env.PRX_KEEPALIVE) : 600000;

const startLogging = () => {
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
    HOSTNAME: HOSTNAME,
    PORT: PORT,
    KEY: KEY,
    PRX_TARGET: PRX_TARGET,
    PRX_KEEPALIVE: PRX_KEEPALIVE,
    startLogging: startLogging
};
