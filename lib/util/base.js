const config = require("./config");

const init = () => {};

const destroy = () => {};

/**
 * Verifies that the key present in the request matches
 * the one defined in the current configuration, ensuring
 * that proper security measures are in place.
 *
 * @param {any} req The request to retrieve the key.
 */
const verifyKey = req => {
    if (!config.conf.KEY) {
        return;
    }
    const _key = req.query.key || req.headers["X-Proxy-Key"] || null;
    if (config.conf.KEY === _key) {
        return;
    }
    throw new Error("Invalid key");
};

/**
 * Verifies that the request query params are white listed, ensuring
 * that proper security measures are in place.
 *
 * @param {any} req The request to retrieve the query params.
 */
const verifyQuery = req => {
    const WHITELIST = config.conf.WHITELIST;
    Object.keys(req.query).forEach(param => {
        const value = req.query[param];
        if (WHITELIST[param] !== undefined && !WHITELIST[param].includes(value)) {
            throw new Error(`Restricted value '${value}' for param '${param}'`);
        }
    });
};

module.exports = {
    init: init,
    destroy: destroy,
    verifyKey: verifyKey,
    verifyQuery: verifyQuery
};
