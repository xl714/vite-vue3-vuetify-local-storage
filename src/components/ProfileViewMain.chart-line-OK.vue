<script setup lang="ts">
import { Profile } from '../classes/profile';
import { BarChart } from '../components/BarChart';
export interface Props {
  profile: Profile;
}
const props = withDefaults(defineProps<Props>(), {
  profile: new Profile(),
});
console.log('Profile.vue props.profile.name', props.profile.name);

const emits = defineEmits<{
  (e: 'onEmitOpenEditFormProfile', id: number): void;
}>();

const emitOpenEditFormProfile = () => {
  //name.value && alert(`Hi ${name.value}`);
  console.log('emitOpenEditFormProfile before emit');
  emits('onEmitOpenEditFormProfile', parseInt(props.profile.id));
  console.log('emitOpenEditFormProfile after emit');
};

/***************** CHART *****************/
// https://morioh.com/p/26b87c91fc9c
import { computed } from 'vue';
import { LineChart, useLineChart } from 'vue-chart-3';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
Chart.register(...registerables);
const getData = computed<ChartData<'line'>>(() => ({
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Bitcoin',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: '#4bc0c0',
    },
    {
      label: 'Ethereum',
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      borderColor: '#565656',
    },
  ],
}));

const options = computed<ChartOptions<'line'>>(() => ({
  plugins: {
    legend: {
      display: false,
    },
  },
}));

const { lineChartProps } = useLineChart({
  options,
  chartData: getData,
});

const switchLegend = () => {
  toggleLegend.value = !toggleLegend.value;
};
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="9" class="text-left">
        <div>PROFILE VIEW MAIN - {{ profile.name }}</div>
      </v-col>
      <v-col cols="3" class="text-left">
        <v-btn
          type="button"
          @click="emitOpenEditFormProfile"
          color="primary"
          fab
        >
          <i-mdi:edit />
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="">
        <LineChart v-bind="lineChartProps" />
      </v-col>
    </v-row>
  </v-container>
</template>
