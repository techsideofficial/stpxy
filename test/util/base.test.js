const assert = require("assert");

const config = require("../../lib/util/config");

const lib = require("../../lib");

describe("Base", function() {
    describe("#init()", function() {
        it("should do nothing", () => {
            lib.init();
        });
    });

    describe("#destroy", function() {
        it("should do nothing", () => {
            lib.destroy();
        });
    });

    describe("#verifyKey()", function() {
        beforeEach(async () => {
            await lib.start();
        });

        it("should allow a request if no server key is defined", () => {
            const key = config.conf.KEY;
            config.conf.KEY = null;
            try {
                lib.verifyKey({});
            } finally {
                config.conf.KEY = key;
            }
        });

        it("should allow a request if both the request query key and server keys match", () => {
            const key = config.conf.KEY;
            config.conf.KEY = "key";
            try {
                lib.verifyKey({
                    query: {
                        key: "key"
                    }
                });
            } finally {
                config.conf.KEY = key;
            }
        });

        it("should allow a request if both the request header key and server keys match", () => {
            const key = config.conf.KEY;
            config.conf.KEY = "key";
            try {
                lib.verifyKey({
                    query: {},
                    headers: {
                        "X-Proxy-Key": "key"
                    }
                });
            } finally {
                config.conf.KEY = key;
            }
        });

        it("should fail for a request with no defined key", () => {
            const key = config.conf.KEY;
            config.conf.KEY = "key";
            try {
                assert.rejects(
                    () =>
                        lib.verifyKey({
                            query: {},
                            headers: {}
                        }),
                    err => {
                        assert.strictEqual(err.name, "Error");
                        assert.strictEqual(err.message, "Invalid key");
                        return true;
                    }
                );
            } finally {
                config.conf.KEY = key;
            }
        });
    });

    describe("#verifyBrand", function() {
        beforeEach(async () => {
            await lib.start();
        });

        it("should allow non-brand specific requests", () => {
            lib.verifyBrand({
                query: {}
            });
        });

        it("should allow requests for white listed brands", () => {
            const whiteList = config.conf.WHITELIST;
            config.conf.WHITELIST = ["dummy"];
            try {
                lib.verifyBrand({
                    query: {
                        brand: "dummy"
                    }
                });
            } finally {
                config.conf.WHITELIST = whiteList;
            }
        });

        it("should fail for non white listed brands", () => {
            assert.rejects(
                () =>
                    lib.verifyBrand({
                        query: {
                            brand: "unknown"
                        }
                    }),
                err => {
                    assert.strictEqual(err.name, "Error");
                    assert.strictEqual(err.message, "Invalid 'unknown' brand");
                    return true;
                }
            );
        });
    });
});
