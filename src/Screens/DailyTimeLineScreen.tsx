import React from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, ScrollView } from 'react-native';
import { VictoryPie } from 'victory-native';
import { STATE_COLORS, calculateEndTime, formatDuration } from '../assets/Constants';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

const combinePredictions = (predictions) => {
  const combined = [];
  let lastPrediction = null;

  predictions.forEach((prediction, index) => {
    if (lastPrediction && lastPrediction.prediction === prediction.prediction) {
      lastPrediction.duration += prediction.duration;
      lastPrediction.end_time = prediction.start_time;
    } else if (lastPrediction && prediction.prediction === 'Other' && lastPrediction.prediction !== 'Other') {
      const nextPrediction = predictions[index + 1];
      if (nextPrediction && nextPrediction.prediction === lastPrediction.prediction) {
        return;
      } else {
        lastPrediction.end_time = prediction.start_time; // Set end time before changing type
        lastPrediction = { ...prediction };
        combined.push(lastPrediction);
      }
    } else {
      if (lastPrediction) {
        lastPrediction.end_time = prediction.start_time; // Set end time before changing type
      }
      lastPrediction = { ...prediction };
      combined.push(lastPrediction);
    }
  });

  if (lastPrediction && !lastPrediction.end_time) {
    lastPrediction.end_time = lastPrediction.start_time; // Set end time if missing
  }

  return combined;
};
const DailyTimeLineScreen = ({ predictions }) => {
  const combinedPredictions = combinePredictions(predictions);

  return (
    <FlatList
      data={combinedPredictions}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={[styles.activityBlock, { backgroundColor: STATE_COLORS[item.prediction.toUpperCase()] }]}> 
          <Text style={styles.activityText}>{item.prediction}</Text>
          {/* <Text style={styles.activityText}>{moment.utc(item.end_time).format('h:mm A')} - {moment.utc(item.start_time).format('h:mm A')}</Text> */}
          <Text style={[styles.tableCell, styles.leftBorder]}>
      {calculateEndTime(item.start_time, item.duration)} - {moment.utc(item.start_time).format('h:mm A')}
            </Text>
          <Text style={styles.activityText}>{formatDuration(item.duration)}</Text>
        </View>
      )}
      contentContainerStyle={{ paddingBottom: 200 }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  activityBlock: {
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activityText: {
    fontSize: 16,
    color: '#000',
  },
});

export default DailyTimeLineScreen;
