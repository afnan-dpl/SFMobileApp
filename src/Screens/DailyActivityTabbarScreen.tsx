import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DailyOverViewScreen from './DailyOverViewScreen';
import DailyTimeLineScreen from './DailyTimeLineScreen';



const DailyActivityTabbarScreen = ({ predictions }) => {
  const [selectedTab, setSelectedTab] = useState('Overview');
  const [dailyPredictions, setDailyPredictions] = useState([]);

  useEffect(() => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todayPredictions = predictions.filter(prediction => {
      const predictionDate = new Date(prediction.start_time);
      return predictionDate >= startOfDay && predictionDate < endOfDay;
    });

    setDailyPredictions(todayPredictions);
  }, [predictions]);


  const renderContent = () => {
  
    if (selectedTab === 'Overview') {
      return  <DailyOverViewScreen predictions={predictions} />
    } else if (selectedTab === 'Timeline') {
      return  <DailyTimeLineScreen predictions={predictions} />
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Overview' && styles.activeTab]}
          onPress={() => setSelectedTab('Overview')}
        >
          <Text style={[styles.tabText, selectedTab === 'Overview' && styles.selectedtabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Timeline' && styles.activeTab]}
          onPress={() => setSelectedTab('Timeline')}
        >
          <Text style={[styles.tabText, selectedTab === 'Timeline' && styles.selectedtabText]}>Timeline</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 80,
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#EDEDED',
    borderBottomWidth: 1,
    alignSelf: 'center',


  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0065FF',
    backgroundColor: '#E6F0FF',
    alignSelf: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#838383',
    fontWeight: 'bold',
   
  },
  selectedtabText: {
    fontSize: 16,
    color: '#0065FF',
  },
  contentText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DailyActivityTabbarScreen;
