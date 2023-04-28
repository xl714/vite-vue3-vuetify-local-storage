<script setup lang="ts">
import { Profile } from '../modules/profile';
import { computeChartData } from '../modules/computeChartData';
import * as Utils from '../modules/chartJSUtils';
import IconWeightKilogram from '~icons/mdi/weight-kilogram';
import IconFire from '~icons/mdi/fire';
// import Datepicker from 'vue3-datepicker';

export interface Props {
  profile: Profile;
}
const props = withDefaults(defineProps<Props>(), {
  profile: new Profile(),
});
console.log('Profile.vue props.profile.name', props.profile.name);

let showDialogForm: boolean = ref(false);
let datePicked: Date = ref(new Date());
let weight: number | null = ref(null);
let calories: number | null = ref(null);
let chartLabels: Array<string> = ref([]);
let chartValuesBurned: Array<number> = ref([]);
let chartValuesWeight: Array<number> = ref([]);
let chartValuesTargetWeight: Array<number> = ref([]);

let lastWeight: number | null = ref(null);
let weightStillToLoose: number | null = ref(null);
let originalWeightToLoose: number | null = ref(null);
let weightLost: number | null = ref(null);
let originalCaloriesToBurn: number | null = ref(null);

let caloriesStillToBurn = computed(() => {
  let weightTsAr = Object.keys(props.profile.weightList).map((i) =>
    parseInt(i)
  );
  const lastTs = Math.max(...weightTsAr);
  lastWeight.value = props.profile.weightList[lastTs];
  //console.log('lastWeight', lastWeight.value);
  weightStillToLoose.value = lastWeight.value - props.profile.targetWeight;
  weightStillToLoose.value = Math.round(weightStillToLoose.value * 100) / 100;
  // console.log('weightStillToLoose', weightStillToLoose.value);

  originalWeightToLoose.value =
    props.profile.startWeight - props.profile.targetWeight;

  weightLost.value = props.profile.startWeight - lastWeight.value;
  weightLost.value = Math.round(weightLost.value * 100) / 100;

  originalCaloriesToBurn.value = originalWeightToLoose.value * 9000;

  const caloriesStillToBurn =
    Math.round(weightStillToLoose.value * 9000 * 100) / 100;
  // console.log('caloriesStillToBurn', caloriesStillToBurn);
  return caloriesStillToBurn;
});

const onMountedComputeChartData = onMounted(() => {
  console.log('onMountedComputeChartData');
  let res = computeChartData(props.profile);
  chartLabels.value = res.chartLabels;
  chartValuesBurned.value = res.chartValuesBurned;
  chartValuesWeight.value = res.chartValuesWeight;
  chartValuesTargetWeight.value = res.chartTargetWeightAr;
  return true;
});

const editDatumClick = (e) => {
  const ts = parseInt(e.currentTarget.getAttribute('data-ts'));
  const type = e.currentTarget.getAttribute('data-type');
  const value = parseInt(e.currentTarget.getAttribute('data-value'));
  console.log(`TODO editDatumClick before emit (${ts}, ${type}, ${value})`);
};

const removeDatumClick = (e) => {
  const datatype = e.currentTarget.getAttribute('data-type');
  const timestamp = parseInt(e.currentTarget.getAttribute('data-ts'));
  console.log(`Next: emitRemoveProfileDatum (${datatype}, ${timestamp})`);
  emitRemoveProfileDatum(datatype, timestamp);
};
const emits = defineEmits<{
  (e: 'onEmitUpdateComponent', id: number): void;
  (e: 'onEmitOpenEditFormProfile', id: number): void;
  (
    e: 'onEmitSaveProfileData',
    id: number,
    date: string,
    weight: number,
    calories: number
  ): void;
  (
    e: 'onEmitRemoveProfileDatum',
    id: number,
    datatype: string,
    timestamp: number
  ): void;
}>();

const emitUpdateComponent = () => {
  console.log('emitUpdateComponent before emit');
  emits('onEmitUpdateComponent', parseInt(props.profile.id));
  console.log('emitUpdateComponent after emit');
};

const emitRemoveProfileDatum = (datatype: string, timestamp: number) => {
  console.log('emitRemoveProfileDatum before emit');
  emits(
    'onEmitRemoveProfileDatum',
    parseInt(props.profile.id),
    datatype,
    timestamp
  );
  console.log('emitRemoveProfileDatum after emit');
  emitUpdateComponent();
};
const emitOpenEditFormProfile = () => {
  console.log('emitOpenEditFormProfile before emit');
  emits('onEmitOpenEditFormProfile', parseInt(props.profile.id));
  console.log('emitOpenEditFormProfile after emit');
};

const emitSaveProfileData = () => {
  console.log('ProfileViewMain emitSaveProfileData before emit');
  emits(
    'onEmitSaveProfileData',
    parseInt(props.profile.id),
    datePicked.value,
    weight.value,
    calories.value
  );
  showDialogForm.value = false;
  datePicked.value = new Date();
  weight.value = null;
  calories.value = null;
  console.log('ProfileViewMain emitSaveProfileData after emit');
  emitUpdateComponent();
};

const datePickedChanged = (date: Date) => {
  console.log('ProfileViewMain datePickedChanged', date);
  datePicked.value = date;
};

/***************** CHART *****************/
import { LineChart, useLineChart } from 'vue-chart-3';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
Chart.register(...registerables);
const getData = computed<ChartData<'line'>>(() => ({
  // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  labels: chartLabels.value,
  datasets: [
    {
      label: 'Weight',
      //data: [65, 59, 80, 81, 56, 55, 40],
      data: chartValuesWeight.value,
      fill: false,
      borderColor: '#eb4034',
    },
    {
      label: 'Target Weight',
      // data: [28, 48, 40, 19, 86, 27, 90],
      data: chartValuesTargetWeight.value,
      fill: false,
      borderColor: '#FFD700',
      yAxisID: 'y',
    },
    {
      type: 'bar',
      label: 'Burned calories',
      backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
      borderColor: Utils.CHART_COLORS.blue,
      data: chartValuesBurned.value,
      yAxisID: 'y1',
    },
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
    // https://www.chartjs.org/docs/latest/samples/line/multi-axis.html
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      ticks: {
        color: Utils.CHART_COLORS.blue,
      },
      // grid line settings
      grid: {
        drawOnChartArea: false, // only want the grid lines for one axis to show up
      },
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
          <h2 class="text-h2">Dashboard</h2>
        </v-col>
        <v-col />
        <v-col>
          <v-btn color="primary" @click="showDialogForm = true" block>
            Add new &nbsp;<i-mdi:weight /> / <i-mdi:fire /> data
          </v-btn>
          <!-- <v-btn type="button" @click="emitOpenForm" color="primary" fab>
          <i-mdi:edit />
        </v-btn> -->
        </v-col>
      </v-row>
    </header>
    <!-- CHART -->

    <v-row>
      <v-col cols="12" class="data-summary">
        <table class="v-simple-table dense summary">
          <!-- <template v-slot:default> -->
          <thead>
            <tr>
              <th class="summary-title text-center py-1" colspan="4">
                Still to burn: {{ caloriesStillToBurn }} /
                {{ originalCaloriesToBurn }} Calories
              </th>
            </tr>
            <tr>
              <th class="text-center">Weight started at</th>
              <th class="text-center">Current</th>
              <th class="text-center">Target</th>
              <th class="text-center">Lost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">{{ profile.startWeight }}kg</td>
              <td class="text-center">{{ lastWeight }}kg</td>
              <td class="text-center">{{ profile.targetWeight }}kg</td>
              <td class="text-center">
                {{ weightLost }} / {{ originalWeightToLoose }} kg
              </td>
            </tr>
          </tbody>
        </table>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="">
        <LineChart v-bind="lineChartProps" />
      </v-col>
    </v-row>
    <!-- TABLE BURNED CALORIES -->
    <v-row>
      <v-col cols="6" class="text-center">
        <h3 class="text-center">Calories burned</h3>
        <table class="v-simple-table dense burned">
          <!-- <template v-slot:default> -->
          <thead>
            <tr>
              <th class="text-center">Date</th>
              <th class="text-center">Value</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key) in profile.burnedList">
              <td class="text-left">
                {{ new Date(key * 1000).toISOString().split('T')[0] }}
              </td>
              <td class="text-right">{{ value }} Calories</td>
              <td class="text-right">
                <v-btn
                  :data-ts="key"
                  data-type="burned"
                  :data-value="value"
                  @click="removeDatumClick"
                  fab
                  dark
                  x-small
                >
                  <i-mdi:delete />
                </v-btn>
              </td>
            </tr>
          </tbody>
          <!-- </template> -->
        </table>
      </v-col>
      <!-- TABLE WEIGHTS -->
      <v-col cols="6" class="text-center">
        <h3 class="text-center">Weights</h3>
        <table class="v-simple-table dense weights">
          <!-- <template v-slot:default> -->
          <thead>
            <tr>
              <th class="text-center">Date</th>
              <th class="text-center">Value</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(value, key) in profile.weightList">
              <td class="text-left">
                {{ new Date(key * 1000).toISOString().split('T')[0] }}
              </td>
              <td class="text-left">{{ value }} Kg</td>
              <td class="text-right">
                <v-btn
                  :data-ts="key"
                  data-type="weight"
                  :data-value="value"
                  @click="removeDatumClick"
                  fab
                  dark
                  x-small
                >
                  <i-mdi:delete />
                </v-btn>
              </td>
            </tr>
          </tbody>
          <!-- </template> -->
        </table>
      </v-col>
    </v-row>

    <!-- DIALOG FORM -->
    <v-dialog v-model="showDialogForm" class="dialog-form-add-data" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h2"
            >Add new weight and/or burned calories at date</span
          >
        </v-card-title>
        <v-card-text>
          <section class="c__inputs">
            <v-row justify="center" class="v-row__numbers">
              <v-col cols="6">
                <v-text-field
                  label="Weight:"
                  class="input-weight"
                  v-model="weight"
                  :prepend-icon="IconWeightKilogram"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  class="input-calories"
                  label="Calories burned:"
                  v-model="calories"
                  :prepend-icon="IconFire"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col cols="1" />
            </v-row>
            <v-row justify="center" class="v-row__datepicker">
              <v-col cols="6">
                <date-picker-day
                  :datePicked="datePicked"
                  @onEmitDatePickedChanged="datePickedChanged"
                  class="dialog-date-picker"
                ></date-picker-day>
              </v-col>
              <v-col cols="6" />
            </v-row>
          </section>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" variant="text" @click="emitSaveProfileData">
            Save
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="showDialogForm = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<style scoped>
.data-summary {
  text-align: left;
}
table {
  width: 100%;
  border: 1px solid silver;
}
table tbody {
  border-top: 1px solid silver;
}
table tbody tr td {
  padding: 5px;
}
.input-weight,
.input-calories {
  margin-left: 3px;
}
.summary-title {
  font-size: 1.5em;
  background-color: gold;
  font-weight: bold;
}

.v-simple-table.summary,
.v-simple-table.burned,
.v-simple-table.weights {
  font-size: 1em;
}
@media only screen and (max-width: 700px) {
  .summary-title {
    font-size: 1.5em;
  }
  .v-simple-table.summary,
  .v-simple-table.burned,
  .v-simple-table.weights {
    font-size: 0.6em;
  }
  #inspire main table tbody td button.v-btn.x-small {
    font-size: 0.6em !important;
    padding: 0 !important;
    height: 25px !important;
    width: 25px !important;
    font-size: 0.6em !important;
  }
  button.v-btn.x-small svg {
    font-size: 0.6em;
    padding: 0;
  }
}
</style>
