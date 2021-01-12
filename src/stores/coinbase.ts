import * as coinbase from 'coinbase-pro'

export class CoinbaseStore {
  public client: any

  constructor(key: string, passphrase: string, secret: string) {
    this.client = new coinbase.AuthenticatedClient(key, secret, passphrase)
  }

  async getCoinbaseAccounts() {
    const accounts = await this.client.getCoinbaseAccounts()
    return accounts
  }

  async getCurrentSpotPriceFiat(crypto: string, fiat = 'USD') {
    return this.getCurrentSpotPrice(`${crypto}-${fiat}`)
  }

  async getCurrentSpotPrice(currencyPair: string) {
    const ticker = await this.client.getProductTicker(currencyPair)
    return ticker.price
  }
}
