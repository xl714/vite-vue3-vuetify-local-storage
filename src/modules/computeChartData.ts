import { Profile } from '../modules/profile';

function computeChartData(profile: Profile) {
  console.log(`computeChartData`);
  console.log(`computeChartData profile: ${profile.toString()}`);
  let weightTsAr = Object.keys(profile.weightList).map((i) => parseInt(i));
  let burnedTsAr = Object.keys(profile.burnedList).map((i) => parseInt(i));
  console.log('weightTsAr', weightTsAr, 'burnedTsAr', burnedTsAr);
  if (!(weightTsAr.length > 0 || burnedTsAr.length)) {
    console.log('data not found');
    return new Date();
  }
  // let weightTsArReadable = Object.keys(profile.weightList).map(
  //   (i) => new Date(parseInt(i) * 1000).toISOString().split('T')[0]
  // );
  // let burnedTsArReadable = Object.keys(profile.burnedList).map(
  //   (i) => new Date(parseInt(i) * 1000).toISOString().split('T')[0]
  // );
  // console.log('weightTsArReadable', weightTsArReadable, 'burnedTsArReadable', burnedTsArReadable);
  let tsArray = weightTsAr.concat(burnedTsAr);
  // console.log('tsArray', tsArray);
  // const reducer = (accumulator, currentValue) => (currentValue > accumulator) ? currentValue : accumulator;
  // const max = tsArray.reduce(reducer, 0);
  let tsMin = Math.min(...tsArray);
  let tsMax = Math.max(...tsArray);
  // console.log('min:', min, new Date(min * 1000).toISOString().split('T')[0], 'max:', max, new Date(max * 1000).toISOString().split('T')[0]);
  let chartLabelsReadable = [];
  let chartBurnedAr = [];
  let chartWeightAr = [];
  let chartTargetWeightAr = [];
  let dateMin = new Date(tsMin * 1000);
  let dateCurrent = dateMin;
  let counter = 0;
  let loopLimit = 500;
  while (counter < loopLimit) {
    let readableDate = dateCurrent.toISOString().split('T')[0];
    let dayTs = dateCurrent.getTime() / 1000;
    if (dayTs > tsMax) {
      break;
    }
    chartLabelsReadable.push(readableDate);
    chartWeightAr.push(
      dayTs in profile.weightList ? profile.weightList[dayTs] : null
    );
    chartBurnedAr.push(
      dayTs in profile.burnedList ? profile.burnedList[dayTs] : null
    );
    chartTargetWeightAr.push(null);
    dateCurrent.setDate(dateCurrent.getDate() + 1);
    dateCurrent.setHours(0, 0, 0, 0);
    counter++;
  }
  chartTargetWeightAr[0] = profile.targetWeight;
  chartTargetWeightAr[chartTargetWeightAr.length - 1] = profile.targetWeight;

  console.log('chartLabelsReadable', chartLabelsReadable);
  console.log('chartBurnedAr', chartBurnedAr);
  console.log('chartWeightAr', chartWeightAr);
  console.log('chartTargetWeightAr', chartTargetWeightAr);

  return {
    chartLabels: chartLabelsReadable,
    chartValuesBurned: chartBurnedAr,
    chartValuesWeight: chartWeightAr,
    chartTargetWeightAr: chartTargetWeightAr,
  };
}

// 👇️ named export
export { computeChartData };
