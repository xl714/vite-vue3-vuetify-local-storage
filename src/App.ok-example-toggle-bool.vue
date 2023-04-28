<template>
  <v-btn @click="toggle">{{ myBool }}</v-btn>
  <div v-if="myBool">TRUE</div>
  <div v-if="!myBool">FALSE</div>
</template>

<script setup lang="ts">
const myBool = ref(false);
const toggle = () => {
  console.log('toggle');
  console.log('myBool before', myBool);
  myBool.value = !myBool.value;
  console.log('myBool after', myBool);
};
</script>
