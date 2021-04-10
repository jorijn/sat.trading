<template>
  <div class="locale-changer">
    <select v-model="locale">
      <option
        v-for="locale in locales"
        :key="`locale-${locale.code}`"
        :value="locale.code"
      >
        {{ locale.name }}
      </option>
    </select>
  </div>
</template>

<script>
import { getSupportedLocales } from "@/i18n";
import { useI18n } from "vue-i18n";

export default {
  name: "LanguageSwitcher",
  setup() {
    const { t, locale } = useI18n();

    return { t, locale };
  },
  data: () => ({ locales: getSupportedLocales() }),
};
</script>

<style scoped>
div {
  display: inline;
  margin: 0 3px;
}
</style>
