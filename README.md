# node-machinetalk-example

A web-interface for Machinekit using [node-machinetalk](https://github.com/bobvanderlinden/node-machinetalk).

## Requirements

Machinekit needs available on your network and needs to be configured to use `mkwrapper`.
[mkwrapper-sim](https://github.com/strahlex/mkwrapper-sim) is an example configuration that supports `mkwrapper` as well as other related Machinetalk features.
If you want to use `mkwrapper` on an existing configuration, simply set the `DISPLAY` to `mkwrapper` like:
```ini
[DISPLAY]
DISPLAY = mkwrapper
```

Additionally, Avahi or Bonjour needs to be running on the system where `node-machinetalk-example` is installed.

## Installation

```
git clone https://github.com/bobvanderlinden/node-machinetalk-example
cd node-machinetalk-example
npm install
```
