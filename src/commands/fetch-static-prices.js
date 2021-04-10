import supportedCurrencies from "../supported-currencies";

export default async function () {
  return await fetch(
    "https://api.blockchain.com/v3/exchange/tickers/?cors=true"
  )
    .then((response) => response.json())
    .then((data) => {
      const prices = [];
      // data.last_trade_price
      for (const pair of data) {
        if (pair.symbol.substr(0, 4) === "BTC-") {
          const currency = pair.symbol.substring(4).toLowerCase();

          if (currency in supportedCurrencies) {
            prices.push([currency, pair.last_trade_price]);
          }
        }
      }

      return prices;
    });
}
