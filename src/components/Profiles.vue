<script setup lang="ts">
// https://vuejs.org/api/sfc-script-setup.html#typescript-only-features
export interface Props {
  selectedProfileId?: number | null;
  profiles: Map | null;
}
const props = withDefaults(defineProps<Props>(), {
  selectedProfileId: null,
  profiles: Map | null,
});
console.log('Profiles.vue selectedProfileId', props.selectedProfileId);
console.log('Profiles.vue profiles', props.profiles.value);

const emits = defineEmits<{
  (e: 'onEmitOpenNewFormProfile'): void;
  (e: 'onEmitSelectProfile', id: number): void;
  (e: 'onEmitOpenEditFormProfile', id: number): void;
}>();

const emitOpenNewFormProfile = () => {
  console.log('Before onEmitOpenNewFormProfile');
  emits('onEmitOpenNewFormProfile');
  console.log('After onEmitOpenNewFormProfile');
};

const emitOpenEditFormProfile = (e) => {
  let id = parseInt(e.currentTarget.getAttribute('data-id'));
  console.log(`emitOpenEditFormProfile before emit (${id})`);
  emits('onEmitOpenEditFormProfile', id);
  console.log('emitOpenEditFormProfile after emit');
};
const emitSelectProfile = (e) => {
  let selectedId = parseInt(e.currentTarget.getAttribute('data-id'));
  console.log(`emitSelectProfile before emit (${selectedId})`);
  emits('onEmitSelectProfile', selectedId);
  //props.selectedProfileId.value = parseInt(selectedId);
  console.log('emitSelectProfile after emit');
};

/***************** CHART *****************/
import { computeChartData } from '../modules/computeChartData';
import * as Utils from '../modules/chartJSUtils';
let chartLabels: Array<string> = ref([]);

import { LineChart, useLineChart } from 'vue-chart-3';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
Chart.register(...registerables);
const getData = computed<ChartData<'line'>>(() => ({
  // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  labels: chartLabels.value,
  datasets: [
    {
      label: 'Joe',
      data: [65, 59, 80, 81, 56, 55, 40],
      // data: chartValuesWeight.value,
      fill: false,
      //borderColor: '#eb4034',
    },
    // {
    //   type: 'bar',
    //   label: 'Burned calories',
    //   backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
    //   borderColor: Utils.CHART_COLORS.blue,
    //   data: chartValuesBurned.value,
    //   yAxisID: 'y1',
    // },
    // {
    //   type: 'bar',
    //   label: 'Dataset 2',
    //   borderColor: '#FFD700',
    //   data: [28, 48, 40, 19, 86, 27, 90],
    // },
  ],
}));

const options = computed<ChartOptions<'line'>>(() => ({
  plugins: {
    legend: {
      display: true,
    },
  },
  spanGaps: true,
  scales: {
    x: {
      display: true,
    },
    y: {
      display: true,
      position: 'left',
      // https://www.chartjs.org/docs/latest/samples/other-charts/scatter-multi-axis.html
      ticks: {
        color: Utils.CHART_COLORS.red,
      },
      // https://www.chartjs.org/docs/latest/samples/scales/log.html
      // type: 'logarithmic',
      // beginAtZero: true,
    },
  },
}));

const { lineChartProps } = useLineChart({
  options,
  chartData: getData,
});
</script>

<template>
  <v-container>
    <header>
      <v-row class="mb-3">
        <v-col>
          <h2 class="text-h2">Profiles</h2>
        </v-col>
        <v-col />
        <v-col>
          <v-btn @click="emitOpenNewFormProfile" block>
            <i-park-plus-cross small /> &nbsp; New profile
          </v-btn>
        </v-col>
      </v-row>
    </header>
    <v-row>
      <v-col v-for="[id, item] in props.profiles.value" :key="id" cols="6">
        <v-card
          :class="props.selectedProfileId == item.id ? `selected` : ``"
          :outlined="props.selectedProfileId == item.id ? `outlined` : ``"
          outlined
          shaped
        >
          <v-list-item two-line>
            <div>
              <div class="text-overline mb-4"></div>
              <v-list-item-title class="text-h5 mb-1">
                <i-mdi:account color="grey" /> {{ item.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                From {{ item.startWeight }} to {{ item.targetWeight }} Kg
              </v-list-item-subtitle>
            </div>
            <!-- <v-avatar class="m-1" size="80" color="grey">
                <i-mdi:account color="grey" />
              </v-avatar> -->
          </v-list-item>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              raised
              :data-id="item.id"
              @click="emitOpenEditFormProfile"
              class="ma-2"
              color="primary"
              outlined
            >
              Edit
              <i-mdi:edit dark />
            </v-btn>

            <v-btn
              raised
              :data-id="item.id"
              @click="emitSelectProfile"
              class="ma-2"
              color="primary"
              dark
            >
              Select
              <i-mdi:checkbox-marked-circle />
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="">
        <LineChart v-bind="lineChartProps" />
      </v-col>
    </v-row>
  </v-container>
</template>
<!-- 
<v-avatar class="m-1" size="150">
  <i-mdi:account />{{ item.name }}
</v-avatar>
-->
<style lang="scss" scoped>
header {
  .v-card {
    .v-avatar {
    }
    .v-card-title {
    }
    .v-card-subtitle {
    }
  }
  svg {
    align-self: center;
    font-size: 1em;
    color: rgb(0, 120, 207);
  }
}
</style>
