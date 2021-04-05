import { createI18n } from "vue-i18n";
import supportedLocales from "./supported-locales";

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages() {
  const locales = require.context(
    "./locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages = {};
  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key).default;
    }
  });

  return messages;
}

function getBrowserLocale(options = {}) {
  const defaultOptions = { countryCodeOnly: false };

  const opt = { ...defaultOptions, ...options };

  const navigatorLocale =
    navigator.languages !== undefined
      ? navigator.languages[0]
      : navigator.language;

  if (!navigatorLocale) {
    return undefined;
  }

  return opt.countryCodeOnly
    ? navigatorLocale.trim().split(/-|_/)[0]
    : navigatorLocale.trim();
}

export function getSupportedLocales() {
  let annotatedLocales = [];

  for (const code of Object.keys(supportedLocales)) {
    annotatedLocales.push({
      code,
      name: supportedLocales[code],
    });
  }

  return annotatedLocales;
}

function supportedLocalesInclude(locale) {
  return Object.keys(supportedLocales).includes(locale);
}

function getStartingLocale() {
  const browserLocale = getBrowserLocale({ countryCodeOnly: true });

  if (supportedLocalesInclude(browserLocale)) {
    return browserLocale;
  } else {
    return "en";
  }
}

export default createI18n({
  legacy: false,
  locale: getStartingLocale(),
  fallbackLocale: "en",
  messages: loadLocaleMessages(),
});
