import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { STATE_COLORS } from '../assets/Constants';
import {
  VictoryBar,
  VictoryChart, VictoryStack
} from 'victory-native';
import moment from 'moment';

const {width: screenWidth} = Dimensions.get('window');

const WeeklyOverViewScreen = ({predictions = [], activitySummary = []}) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const todayData = predictions.reduce(
    (acc, p) => {
      acc.date = moment(p.start_time).format('YYYY-MM-DD');
      acc.total_sweeping_time += p.prediction === 'Sweeping' ? p.duration : 0;
      acc.total_mopping_time += p.prediction === 'Mopping' ? p.duration : 0;
      acc.total_scrubbing_time += p.prediction === 'Scrubbing' ? p.duration : 0;
      acc.total_other_time += p.prediction === 'Other' ? p.duration : 0;
      acc.total_idle_time += p.prediction === 'Idle' ? p.duration : 0;
      return acc;
    },
    {
      date: '',
      total_sweeping_time: 0,
      total_mopping_time: 0,
      total_scrubbing_time: 0,
      total_other_time: 0,
      total_idle_time: 0,
    },
  );

  const completeData = [...activitySummary, todayData].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  const lastFiveDaysData = completeData.slice(0, 5);
  console.log('completeData is ', JSON.stringify(lastFiveDaysData, null, 2));

  const dataByDay = lastFiveDaysData.map(dayData => {
    const totalDuration =
      dayData.total_sweeping_time +
      dayData.total_mopping_time +
      dayData.total_scrubbing_time +
      dayData.total_other_time +
      dayData.total_idle_time;
    return {
      day: moment(dayData.date).format('DD/MM ddd'),
      data: [
        {x: 'Sweeping', y: (dayData.total_sweeping_time / totalDuration) * 100},
        {x: 'Mopping', y: (dayData.total_mopping_time / totalDuration) * 100},
        {
          x: 'Scrubbing',
          y: (dayData.total_scrubbing_time / totalDuration) * 100,
        },
        {x: 'Other', y: (dayData.total_other_time / totalDuration) * 100},
        {x: 'Idle', y: (dayData.total_idle_time / totalDuration) * 100},
      ],
    };
  });

  const transformData = dataByDay => {
    const activityTypes = ['Sweeping', 'Mopping', 'Scrubbing', 'Other', 'Idle'];

    return activityTypes.map(activity => {
      return {
        activity,
        data: dataByDay.map(day => {
          const match = day.data.find(d => d.x === activity);
          return {
            x: day.day,
            y: match ? match.y : 0,
          };
        }),
      };
    });
  };

  const formattedData = transformData(dataByDay);
  console.log('dataByDay is ', JSON.stringify(formattedData, null, 2));

  return (
    <View style={styles.container}>
      <View style={styles.legendContainer}>
        {Object.keys(STATE_COLORS).map((key, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[styles.colorDot, {backgroundColor: STATE_COLORS[key]}]}
            />
            <Text style={styles.legendText}>
              {key.charAt(0) + key.slice(1).toLowerCase()}
            </Text>
          </View>
        ))}
      </View>
      <VictoryChart
        height={500} // 🔹 Increase this number to make chart taller
        domainPadding={{x: 40}} // extra spacing between bars
        padding={{top: 20, bottom: 60, left: 30, right: 10}} // 🔹 increase bottom
      >
        <VictoryStack
          colorScale={[
            STATE_COLORS.SWEEPING,
            STATE_COLORS.MOPPING,
            STATE_COLORS.SCRUBBING,
            STATE_COLORS.OTHER,
            STATE_COLORS.IDLE,
          ]}>
          {formattedData.map((activitySet, idx) => (
            <VictoryBar key={idx} data={activitySet.data} barWidth={30} />
          ))}
        </VictoryStack>
      </VictoryChart>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  sampleText: {
    fontSize: 18,
    color: '#333',
  },
});

export default WeeklyOverViewScreen;
