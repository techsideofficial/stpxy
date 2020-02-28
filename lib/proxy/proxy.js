function proxyHeaders(req) {
    const headers = Object.assign({}, req.headers || {});

    const skip = ["connection", "content-length", "host", "accept-encoding"];
    skip.forEach(header => {
        delete headers[header];
    });

    if (
        !headers["x-forwarded-for"] === undefined &&
        req.connection !== undefined &&
        req.connection.remoteAddress !== undefined
    ) {
        headers["x-forwarded-for"] = req.connection.remoteAddress;
    }
    if (!headers["x-forwarded-proto"] === undefined && req.protocol !== undefined) {
        headers["x-forwarded-proto"] = req.protocol;
    }

    return headers;
}

module.exports = {
    proxyHeaders: proxyHeaders
};
