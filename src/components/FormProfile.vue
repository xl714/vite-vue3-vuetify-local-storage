<script setup lang="ts">
import IconAccount from '~icons/mdi/account';
import IconWeightKilogram from '~icons/mdi/weight-kilogram';
import { Profile } from '../modules/profile';
// unplugin-auto-import will declare it on src/auto-imports.d.ts

// https://vuejs.org/api/sfc-script-setup.html#typescript-only-features

// const props = defineProps<{
//   selectedProfileIndex?: number | null
// }>();
export interface Props {
  // profileId?: number | null;
  profile: Profile;
}

const props = withDefaults(defineProps<Props>(), {
  profile: new Profile(),
});
console.log('props.profile', props.profile);

const name = ref(props.profile.name);
const startWeight = ref(props.profile.startWeight);
const targetWeight = ref(props.profile.targetWeight);

const disabled = computed(() => {
  return !(
    name.value.trim().length > 0 &&
    startWeight.value > 0 &&
    targetWeight.value > 0
  );
});

const emits = defineEmits<{
  (
    e: 'onEmitSaveProfile',
    id: number,
    name: string,
    startWeight: number,
    targetWeight: number
  ): void;
  (e: 'onEmitRemoveProfile', id: number): void;
}>();

const emitSaveProfile = () => {
  //name.value && alert(`Hi ${name.value}`);
  console.log('before emit onEmitSaveProfile');
  emits(
    'onEmitSaveProfile',
    props.profile ? props.profile.id : null,
    name.value,
    startWeight.value,
    targetWeight.value
  );
  console.log('after emit onEmitSaveProfile');
};

const emitRemoveProfile = () => {
  //name.value && alert(`Hi ${name.value}`);
  console.log(`before emit emitRemoveProfile (id: ${props.profile.id})`);
  emits('onEmitRemoveProfile', props.profile.id);
  console.log('after emit emitRemoveProfile');
};

// https://stackblitz.com/edit/vite-kmhcnp?file=src%2FApp.vue
//
</script>

<template>
  <v-container>
    <!-- HEADER -->
    <header>
      <v-row class="mb-3">
        <v-col>
          <h2 class="text-h2">
            {{ profile.id ? `` : `New ` }} Profile
            {{ profile.id ? `Id:${profile.id}` : `` }}
          </h2>
        </v-col>
        <v-col>
          <!-- here are action buttons-->
        </v-col>
      </v-row>
    </header>

    <!-- FORM -->
    <form @submit.prevent="emitSaveProfile">
      <v-text-field
        autofocus
        label="What's your name?"
        v-model="name"
        :prepend-icon="IconAccount"
      ></v-text-field>

      <v-text-field
        label="What's your starting weight in kilogrammes ?"
        v-model="startWeight"
        :prepend-icon="IconWeightKilogram"
        type="number"
      ></v-text-field>
      <!--WeightKilogram-->
      <v-text-field
        label="What's your target weight in kilogrammes ?"
        v-model="targetWeight"
        :prepend-icon="IconWeightKilogram"
        type="number"
      ></v-text-field>
      <v-row>
        <v-col cols="6" class="text-left">
          <v-btn
            type="submit"
            :disabled="disabled"
            variant="outlined"
            color="primary"
            class="ml-10"
            text
            block
          >
            Save new profile
          </v-btn>
        </v-col>
        <v-col class="d-flex text-right" cols="6">
          <v-btn
            v-if="profile.id"
            @click="emitRemoveProfile"
            type="button"
            :disabled="disabled"
            variant="outlined"
            color="error"
            fab
          >
            <i-mdi:delete />
          </v-btn>
        </v-col>
      </v-row>
    </form>
  </v-container>
</template>

<style scoped>
section {
  padding: 1rem 1.5rem;
}
</style>
