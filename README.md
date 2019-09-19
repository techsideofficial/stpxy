# Simple (HTTP) Proxy

Simple HTTP proxy for node.js that pipelines content from back-end to front-end server with minimal buffer and minimal latency.

## Installation

```bash
npm install
npm start
```

## Configuration

| Name | Type | Description |
| ----- | ----- | ----- |
| **HOSTNAME** | `str` | The address of the server that serves the app (defaults to `127.0.0.1`). |
| **PORT** | `int` | The port the server will listen at (defaults to `3000`). |
| **KEY** | `str` | Secret key that should be passed in protected calls so that the server side "trusts" the client side (authentication) (defaults to `null`). |
| **TARGET** | `str` | The target server that the server will proxy to (defaults to `https://app.platforme.com/`). |
| **PRX_TARGET** | `str` | The same as `TARGET`. |
| **PRX_KEEPALIVE** | `int` | The number of milliseconds to keep the back-end connections alive in the connection pool (defaults to `600000`) |

## License

Simple (HTTP) Proxy is currently licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/).

## Build Automation

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://www.apache.org/licenses/)
