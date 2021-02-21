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
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
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
