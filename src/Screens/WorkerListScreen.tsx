import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { getAllWorkerList } from '../api/userService';
import { getLastPredictionByUserAPI } from '../api/predictionService';
import LoaderOverlay from '../shared/LoaderOverlay';
import Header from '../shared/Header';
import { header, demo_1, demo_2, demo_3, STATE_COLORS, right_arrow, getStateColor, getStateTextColor } from '../assets/Constants';
import moment from 'moment-timezone';

interface WorkerType {
  user_id: string;
  user_name: string;
  user_role: string;
  user_password: string;
}

interface PredictionType {
  user_id: string;
  prediction: string;
  start_time: string;
}

function WorkerListScreen({ navigation }) {

   const [workers, setWorkers] = useState<WorkerType[]>([]);
  const [predictions, setPredictions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const workerData = await getAllWorkerList();
        setWorkers(workerData);

        const predictionData: PredictionType[] = await getLastPredictionByUserAPI();
        console.log("predictionData is ", predictionData);
        console.log("Worker data  is ", workerData);

        const predictionMap: Record<string, string> = {};

        const currentTime = moment().tz("Asia/Karachi");   // ⬅️ changed line
        workerData.forEach(worker => {
          const prediction = predictionData.find(p => p.user_id.toLowerCase() === worker.user_id.toLowerCase());
          if (prediction) {
            const predictionTime = moment(prediction.start_time)
                      
             const timeDifference = currentTime.diff(predictionTime, 'seconds');
            console.log("timeDifference is ", predictionTime, currentTime, timeDifference);
            predictionMap[worker.user_id] = timeDifference > 60 ? 'Idle' : prediction.prediction;
          } else {
            predictionMap[worker.user_id] = 'Idle';
          }
        });

         setPredictions(predictionMap);
      } catch (error) {
        console.error('Failed to fetch worker list or predictions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  const images = [demo_1, demo_2, demo_3];

  const renderItem = ({ item, index }: { item: WorkerType, index: number }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ActivityDetailsScreen', { user: item })}>
      <View style={styles.itemContainer}>
        <Image source={images[index % images.length]} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.itemName}>{item.user_name}</Text>
          <View
            style={[styles.roleContainer, {
              backgroundColor: getStateColor(predictions[item.user_id]),
              paddingHorizontal: predictions[item.user_id] ? (predictions[item.user_id].length < 6 ? 12 : 8) : 12,
            }]}
          >
            <Text style={[styles.itemRole, { color: getStateTextColor(predictions[item.user_id]) }]}>{predictions[item.user_id]}</Text>
          </View>
        </View>
        <Image source={right_arrow} style={styles.arrow} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LoaderOverlay visible={loading} />
      <Image source={header} style={styles.headerImage} />
      <Text style={styles.pageHeading}>Workers List</Text>
      <FlatList
        data={workers}
        renderItem={renderItem}
        keyExtractor={(item) => item.user_id}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#EDEDED',
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 15,
  },
  pageHeading: {
    fontSize: 16,
    color: '#000000',
    marginHorizontal: 16,
    fontWeight: 'bold',
    marginBottom: 12,
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
    width: 80,
  },
  itemName: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  itemRole: {
    fontSize: 16,
    color: '#FFD700',
    flex: 1,
    lineHeight: 16,
  },
  headerImage: {
    width: 198,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 70,
    marginBottom: 20,
  },
  arrow: {
    width: 20,
    height: 20,
  },
  roleContainer: {
    backgroundColor: STATE_COLORS.IDLE,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    height: 32,
    marginTop: 8,
  },
});

export default WorkerListScreen;
