coin-check
==========



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/coin-check.svg)](https://npmjs.org/package/coin-check)
[![Downloads/week](https://img.shields.io/npm/dw/coin-check.svg)](https://npmjs.org/package/coin-check)
[![License](https://img.shields.io/npm/l/coin-check.svg)](https://github.com/mjohnsey/coin-check/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g coin-check
$ coin-check COMMAND
running command...
$ coin-check (-v|--version|version)
coin-check/1.0.0 darwin-x64 node-v16.0.0
$ coin-check --help [COMMAND]
USAGE
  $ coin-check COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`coin-check help [COMMAND]`](#coin-check-help-command)
* [`coin-check price CRYPTO`](#coin-check-price-crypto)

## `coin-check help [COMMAND]`

display help for coin-check

```
USAGE
  $ coin-check help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `coin-check price CRYPTO`

check coin cost and Coinbase wallet contents

```
USAGE
  $ coin-check price CRYPTO

OPTIONS
  -f, --format=json|bitbar  [default: json] name to print
  -h, --help                show CLI help
  --bigMoney                indicate whether this is a big amount

EXAMPLE
  $ coin-check price
     
  {"balance":"495.6879068","usdBalance":140.4328451876012,"crypto":{"name":"XLM","symbol":""},"currentPrice":"0.283309"}
```

_See code: [src/commands/price.ts](https://github.com/mjohnsey/coin-check/blob/v1.0.0/src/commands/price.ts)_
<!-- commandsstop -->
