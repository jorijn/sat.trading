<template>
  <img v-bind:src="logoSrc" alt="Logo sat.trading" class="logo" />
</template>

<script>
import SatTradingLogoLight from "../../public/assets/logo-light_sat-trading.svg";
import SatTradingLogoDark from "../../public/assets/logo-dark_sat-trading.svg";

export default {
  name: "Logo",
  data() {
    return {
      logoSrc: SatTradingLogoDark,
    };
  },
  created() {
    let isLightcolorScheme = window.matchMedia("(prefers-color-scheme: light)")
      .matches;

    if (isLightcolorScheme) {
      this.logoSrc = SatTradingLogoLight;
    } else {
      this.logoSrc = SatTradingLogoDark;
    }
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", this.darkModeListener);
  },
  methods: {
    darkModeListener(e) {
      if (e.matches) {
        this.logoSrc = SatTradingLogoDark;
      } else {
        this.logoSrc = SatTradingLogoLight;
      }
    },
  },
};
</script>

<style scoped>
.logo {
  height: 24px;
  margin: 20px 0;
}
@media (min-width: 768px) {
  .logo {
    height: 34px;
  }
}
</style>
