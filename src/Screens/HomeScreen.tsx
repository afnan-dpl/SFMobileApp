import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Modal, TouchableOpacity } from 'react-native';
import LoaderOverlay from '../shared/LoaderOverlay';
import { getPredictionAPIByPageNumber } from '../api/predictionService';
import moment from 'moment';
import Header from '../shared/Header';
import { getPredictionAPIByType } from '../api/predictionService';
import { getLatestRecordById } from '../api/predictionService';

const HomeScreen = () => {
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterText, setFilterText] = useState('Filter');
  const [backupPredictions, setBackupPredictions] = useState<Prediction[]>([]);
  const [latestId, setLatestId] = useState(0);


  const fetchPredictionList = async (pageNumber: number) => {
    try {
      const data = await getPredictionAPIByPageNumber(pageNumber);
      console.log('Page number is : ', pageNumber);
      setPredictions((prevPredictions) => {
        const existingIds = new Set(prevPredictions.map((p) => p.id));
        const newPredictions = data.filter((p) => !existingIds.has(p.id));
        return [...prevPredictions, ...newPredictions].sort((a, b) => b.id - a.id);
      });
      const maxId = Math.max(...data.map((p) => p.id), latestId);
      setLatestId(maxId);
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
    }
  };


 

  const fetchPredictionsByType = async (type: string) => {
    setLoading(true);
    try {
      if (type === 'All Data') {
        setPredictions(backupPredictions);
      } else {
        const data = await getPredictionAPIByType(type);
        setBackupPredictions(predictions);
        setPredictions(data);
      }
    } catch (error) {
      console.error('Failed to fetch predictions by type:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    if (filterText === 'Filter' || filterText === 'All Data') {
      setRefreshing(true);
      try {
        const data = await getPredictionAPIByPageNumber(1);
        setPredictions(data);
      } catch (error) {
        console.error('Failed to refresh predictions:', error);
      } finally {
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    const loadPredictions = async () => {
      setLoading(true);
      await fetchPredictionList(page);
      setLoading(false);
    };

    loadPredictions();
  }, []);

  useEffect(() => {
    if (latestId > 0) {
      const interval = setInterval(async () => {
        try {

          const newRecord = await getLatestRecordById(latestId);
          if (newRecord.length > 0 ) {
            console.log('New record:', newRecord);
            setPredictions((prevPredictions) => {
              const existingIds = new Set(prevPredictions.map((p) => p.id));
              const newPredictions = newRecord.filter((p) => !existingIds.has(p.id));
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

  
  const handleEndReached = () => {
    if (filterText === 'Filter' || filterText === 'All Data') {
      setPage((prevPage) => prevPage + 1);
      fetchPredictionList(page);
    }
  };
  

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.rowContainer}>
        <Text style={styles.itemHeading}>Prediction: </Text>
        <Text style={styles.itemData}>{item.prediction}</Text>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.itemHeading}>From: </Text>
        <Text style={styles.itemData}>{moment(item.start_time).format('MMM D, h:mm A')}</Text>
      </View>
      <View style={styles.rowContainer}>
        <Text style={styles.itemHeading}>To: </Text>
        <Text style={styles.itemData}>{moment(item.end_time).format('MMM D, h:mm A')}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="SmartWorkForce" />
      <Button title={filterText} onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {['Other', 'Sweeping', 'Mopping', 'Scrubbing', 'All Data'].map((option) => (
              <TouchableOpacity key={option} onPress={() => {
                setFilterText(option);
                fetchPredictionsByType(option);
                setModalVisible(false);
              }}>
                <Text style={styles.modalText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
      <LoaderOverlay visible={loading} />
      <FlatList
        data={predictions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 10,
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
  itemData: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
  },
});

export default HomeScreen;
