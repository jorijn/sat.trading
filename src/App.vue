<template>
  <Entry />
</template>

<script>
import Entry from "./components/Entry.vue";

export default {
  name: "App",
  components: {
    Entry,
  },
};
</script>

<style>
:root {
  --color-light: #ffffff;
  --color-light-text: #eeeef0;
  --color-dark: #2c3e50;
  --color-primary: #42b983;

  --color-background: var(--color-light);
  --color-text: var(--color-dark);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--color-dark);
    --color-text: var(--color-light-text);
  }
}

html {
  background-color: var(--color-background);
}

#app {
  font-family: "Nunito", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--color-text);
  margin-top: 60px;
  background-color: var(--color-background);
}

.centered {
}

@media only screen and (min-width: 768px) and (min-height: 768px) {
  .centered {
    max-width: 600px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

p.authors a {
  color: inherit;
  text-decoration: inherit;
}
</style>
