<template>
  <span
    ><input
      type="radio"
      :id="id"
      :name="name"
      :value="value"
      :checked="modelValue === value"
      v-on:change="$emit('update:modelValue', $event.target.value)" />
    <label :for="id"><slot /></label
  ></span>
</template>

<script>
export default {
  name: "RadioBarInput",
  data() {
    return {
      id: null,
    };
  },
  props: {
    name: String,
    value: String,
    modelValue: String,
  },
  mounted() {
    this.id = Math.random().toString(36).substring(7);
  },
};
</script>

<style scoped>
input[type="radio"],
input[type="checkbox"] {
  display: none;
}

input[type="radio"] + label,
input[type="checkbox"] + label {
  display: inline-block;
  padding: 4px 12px;
  margin: -2px -2px 0;
  font-size: 14px;
  line-height: 20px;
  color: #333;
  text-align: center;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
  vertical-align: middle;
  cursor: pointer;
  background-color: #f5f5f5;
  background-image: linear-gradient(to bottom, #fff, #e6e6e6);
  background-repeat: repeat-x;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom-color: #b3b3b3;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.05);
}

input[type="radio"]:checked + label,
input[type="checkbox"]:checked + label {
  background-image: none;
  outline: 0;
  -webkit-box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15),
    0 1px 2px rgba(0, 0, 0, 0.05);
  -moz-box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15),
    0 1px 2px rgba(0, 0, 0, 0.05);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.05);
  background-color: #e0e0e0;
}
</style>
