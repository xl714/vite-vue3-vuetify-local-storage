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
// https://codesandbox.io/s/demo-vue-chart-3-ugynm?file=/src/App.vue
import { shuffle } from 'lodash';
import { DoughnutChart, useDoughnutChart } from 'vue-chart-3';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
import MyComponent from './MyComponent.vue';

Chart.register(...registerables);

const dataValues = ref([30, 40, 60, 70, 5]);
const dataLabels = ref(['Paris', 'Nîmes', 'Toulon', 'Perpignan', 'Autre']);
const toggleLegend = ref(true);

const testData = computed<ChartData<'doughnut'>>(() => ({
  labels: dataLabels.value,
  datasets: [
    {
      data: dataValues.value,
      backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
    },
  ],
}));

const options = computed<ChartOptions<'doughnut'>>(() => ({
  scales: {
    myScale: {
      type: 'logarithmic',
      position: toggleLegend.value ? 'left' : 'right',
    },
  },
  plugins: {
    legend: {
      position: toggleLegend.value ? 'top' : 'bottom',
    },
    title: {
      display: true,
      text: 'Chart.js Doughnut Chart',
    },
  },
}));

const { doughnutChartProps, doughnutChartRef } = useDoughnutChart({
  chartData: testData,
  options,
});

let index = ref(20);

const shuffleData = () => {
  // dataValues.value = shuffle(dataValues.value);
  dataValues.value.push(index.value);
  dataLabels.value.push('Other' + index.value);
  console.log(dataValues.value);
  console.log(doughnutChartRef.value.chartInstance);
  index.value++;
};

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
        <DoughnutChart v-bind="doughnutChartProps" />
      </v-col>
    </v-row>
  </v-container>
</template>
