<template>
  <div class="centered">
    <h1>{{ t("heading") }}</h1>
    <p class="info">
      <span>
        <input
          ref="eur-elm"
          type="number"
          min="1"
          v-model="eur"
          @focus="lastChanged = 'eur'"
        />
        euro =
        <input
          ref="sat-elm"
          type="number"
          min="1"
          v-model="sat"
          @focus="lastChanged = 'sat'"
        />
        sat.
      </span>
    </p>
    <i18n-t keypath="pizza_explanation" tag="p" class="story-start">
      <template v-slot:bitcoin>
        <strong>{{ pizzaPriceInBitcoinFormatted }}</strong>
      </template>
      <template v-slot:sat>
        <strong>{{ pizzaPriceInSatFormatted }}</strong>
      </template>
    </i18n-t>
    <i18n-t keypath="our_cause" tag="p"> </i18n-t>
    <i18n-t keypath="stream_sat" tag="p">
      <template v-slot:stream_sat_minute>
        <strong
          >{{ streamingPriceInSatFormatted }}
          {{ t("stream_sat_minute_suffix") }}</strong
        >
      </template>
      <template v-slot:stream_sat_wallet>
        <a href="https://breez.technology/" target="_blank" rel="noopener"
          >Breez</a
        >
      </template>
    </i18n-t>
    <h3>{{ t("more_information_heading") }}</h3>
    <ul>
      <li v-for="link of information_links" :key="link.href">
        <a :href="link.href" target="_blank" rel="noopener">{{ link.label }}</a>
      </li>
    </ul>
    <p class="authors">
      {{ t("by") }} <a href="https://jorijn.com/">Jorijn</a>,
      <a href="https://satoshiradio.nl">Satoshi Radio</a> &
      <a href="https://github.com/Lexus123">Lex</a>
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
    <p>
      <LanguageSwitcher />
    </p>
  </div>
</template>

<script>
import GitHubLogo from "../../public/assets/github.png";
import { useI18n } from "vue-i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const defaultPizzaPriceInEur = 20;

export default {
  name: "Entry",
  components: { LanguageSwitcher },
  props: {
    msg: String,
  },
  data() {
    return {
      websocket: null,
      eur: 1,
      sat: 10,
      rate: 2000,
      lastChanged: "eur",
      GitHubLogo,
    };
  },
  computed: {
    information_links() {
      const data = this.t("information_links");
      const links = [];
      for (let link of data.split("**")) {
        let [href, label] = link.split("##");
        links.push({ href, label });
      }
      return links;
    },
    pizzaPriceInBitcoin() {
      return (this.rate * defaultPizzaPriceInEur) / 100000000;
    },
    pizzaPriceInSat() {
      return this.rate * defaultPizzaPriceInEur;
    },
    pizzaPriceInBitcoinFormatted() {
      return this.format(this.pizzaPriceInBitcoin, 5);
    },
    pizzaPriceInSatFormatted() {
      return this.format(this.pizzaPriceInSat, 0);
    },
    streamingPriceInSatFormatted() {
      return (this.sat / 60).toFixed(0);
    },
  },
  mounted() {
    this.initWebsocket();
    this.parseValueFromURL();

    fetch("https://api.blockchain.com/v3/exchange/tickers/BTC-EUR?cors=true")
      .then((response) => response.json())
      .then((data) => {
        this.setRateFromPrice(data.last_trade_price);
        this.sat = (this.eur * this.rate).toFixed(0);
      });

    window.onhashchange = this.parseValueFromURL;
  },
  watch: {
    eur() {
      if (this.eur.toString().length > 2) {
        this.$refs["eur-elm"].style.width = this.eur.toString().length + "rem";
      } else {
        this.$refs["eur-elm"].style.width = "2rem";
      }

      if (this.lastChanged == "eur") {
        this.sat = (this.eur * this.rate).toFixed(0);
      }

      this.setURL();
    },
    sat() {
      if (this.sat.toString().length > 2) {
        this.$refs["sat-elm"].style.width = this.sat.toString().length + "rem";
      } else {
        this.$refs["sat-elm"].style.width = "2rem";
      }

      if (this.lastChanged == "sat") {
        if (this.sat / this.rate >= 1) {
          this.eur = (this.sat / this.rate).toFixed(2);
        } else {
          this.eur = (this.sat / this.rate).toFixed(3);
        }

        this.setURL();
      }
    },
  },
  setup() {
    const { t } = useI18n();

    return { t };
  },
  methods: {
    setRateFromPrice(price) {
      this.rate = parseInt(((1 / price) * 100000000).toFixed(0));

      if (this.lastChanged == "eur") {
        this.sat = (this.eur * this.rate).toFixed(0);
      } else {
        if (this.sat / this.rate >= 1) {
          this.eur = (this.sat / this.rate).toFixed(2);
        } else {
          this.eur = (this.sat / this.rate).toFixed(3);
        }
      }
    },
    parseValueFromURL() {
      if (window.location.hash) {
        const rawValue = window.location.hash.substr(1);
        if (!isNaN(parseFloat(rawValue))) {
          this.eur = rawValue;
        }
      }
    },
    setURL() {
      if (this.eur != 1) {
        window.location.hash = "#" + this.eur.toString();
      } else {
        window.location.hash = "";
      }
    },
    format: function (value, min, max) {
      return value.toLocaleString("nl-NL", {
        minimumFractionDigits: min,
        maximumFractionDigits: max,
      });
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
            this.setRateFromPrice(response.data.price);
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
p.info {
  font-weight: bold;
  font-size: 1.2rem;
}

.story-start {
  margin-top: 40px;
}

input[type="number"] {
  color: var(--color-text);
  border: 0;
  border-bottom: 1px solid #42b983;
  background: inherit;
  font: inherit;
  width: 2rem;
  text-align: center;
}

input[type="number"]:focus {
  outline: none;
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
