mini-logger
------------

A really simple logger for web server or others.

## Install

```
npm install mini-logger
```

## Goal

Log levels for logger is useless. Just let [debug](https://github.com/visionmedia/debug) module handle the debug log. All you need is error log and some custom categories. `mini-logger` just write logs into different files or stdout, do not care about formats(except Error).

## Features

* rolling log files based on datetime
* easy to extended
* custom categories
* encoding support

## Usage

### Example

```js
var path = require('path');
var Logger = require('mini-logger');
var logger = Logger({
  dir: path.join(__dirname, 'logs'),
  categories: [ 'http' ],
  format: '[{category.}]YYYY-MM-DD[.log]'
});

logger.error(new Error('error'));
logger.http('http request url: %s', 'https://github.com');
```

### Options

* **dir**: log directory path, required.
* **categories**: custom categories, all categories will add a method to Logger's instance
* **format**: log file name's format, will pase to momentjs to format. `{category}` will replace with logger category, default is `[{category.}]YYYY-MM-DD[.log]`
* **stdout**: write logs into stdout, default is `false`
* **file**: write logs into file, default is `true`
* **errorFormater**: formater for errors, default is [error-formater](https://github.com/node-modules/error-formater)
* **encoding**: output logs' encoding, default is `utf-8`
* **flushInterval**: all logs will cache in memory first, every `flushInterval` ms flush into files. default is `1s`
* **duration**: cut the logs every `duration` ms. default is `1h`
* **mkdir**: everytime before create a writeStream, will try to `mkdirp` first. useful when format is like `YYYY/MM/DD/[{category}.log]`, default to false

### Events

Logger will emit an error event when any write streams emit an error. If you don't listen this `error` event, it will default hanlde by:

```
function onerror(err) {
  console.error(err.stack);
}
```

## License

MIT
