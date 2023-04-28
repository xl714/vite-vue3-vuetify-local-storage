<script setup lang="ts">
// unplugin-auto-import will declare it on src/auto-imports.d.ts
const name = ref('');
const disabled = computed(() => {
  return name.value && name.value.trim().lenght > 0;
});
const sayHi = () => {
  name.value && alert(`Hi ${name.value}`);
};
</script>

<template>
  <section>
    <header>
      <h2>Form</h2>
    </header>
    <form @submit.prevent="sayHi">
      <v-text-field
        autofocus
        label="What's your name?"
        v-model="name"
      ></v-text-field>
      <v-btn
        type="submit"
        :disabled="disabled"
        variant="outlined"
        color="primary"
        text
      >
        Say hello
      </v-btn>
    </form>
  </section>
</template>

<style scoped>
section {
  padding: 1rem 1.5rem;
}
</style>
