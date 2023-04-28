<script setup lang="ts">
import Datepicker from 'vue3-datepicker';
export interface Props {
  class: string;
  datePicked: Date;
}
const props = withDefaults(defineProps<Props>(), {
  class: 'date-picker-day',
  datePicked: new Date(),
});

let datePickedForModel: Date = ref(props.datePicked);

const emits = defineEmits<{
  (e: 'onEmitDatePickedChanged', date: Date): void;
}>();

const emitDatePickedChanged = (date: Date) => {
  console.log('DatePickerDay emitDatePickedChanged before emit');
  emits('onEmitDatePickedChanged', date);
  console.log('DatePickerDay emitDatePickedChanged after emit');
};
</script>

<template>
  <div
    :class="class"
    class="
      date-picker-day
      v-input v-input--horizontal v-input--density-default v-input--dirty
      v-text-field
    "
  >
    <div class="v-input__prepend"><i-mdi:calendar /></div>
    <div class="v-input__control">
      <div
        class="
          v-field v-field--active v-field--dirty v-field--variant-filled
          v-theme--light
        "
        role="textbox"
      >
        <div class="v-field__overlay"></div>
        <div class="v-field__loader">
          <div
            class="v-progress-linear v-theme--light"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            style="height: 0px; --v-progress-linear-height: 2px"
          >
            <!---->
            <div
              class="v-progress-linear__background"
              style="width: 100%"
            ></div>
            <div class="v-progress-linear__indeterminate">
              <div class="v-progress-linear__indeterminate long"></div>
              <div class="v-progress-linear__indeterminate short"></div>
            </div>
            <!---->
          </div>
        </div>
        <!---->
        <div class="v-field__field" data-no-activator="">
          <label
            class="v-label v-field-label v-field-label--floating"
            aria-hidden="true"
            for="input-datepicker"
            ><!---->Date</label
          ><label class="v-label v-field-label" for="input-datepicker"
            >Date</label
          >
          <!--v-model="datePickedForModel"-->
          <datepicker
            @update:modelValue="emitDatePickedChanged"
            v-model="datePickedForModel"
            autofocus=""
            size="1"
            type="text"
            class="v-field__input input-date-picker-day"
          ></datepicker>
          <!---->
        </div>
        <!----><!---->
        <div class="v-field__outline"><!----><!----></div>
      </div>
    </div>
    <!---->
    <div class="v-input__details">
      <div class="v-messages"></div>
      <!---->
    </div>
  </div>
</template>
<style scoped>
.v-field__field {
  display: auto !important;
}
input {
  width: auto !important;
}
.v3dp__datepicker {
  width: 200px;
}
.v3dp__popout {
  z-index: 99999999;
}
</style>
