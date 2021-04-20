<template>
  <div class="currency">
    <RadioBarInput
      v-for="currency in Object.keys(supportedCurrencies)"
      :key="currency"
      :value="currency"
      v-model="currentCurrency"
    >
      {{
        supportedCurrencies[currency].charAt(0).toUpperCase() +
        supportedCurrencies[currency].slice(1)
      }}
    </RadioBarInput>
  </div>
</template>

<script>
import supportedCurrencies from "@/supported-currencies";
import RadioBarInput from "@/components/RadioBarInput";

export default {
  name: "CurrencySwitcher",
  components: { RadioBarInput },
  data() {
    return {
      supportedCurrencies: supportedCurrencies,
      currentCurrency: null,
    };
  },
  mounted() {
    this.currentCurrency = this.modelValue;
  },
  watch: {
    modelValue(newValue) {
      this.currentCurrency = newValue;
    },
    currentCurrency(newValue) {
      this.$emit("update:modelValue", newValue);
    },
  },
  props: {
    modelValue: String,
  },
};
</script>

<style scoped>
div {
  margin-bottom: 5px;
}
</style>
