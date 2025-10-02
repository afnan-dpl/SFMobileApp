import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native';
import { VictoryPie } from 'victory-native';
import { calculateEndTime, formatDuration, STATE_COLORS } from '../assets/Constants';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;


const renderDetails = (activityData) => {
  const totalActivities = activityData.reduce((sum, item) => sum + item.y, 0);

  return (
    <View style={styles.detailsContainer}>
      {activityData.map((item, index) => (
        <View key={index} style={styles.detailRow}>
          <View style={[styles.colorCircle, { backgroundColor: STATE_COLORS[item.x.toUpperCase()] }]} />
          <Text style={[styles.detailText, styles.detailLabel]}>{item.x}</Text>
          <Text style={[styles.detailText, styles.detailValue]}>{formatDuration(item.y)}</Text>
        </View>
      ))}
    </View>
  );
};

const renderTable = (activityData) => {
  
  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderCell}>Activity</Text>
        <Text style={styles.tableHeaderCell}>Time</Text>
        <Text style={styles.tableHeaderCell}>Duration</Text>
      </View>

      <FlatList
        data={activityData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={[styles.tableRow, index % 2 === 1 && { backgroundColor: '#f0f0f0' }]}> 
            <Text style={styles.tableCell}>{item.prediction}</Text>
            <Text style={[styles.tableCell, styles.leftBorder]}>{moment.utc(item.end_time).format('h:mm A')} - {moment.utc(item.start_time).format('h:mm A')}</Text> 
            {/* <Text style={[styles.tableCell, styles.leftBorder]}>{calculateEndTime(item.start_time, item.duration)} - {moment.utc(item.start_time).format('h:mm A')}</Text> */}
            <Text style={styles.tableCell}>{formatDuration(item.duration)}</Text> 
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 300 }}
      />
    </View>
  );
};



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
     lastPrediction.end_time = lastPrediction.start_time;
     // Set end time if missing
  }

  return combined;
};


const DailyOverViewScreen = ({ predictions }) => {
  const [combinedPredictions, setCombinedPredictions] = useState([]);
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const combined = combinePredictions(predictions);
    setCombinedPredictions(combined);
    const activityData = ['Other', 'Sweeping', 'Scrubbing', 'Mopping'].map(activity => {
      const totalDuration = combined
        .filter(p => p.prediction === activity)
        .reduce((sum, p) => sum + p.duration, 0);
      return { x: activity, y: totalDuration };
    });
    setActivityData(activityData);
  }, [predictions]);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <VictoryPie
          data={activityData}
          width={screenWidth * 0.4}
          height={screenWidth * 0.4}
          innerRadius={0}
          padding={0}
          colorScale={[STATE_COLORS.OTHER, STATE_COLORS.SWEEPING, STATE_COLORS.SCRUBBING, STATE_COLORS.MOPPING]}
          style={{ labels: { display: 'none' }, parent: { margin: 0 } }}
        />
        {renderDetails(activityData)}
      </View>
      {renderTable(combinedPredictions)}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    paddingVertical: 12,
    marginTop: 20,
    flex: 1,
   },

  container: {
    flexDirection: 'row',
    width: '100%',
    marginHorizontal: 12,
   
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  colorBox: {
    width: 10,
    height: 10,
    marginRight: 10,
  },
  colorCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  detailLabel: {
    width: '45%',
    textAlign: 'left',
    fontWeight: 'bold',
    color: '#000',
    fontSize: 16,
  },
  detailValue: {
    textAlign: 'right',
    flex: 1,
    marginEnd: 10,
  },
  tableContainer: {
    width: '100%',
    marginTop: 20,
   },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
    },
    leftBorder: {
      borderLeftWidth: 4,
      borderLeftColor: '#e0e0e0',
    },
    rightBorder: {
      borderRightWidth: 3,
      borderRightColor: '#e0e0e0',
    },
});

export default DailyOverViewScreen;
