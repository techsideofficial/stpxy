// requires the multiple libraries
const https = require("https");
const bodyParser = require("body-parser");
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
    keepAliveMsecs: 30000
});

// ensures that the content type is exposed in the request
// object and that the body is parsed accordingly (JSON
// and URL encoding)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.all("*", (req, res, next) => {
    async function clojure() {
        lib.verifyKey(req);
        await new Promise(function(resolve, reject) {
            try {
                // constructs the initial options object with the
                // processed headers and query string
                const options = {
                    agent: agent,
                    baseUrl: lib.TARGET,
                    uri: req.path,
                    method: req.method,
                    headers: lib.proxyHeaders(req),
                    qs: req.query,
                    forever: true
                };

                // runs the changed request with the transformed values so
                // that they become compliant with the RIPE API
                request(options)
                    .pipe(res)
                    .on("finish", resolve)
                    .on("error", reject);
            } catch (err) {
                reject(err);
            }
        });
    }
    clojure().catch(next);
});

app.listen(lib.PORT, lib.HOSTNAME, () => {
    lib.startLogging();
    util.Logging.info("Listening on " + lib.HOSTNAME + ":" + String(lib.PORT));
    lib.init();
});
