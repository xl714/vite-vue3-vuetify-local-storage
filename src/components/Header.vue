<script setup lang="ts">
// https://vuejs.org/api/sfc-script-setup.html#typescript-only-features
import { Profile } from '../modules/profile';
export interface Props {
  profile?: Profile | null;
}
const props = withDefaults(defineProps<Props>(), {
  profile: null,
});

const emits = defineEmits<{
  (e: 'onEmitOpenProfiles'): void;
}>();

const emitOpenProfiles = () => {
  console.log('Before onEmitOpenprofiles');
  emits('onEmitOpenProfiles');
  console.log('After onEmitOpenprofiles');
};
</script>

<template>
  <v-app-bar app color="teal" dark>
    <v-app-bar-nav-icon><i-mdi:fire /></v-app-bar-nav-icon>
    <v-toolbar-title
      >{{ profile.id ? `${profile.name}'s` : `` }} Calories
      CountDown</v-toolbar-title
    >
    <v-spacer />
    <v-btn @click="emitOpenProfiles"> <i-mdi:account /> Profiles </v-btn>
  </v-app-bar>
</template>

<style lang="scss" scoped>
/*
header {
  .v-card {
    cursor: pointer;
    .v-avatar {
      display: inline-flex;
    }
    .v-card-title {
      display: inline-flex;
      font-size: 0.9em;
    }
    .v-card-subtitle {
      display: inline-flex;
      font-size: 0.7em;
    }
  }
  .selected {
    border: 1px solid gold;
  }
  svg {
    align-self: center;
    font-size: 2em;
    color: rgb(0, 120, 207);
  }
  /*********
  display: grid;
  grid-template-columns: repeat(11, min-content);
  grid-column-gap: 0.5rem;
  justify-content: center;
  svg {
    align-self: center;
    &:nth-child(even) {
      font-size: 2em;
    }
    &:last-of-type {
      color: rgb(0, 120, 207);
    }
  }
 
}
 */
</style>
