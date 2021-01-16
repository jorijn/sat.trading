<template>
  <div class="centered">
    <h1>Hoeveel sat krijg je voor een euro?</h1>
    <p class="info">
      <span ref="sat-elm" class="sat"
        ><input class="eur" ref="eur-elm" type="number" min="1" v-model="eur" />
        euro = {{ calculatedSat }} sat.</span
      >
    </p>
    <p>
      Op 22 mei 2010 kocht Laszlo Hanyecz 2 pizza’s. Hij betaalde hier 10.000
      Bitcoin voor. Tegenwoordig zou je voor 2 pizza’s ongeveer
      <strong>{{ pizzaPriceInBitcoinFormatted }}</strong> Bitcoin betalen.
      Klinkt niet echt lekker vinden wij. Wij hebben het liever over
      {{ pizzaPriceInSatFormatted }}
      Satoshi. Sa-watte?! Een Satoshi is de kleinst mogelijke eenheid van
      Bitcoin (0.00000001 BTC).
    </p>
    <p>
      Wij vinden het belangrijk om het te hebben over Satoshi in plaats van
      Bitcoin. Veel mensen weten namelijk niet dat een Bitcoin überhaupt
      deelbaar is. Omdat het nog een beetje lastig is om snel de waarde van 1
      Euro in Satoshi om te zetten, hebben we deze website gemaakt.
    </p>
    <h3>Meer informatie over Bitcoin</h3>
    <ul>
      <li>
        <a href="https://bitcoin.nl/" target="_blank" rel="noopener"
          >Bitcoin.nl</a
        >
      </li>
      <li>
        <a href="https://bitonic.nl" target="_blank" rel="noopener"
          >Bitcoin kopen</a
        >
      </li>
      <li>
        <a href="https://beginnenmetbitcoin.com/" target="_blank" rel="noopener"
          >Beginnen met Bitcoin (podcast)</a
        >
      </li>
      <li>
        <a href="https://satoshiradio.nl/" target="_blank" rel="noopener"
          >Satoshi Radio (podcast)</a
        >
      </li>
    </ul>
    <p class="authors">
      door <a href="https://jorijn.com/">Jorijn</a> &
      <a href="https://satoshiradio.nl">Satoshi Radio</a>
    </p>
    <p>
      <a
        href="https://github.com/jorijn/sat.trading"
        target="_blank"
        rel="noopener"
      >
        <img :src="GitHubLogo" alt="GitHub" width="16" />
      </a>
    </p>
  </div>
</template>

<script>
import GitHubLogo from "../../public/assets/github.png";

const defaultPizzaPriceInEur = 20;

export default {
  name: "Entry",
  props: {
    msg: String,
  },
  data() {
    return {
      websocket: null,
      eur: 1,
      sat: 3200,
      GitHubLogo,
    };
  },
  computed: {
    calculatedSat() {
      return this.format(this.eur * this.sat, 0);
    },
    pizzaPriceInBitcoin() {
      return (this.sat * defaultPizzaPriceInEur) / 100000000;
    },
    pizzaPriceInSat() {
      return this.sat * defaultPizzaPriceInEur;
    },
    pizzaPriceInBitcoinFormatted() {
      return this.format(this.pizzaPriceInBitcoin, 5);
    },
    pizzaPriceInSatFormatted() {
      return this.format(this.pizzaPriceInSat, 0);
    },
  },
  mounted() {
    this.initWebsocket();
    this.parseValueFromUrl();

    fetch("https://api.blockchain.com/v3/exchange/tickers/BTC-EUR?cors=true")
      .then((response) => response.json())
      .then((data) => this.setSatFromPrice(data.last_trade_price));

    window.onhashchange = this.parseValueFromUrl;
  },
  watch: {
    eur() {
      // auto adapt the width of the input field to match the size of the number
      if (this.eur.toString().length > 2) {
        this.$refs["eur-elm"].style.width = this.eur.toString().length + "rem";
      } else {
        this.$refs["eur-elm"].style.width = "2rem";
      }

      window.location.hash = "#" + this.eur.toString();
    },
  },
  methods: {
    setSatFromPrice(price) {
      this.sat = parseInt(((1 / price) * 100000000).toFixed(0));
    },
    parseValueFromUrl() {
      if (window.location.hash) {
        const rawValue = window.location.hash.substr(1);
        if (!isNaN(parseFloat(rawValue))) {
          this.eur = rawValue;
        }
      }
    },
    format: function (value, digits) {
      return value.toLocaleString("nl-NL", { minimumFractionDigits: digits });
    },
    initWebsocket() {
      let ws;
      ws = new WebSocket("wss://ws.bitstamp.net");

      ws.onopen = function () {
        ws.send(
          JSON.stringify({
            event: "bts:subscribe",
            data: {
              channel: "live_trades_btceur",
            },
          })
        );
      };

      ws.onmessage = (evt) => {
        let response = JSON.parse(evt.data);

        switch (response.event) {
          case "trade": {
            this.setSatFromPrice(response.data.price);
            break;
          }
          case "bts:request_reconnect": {
            this.initWebsocket();
            break;
          }
        }
      };

      ws.onclose = function () {
        this.initWebsocket();
      };
    },
  },
};
</script>

<style scoped>
input[type="number"].eur {
  border: 0;
  border-bottom: 1px solid #42b983;
  background: inherit;
  font: inherit;
  width: 2rem;
  text-align: center;
}

input[type="number"].eur:focus {
  outline: 1px solid #42b983;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
