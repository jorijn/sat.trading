<template>
  <div class="centered">
    <h1>{{ t("heading", { currency: currencyLabel }) }}</h1>
    <p class="info">
      <span>
        <GrowingNumberInput
          v-model="fiat"
          @focus="inFocus = 'fiat'"
          step="0.01"
        />
        {{ currencyLabel }} =
        <GrowingNumberInput v-model="sat" @focus="inFocus = 'sat'" step="1" />
        sat.
      </span>
    </p>
    <i18n-t class="story-start" keypath="pizza_explanation" tag="p">
      <template v-slot:bitcoin>
        <strong>{{ pizzaPriceInBitcoinFormatted }}</strong>
      </template>
      <template v-slot:sat>
        <strong>{{ pizzaPriceInSatFormatted }}</strong>
      </template>
    </i18n-t>
    <p>
      {{
        t("our_cause", {
          currency:
            currencyLabel.charAt(0).toUpperCase() + currencyLabel.slice(1),
        })
      }}
    </p>
    <i18n-t keypath="stream_sat" tag="p">
      <template v-slot:stream_sat_minute>
        <strong
          >{{ streamingPriceInSatFormatted }}
          {{ t("stream_sat_minute_suffix") }}</strong
        >
      </template>
      <template v-slot:stream_sat_wallet>
        <a href="https://breez.technology/" rel="noopener" target="_blank"
          >Breez</a
        >
      </template>
    </i18n-t>
    <h3>{{ t("more_information_heading") }}</h3>
    <ul>
      <li v-for="link of informationLinks" :key="link.href">
        <a :href="link.href" rel="noopener" target="_blank">{{ link.label }}</a>
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
        rel="noopener"
        target="_blank"
      >
        <img :src="GitHubLogo" alt="GitHub" width="16" />
      </a>
    </p>
    <p class="switchers">
      <LanguageSwitcher />
      <CurrencySwitcher v-model="currency" />
    </p>
  </div>
</template>

<script>
import GitHubLogo from "../../public/assets/github.png";
import { useI18n } from "vue-i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import GrowingNumberInput from "@/components/GrowingNumberInput";
import { localeStringDefault, localeStrings } from "@/supported-locales";
import fetchStaticPrices from "@/commands/fetch-static-prices";
import currencyLabelMap, {
  bitstampSubscriptions,
  currencyLocaleMap,
  defaultCurrency,
} from "@/supported-currencies";
import CurrencySwitcher from "@/components/CurrencySwitcher";

const defaultPizzaPriceInFiat = 20;
const websockets = {};

export default {
  name: "Entry",
  components: { CurrencySwitcher, GrowingNumberInput, LanguageSwitcher },
  props: {
    msg: String,
  },
  data() {
    return {
      rates: { eur: 50000, usd: 60000 }, // last known prices as starting point
      fiat: 1,
      sat: 2000,
      inFocus: "fiat",
      currency: currencyLocaleMap[this.locale] ?? defaultCurrency,
      GitHubLogo,
    };
  },
  computed: {
    rate() {
      // the current rate of one euro/dollar (depending on settings) for sat
      if (!this.rates[this.currency]) {
        return 0;
      }

      return parseInt(((1 / this.rates[this.currency]) * 100000000).toFixed(0));
    },
    currencyLabel() {
      return currencyLabelMap[this.currency] ?? "unknown";
    },
    informationLinks() {
      const data = this.t("information_links");
      const links = [];
      for (let link of data.split("**")) {
        let [href, label] = link.split("##");
        links.push({ href, label });
      }
      return links;
    },
    pizzaPriceInBitcoin() {
      return (this.rate * defaultPizzaPriceInFiat) / 100000000;
    },
    pizzaPriceInSat() {
      return this.rate * defaultPizzaPriceInFiat;
    },
    pizzaPriceInBitcoinFormatted() {
      return this.format(this.pizzaPriceInBitcoin, 0, 5);
    },
    pizzaPriceInSatFormatted() {
      return this.format(this.pizzaPriceInSat, 0, 0);
    },
    streamingPriceInSatFormatted() {
      if (isNaN(this.sat)) {
        return "...";
      }

      return this.format(this.sat / 60, 0, 0);
    },
  },
  mounted() {
    this.initWebsocket();

    fetchStaticPrices().then((data) => {
      for (const [currency, price] of data) {
        this.rates[currency] = price;
      }
    });
  },
  watch: {
    sat(value) {
      if (this.inFocus === "sat" && !isNaN(value)) {
        this.fiat = parseFloat((value / this.rate).toFixed(3));
      }
    },
    fiat(value) {
      if (this.inFocus === "fiat" && !isNaN(value)) {
        this.sat = parseFloat((value * this.rate).toFixed(0));
      }
    },
    rate(value) {
      if (isNaN(this.fiat) || isNaN(this.sat)) {
        return;
      }

      if (this.inFocus === "fiat") {
        this.sat = parseFloat((this.fiat * value).toFixed(0));
      } else {
        this.fiat = parseFloat((this.sat / value).toFixed(3));
      }
    },
    locale() {
      this.currency = currencyLocaleMap[this.locale] ?? defaultCurrency;
    },
  },
  setup() {
    const { t, locale } = useI18n();

    return { t, locale };
  },
  methods: {
    format: function (value, min, max) {
      const localeString = localeStrings[this.locale] ?? localeStringDefault;
      return value.toLocaleString(localeString, {
        minimumFractionDigits: min,
        maximumFractionDigits: max,
      });
    },
    initWebsocket(requestedMarket) {
      let markets;
      if (requestedMarket) {
        markets = [requestedMarket];
      } else {
        markets = bitstampSubscriptions;
      }

      markets.forEach((market) => {
        websockets[market] = new WebSocket("wss://ws.bitstamp.net");

        websockets[market].onopen = function () {
          websockets[market].send(
            JSON.stringify({
              event: "bts:subscribe",
              data: {
                channel: "live_trades_" + market,
              },
            })
          );
        };

        websockets[market].onmessage = (evt) => {
          let response = JSON.parse(evt.data);

          switch (response.event) {
            case "trade": {
              this.rates[market.substr(3)] = response.data.price;
              break;
            }
            case "bts:request_reconnect": {
              this.initWebsocket();
              break;
            }
          }
        };

        websockets[market].onclose = function () {
          this.initWebsocket(market);
        };
      });
    },
  },
};
</script>

<style scoped>
p.info {
  font-weight: bold;
  font-size: 1.2rem;
}

p.switchers {
  margin-bottom: 100px;
}

.story-start {
  margin-top: 40px;
}
</style>
