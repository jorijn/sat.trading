<template>
  <input
    ref="value-elm"
    :min:="min"
    type="number"
    :lang="localeStrings[locale ?? defaultCurrency]"
    v-bind:value="modelValue"
    :step="step"
    v-on:focus="$emit('focus')"
    v-on:input="$emit('update:modelValue', parseFloat($event.target.value))"
  />
</template>

<script>
import { useI18n } from "vue-i18n";
import { defaultCurrency, localeStrings } from "@/supported-locales";

export default {
  name: "GrowingNumberInput",
  props: {
    modelValue: Number,
    min: Number,
    step: {
      type: String,
      default: "0.01",
    },
  },
  setup() {
    const { t, locale } = useI18n();

    return { t, locale };
  },
  data() {
    return {
      localeStrings,
      defaultCurrency,
    };
  },
  methods: {
    setWidthFromValue() {
      if (this.modelValue.toString().length > 2) {
        this.$refs["value-elm"].style.width =
          this.modelValue.toString().length + "rem";
      } else {
        this.$refs["value-elm"].style.width = "2rem";
      }
    },
  },
  watch: {
    modelValue() {
      this.setWidthFromValue();
    },
  },
  mounted() {
    this.setWidthFromValue();
  },
};
</script>

<style scoped>
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
