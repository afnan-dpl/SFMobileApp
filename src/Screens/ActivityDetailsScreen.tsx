import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import PeriodSelector from './PeriodSelector';
import DailyActivityTabbarScreen from './DailyActivityTabbarScreen';
import WeeklyOverViewScreen from './WeeklyOverViewScreen';
import MonthlyOverViewScreen from './MonthlyOverViewScreen';
import { getLatestRecordById, getTodayPredictionAPI, getActivitySummaryAPI } from '../api/predictionService';
import LoaderOverlay from '../shared/LoaderOverlay';
import { back_button, demo_1, STATE_COLORS, getStateColor, getStateTextColor } from '../assets/Constants';
import moment from 'moment-timezone';

function ActivityDetailsScreen({ navigation }) {

  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [latestId, setLatestId] = useState(0);
  const [latestPrediction, setLatestPrediction] = useState('Idle');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [activitySummary, setActivitySummary] = useState([]);
  const [displayPrediction, setDisplayPrediction] = useState('Idle');

  const user = navigation.getParam('user');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getTodayPredictionAPI();
        setPredictions(data);
        console.log("data is  lengthh is ", data.length);
        const maxId = Math.max(...data.map((p) => p.id), latestId);
        setLatestId(maxId);
        if (data.length > 0) {
          setLatestPrediction(data[0].prediction);
          setDisplayPrediction(data[0].prediction);
        }
      } catch (error) {
        console.error('Error fetching predictions:', error);
      } finally {
        setLoading(false);
      }
    };

     fetchData();
  }, []);

  useEffect(() => {
    if (latestId > 0) {
      const interval = setInterval(async () => {
        try {

          const newRecord = await getLatestRecordById(latestId);
          if (newRecord.length > 0) {
            console.log('New record:', newRecord);
            setPredictions((prevPredictions) => {
              const existingIds = new Set(prevPredictions.map((p) => p.id));
              const newPredictions = newRecord.filter((p) => !existingIds.has(p.id));
              if (newPredictions.length > 0) {
                setLatestPrediction(newPredictions[0].prediction);
                setDisplayPrediction(newPredictions[0].prediction);
              }
              return [...prevPredictions, ...newPredictions].sort((a, b) => b.id - a.id);
            });

            const maxId = Math.max(...newRecord.map((p) => p.id), latestId);
            setLatestId(maxId);
          }
        } catch (error) {
          console.error('Failed to fetch latest record:', error);
        }
      }, 4500);

      return () => clearInterval(interval);
    }
  }, [latestId]);

  // Check if latest prediction is older than 1 minute
  useEffect(() => {
    const checkPredictionAge = () => {
      if (predictions.length > 0) {
        const latestPredictionData = predictions[0];
        const currentTime = moment().tz("Asia/Karachi");   
        const predictionTime = moment(latestPredictionData.start_time);
        const timeDifference = currentTime.diff(predictionTime, 'seconds');
        console.log("timeDifference is ", timeDifference, latestPredictionData.start_time, currentTime);
        if (timeDifference > 60) {
          setDisplayPrediction('Idle');
        } else {
          setDisplayPrediction(latestPrediction);
        }
      }
    };

     checkPredictionAge();
    
    
  }, [predictions, latestPrediction]);

  useEffect(() => {
    const fetchActivitySummary = async () => {
      try {
        const summary = await getActivitySummaryAPI(new Date().toISOString().split('T')[0]);
        setActivitySummary(summary);
      } catch (error) {
        console.error('Error fetching activity summary:', error);
      }
    };

    fetchActivitySummary();
  }, []);

  const handlePeriodChange = (period: 'today' | 'weekly' | '30days') => {
    console.log('Selected period:', period);
    setSelectedPeriod(period);
  };

  const HeaderView = () => {
    return (
      <View style={{ width: '100%', marginLeft: 12, marginTop: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={back_button} style={styles.backIcon} />
        </TouchableOpacity>
        <View style={{ marginLeft: 80, flexDirection: 'row', marginTop: 60 }}>
          <Image source={demo_1} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.itemName}>{user?.user_name || 'Unknown User'}</Text>
            <View
              style={[styles.roleContainer, {
                backgroundColor: getStateColor(displayPrediction),
                paddingHorizontal: displayPrediction ? (displayPrediction.length < 6 ? 12 : 8) : 12,
              }]}
            >
              <Text style={[styles.itemRole, { color: getStateTextColor(displayPrediction) }]}>{displayPrediction}</Text>

            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LoaderOverlay visible={loading} />
      <HeaderView />

      {selectedPeriod === 'today' ? (
        <DailyActivityTabbarScreen predictions={predictions} />
      ) : selectedPeriod === 'weekly' ? (
        <WeeklyOverViewScreen predictions={predictions} activitySummary={activitySummary} />
      ) : (
        <MonthlyOverViewScreen predictions={predictions} activitySummary={activitySummary} />
      )}
      <View style={styles.footerContainer}>
        <PeriodSelector onSelect={handlePeriodChange} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    marginTop: 24,

  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 24,
    marginRight: 15,
  },
  roleContainer: {
    backgroundColor: STATE_COLORS.IDLE,
    borderRadius: 16,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    height: 32,
    marginTop: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  role: {
    fontSize: 14,
    color: '#333',
  },
  textContainer: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
    width: 80, // Ensures equal width for all headings
  },
  itemName: {
    fontSize: 25,
    color: 'black',
  },

  itemRole: {
    fontSize: 12,
    textAlign: 'center',
    color: 'black', // Light blue color for user role
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 16,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#fff',
  },

});

export default ActivityDetailsScreen;
