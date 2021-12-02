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
 * Verifies that the request brand is white listed, ensuring
 * that deactivated brand plays have no access.
 *
 * @param {any} req The request to retrieve the brand.
 */
const verifyBrand = req => {
    if (!req.query.brand) return;
    if (config.conf.WHITELIST.includes(req.query.brand)) return;
    throw new Error(`Invalid ${req.query.brand} brand`);
};

module.exports = {
    init: init,
    destroy: destroy,
    verifyBrand: verifyBrand,
    verifyKey: verifyKey
};
