import React from 'react';
import { TextInput, View, StyleSheet, Alert, Image, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import { login } from '../api/userService';
import LoaderOverlay from '../shared/LoaderOverlay';
import { header } from '../assets/Constants';
import { useNavigation } from '@react-navigation/native';


function LoginScreen({ navigation }) {


  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      const credentials = { "user_name": username, "user_password": password };
      const response = await login(credentials);
      Alert.alert('Success', 'Login successful', [
        {
          text: 'OK',
          onPress: () => navigation && navigation.navigate && navigation.navigate('WorkerListScreen'),
        },
      ]);
    } catch (error) {
      console.log("error is ", error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LoaderOverlay visible={loading} />
      <Image source={header} style={styles.headerImage} />
      <View style={styles.spacer} />
      <Text style={styles.label}>Username</Text>
      <TextInput
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Login
      </Button>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  headerImage: {
    width: 198,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#DFE4EA',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#0065FF',
    borderColor: '#059669',
    borderWidth: 1,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 12,
    borderRadius: 8,


  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  spacer: {
    height: 20,
  },
});

export default LoginScreen;
