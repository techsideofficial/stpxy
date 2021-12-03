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

    describe("#verifyQuery", function() {
        beforeEach(async () => {
            await lib.start();
            config.conf.WHITELIST = {
                brand: ["dummy"],
                param3: ["1", "2"]
            };
        });

        it("should allow requests with no query params", () => {
            lib.verifyQuery({
                query: {}
            });
        });

        it("should allow requests with no white listed params", () => {
            lib.verifyQuery({
                query: {
                    param1: "value1",
                    param2: "value2"
                }
            });
        });

        it("should allow requests for white list compliant param values", () => {
            lib.verifyQuery({
                query: {
                    brand: "dummy"
                }
            });

            lib.verifyQuery({
                query: {
                    param3: "1"
                }
            });

            lib.verifyQuery({
                query: {
                    brand: "dummy",
                    param3: "2"
                }
            });
        });

        it("should fail for non white list compliant param values", async () => {
            await assert.rejects(
                async () =>
                    lib.verifyQuery({
                        query: {
                            brand: "unknown"
                        }
                    }),
                err => {
                    assert.strictEqual(err.name, "Error");
                    assert.strictEqual(err.message, "Restricted value 'unknown' for param 'brand'");
                    return true;
                }
            );
        });
    });
});
