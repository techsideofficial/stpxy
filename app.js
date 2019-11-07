// requires the multiple libraries
const https = require("https");
const express = require("express");
const process = require("process");
const util = require("hive-js-util");
const info = require("./package");
const lib = require("./lib");
const request = require("request");

// builds the initial application object to be used
// by the application for serving
const app = express();

// creates the HTTP connection pool/agent that is going
// to be used by the proxy
const agent = new https.Agent({
    protocol: "https:",
    keepAlive: true,
    keepAliveMsecs: lib.conf.PRX_KEEPALIVE
});

process.on("SIGINT", function() {
    process.exit();
});

process.on("SIGTERM", function() {
    process.exit();
});

process.on("exit", () => {
    util.Logging.info("Exiting on user's request");
    lib.destroy();
});

app.get("/info", (req, res, next) => {
    res.json({
        name: info.name,
        version: info.version,
        node: process.version
    });
});

app.options("*", (req, res, next) => {
    const headers = lib.proxyHeaders(req);
    Object.assign(headers, {
        "Content-Security-Policy":
            "default-src * ws://* wss://* data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline';",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS",
        "Access-Control-Allow-Origin": "*"
    });
    res.set(headers);
    res.send();
});

app.all("*", (req, res, next) => {
    async function clojure() {
        lib.verifyKey(req);
        await new Promise(function(resolve, reject) {
            try {
                // constructs the initial options object with the
                // processed headers and query string
                const options = {
                    agent: agent,
                    baseUrl: lib.conf.PRX_TARGET,
                    uri: req.path,
                    method: req.method,
                    headers: lib.proxyHeaders(req),
                    qs: req.query,
                    qsStringifyOptions: {
                        arrayFormat: "repeat"
                    },
                    forever: true
                };

                // runs the changed request with the transformed values so
                // that they become compliant with the expected API
                request(options)
                    .on("finish", resolve)
                    .on("error", reject)
                    .pipe(res);
            } catch (err) {
                reject(err);
            }
        });
    }
    clojure().catch(next);
});

(async () => {
    await lib.start();
    try {
        app.listen(lib.conf.PORT, lib.conf.HOST, () => {
            try {
                util.Logging.info("Listening on " + lib.conf.HOST + ":" + String(lib.conf.PORT));
                lib.init();
            } catch (err) {
                util.Logging.error(err);
            }
        });
    } finally {
        await lib.stop();
    }
})();
