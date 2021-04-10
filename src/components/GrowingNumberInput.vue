<template>
  <input
    ref="value-elm"
    :min:="min"
    type="number"
    v-bind:value="modelValue"
    v-on:focus="$emit('focus')"
    v-on:input="$emit('update:modelValue', parseFloat($event.target.value))"
  />
</template>

<script>
export default {
  name: "GrowingNumberInput",
  props: {
    modelValue: Number,
    min: Number,
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
