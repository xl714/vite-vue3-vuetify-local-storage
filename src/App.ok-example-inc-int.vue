<template>
  <v-btn @click="inc">{{ count }}</v-btn>
  <div v-if="count === 0">= zéro</div>
  <div v-if="count !== 0">!= zéro</div>
</template>

<script setup lang="ts">
const count = ref(0);
const inc = () => count.value++;
</script>
