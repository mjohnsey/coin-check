import {Command, flags} from '@oclif/command'
import bitbar = require('bitbar')
import * as _ from 'lodash'

import {CoinbaseStore} from '../stores/coinbase'
import {Config} from '../utils'

export class CryptoCurrency {
  // eslint-disable-next-line no-useless-constructor
  constructor(readonly name: string, readonly symbol: string) { }
}

export const BTC = new CryptoCurrency('BTC', 'Ƀ')
export const LTC = new CryptoCurrency('LTC', 'Ł')
export const ETH = new CryptoCurrency('ETH', 'Ξ')
export const KNOWN_CRYPTOS: Record<string, CryptoCurrency> = {BTC, LTC, ETH}

export default class PriceCommand extends Command {
  static description = 'check coin cost and Coinbase wallet contents'

  static examples = [
    `$ coin-check price
    {"balance":"495.6879068","usdBalance":140.4328451876012,"crypto":{"name":"XLM","symbol":""},"currentPrice":"0.283309"}
`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    format: flags.string({char: 'f', description: 'name to print', options: ['json', 'bitbar'], default: 'json'}),
    bigMoney: flags.boolean({description: 'indicate whether this is a big amount', default: false}),
  }

  static args = [{name: 'crypto', required: true}]

  static async getResult(coinbaseStore: CoinbaseStore, cryptoName: string, cryptoSymbol: string|undefined) {
    const accounts = await coinbaseStore.getCoinbaseAccounts()
    const cryptoAccounts = _.filter(accounts, account => {
      return account.currency === cryptoName
    })
    const totalBalance = _.sumBy(cryptoAccounts, acct => acct.balance)
    const currentPrice = await coinbaseStore.getCurrentSpotPriceFiat(cryptoName)
    const balancePrice = totalBalance * currentPrice
    const result: any = {balance: totalBalance,
      usdBalance: balancePrice.toFixed(2),
      crypto: {
        name: cryptoName,
        symbol: cryptoSymbol,
      },
      currentPrice: currentPrice.toFixed(2)}
    return result
  }

  async run() {
    const {args, flags} = this.parse(PriceCommand)
    const format = flags.format
    const bigMoney = flags.bigMoney
    const cryptoName = args.crypto
    const config = Config.loadConfig(this.config.configDir)

    const coinbaseStore = new CoinbaseStore(config.ConfigToml.coinbase.key,
      config.ConfigToml.coinbase.passphrase,
      config.ConfigToml.coinbase.secret)

    const parsedCrypto = KNOWN_CRYPTOS[cryptoName]
    const symbol = `${parsedCrypto?.symbol} ` || ''
    const name = parsedCrypto?.name || cryptoName

    const result = await PriceCommand.getResult(coinbaseStore, name, symbol)
    if (bigMoney) {
      result.isBigMoney = (config.ConfigToml.bigMoney &&
        config.ConfigToml.bigMoney[name] &&
        _.toNumber(result.currentPrice) > config.ConfigToml.bigMoney[name])
    }
    switch (format) {
    case 'json': {
      this.log(JSON.stringify(result))
      break
    }
    case 'bitbar': {
      const bigMoneySymbol = config.ConfigToml.bigMoney?.symbol || '🤑'
      const bigMoneyIndicator = result.isBigMoney || false ? bigMoneySymbol : ''
      bitbar([
        {text: `${bigMoneyIndicator}${symbol}${result.currentPrice}`},
        bitbar.separator,
        {text: name},
        {text: `Wallet Balance: ${symbol}${result.balance.toString()}`},
        {text: `Wallet Balance: $${result.usdBalance}`},
        bitbar.separator,
        {text: 'Coinbase', href: 'https://coinbase.com'},
      ])
      break
    }
    }
  }
}
