import * as coinbase from 'coinbase-pro'
import * as _ from 'lodash'

export class CoinbaseStore {
  public client: any

  constructor(key: string, passphrase: string, secret: string) {
    this.client = new coinbase.AuthenticatedClient(key, secret, passphrase)
  }

  async getCoinbaseAccounts() {
    const accounts = await this.client.getCoinbaseAccounts()
    return accounts
  }

  async getCurrentSpotPriceFiat(crypto: string, fiat = 'USD'): Promise<number> {
    return this.getCurrentSpotPrice(`${crypto}-${fiat}`)
  }

  async getCurrentSpotPrice(currencyPair: string): Promise<number> {
    const ticker = await this.client.getProductTicker(currencyPair)
    return _.toNumber(ticker.price)
  }
}
