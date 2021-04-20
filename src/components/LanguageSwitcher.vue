<template>
  <div class="locale-changer">
    <RadioBarInput
      v-for="availableLocale in locales"
      :key="availableLocale.code"
      :value="availableLocale.code"
      v-model="locale"
    >
      {{ availableLocale.name }}
    </RadioBarInput>
  </div>
</template>

<script>
import { getSupportedLocales } from "@/i18n";
import { useI18n } from "vue-i18n";
import RadioBarInput from "@/components/RadioBarInput";

export default {
  name: "LanguageSwitcher",
  components: { RadioBarInput },
  setup() {
    const { t, locale } = useI18n();

    return { t, locale };
  },
  data: () => ({ locales: getSupportedLocales() }),
};
</script>

<style scoped>
div {
  margin-bottom: 5px;
}
</style>
