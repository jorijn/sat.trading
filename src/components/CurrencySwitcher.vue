<template>
  <div class="currency">
    <select
      v-bind:value="modelValue"
      v-on:change="$emit('update:modelValue', $event.target.value)"
    >
      <option
        v-for="currency in Object.keys(supportedCurrencies)"
        :key="currency"
        :value="currency"
      >
        {{
          supportedCurrencies[currency].charAt(0).toUpperCase() +
          supportedCurrencies[currency].slice(1)
        }}
      </option>
    </select>
  </div>
</template>

<script>
import supportedCurrencies from "@/supported-currencies";

export default {
  name: "CurrencySwitcher",
  data() {
    return {
      supportedCurrencies: supportedCurrencies,
    };
  },
  props: {
    modelValue: String,
  },
};
</script>

<style scoped>
div {
  display: inline;
  margin: 0 3px;
}
</style>
