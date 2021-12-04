# Simple (HTTP) Proxy

Simple HTTP proxy for node.js that pipelines content from back-end to front-end server with minimal buffer and minimal latency.

## Installation

```bash
npm install
npm start
```

## Configuration

| Name              | Type   | Default                      | Description                                                                                                                                     |
| ----------------- | ------ | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **HOSTNAME**      | `str`  | `127.0.0.1`                  | The address of the server that serves the app.                                                                                                  |
| **PORT**          | `int`  | `3000`                       | The port the server will listen at.                                                                                                             |
| **KEY**           | `str`  | `null`                       | Secret key that should be passed in protected calls so that the server side "trusts" the client side (authentication).                          |
| **TARGET**        | `str`  | `https://app.platforme.com/` | The target server that the server will proxy to.                                                                                                |
| **PRX_TARGET**    | `str`  | `https://app.platforme.com/` | The same as `TARGET`.                                                                                                                           |
| **PRX_KEEPALIVE** | `int`  | `600000`                     | The number of milliseconds to keep the back-end connections alive in the connection pool                                                        |
| **WHITELIST**     | `list` | `[]`                         | A list of query params and allowed values. Query params not in the list are not checked. (e.g. `WHITELIST="param1:val1,val2;param2:val1,val2"`) |

## License

Simple (HTTP) Proxy is currently licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/).

## Build Automation

[![Build Status](https://github.com/ripe-tech/simple-proxy/workflows/Main%20Workflow/badge.svg)](https://github.com/ripe-tech/simple-proxy/actions)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](https://www.apache.org/licenses/)
