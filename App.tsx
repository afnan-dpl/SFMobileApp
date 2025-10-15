/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from "react";
import type { PropsWithChildren } from 'react';
import {
  StyleSheet,
  Text,
  useColorScheme,
  View,
  LogBox
} from 'react-native';

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from "./src/AppNavigator";


import CodePush, { DownloadProgress } from 'react-native-code-push';
 


let codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START, 
  installMode: CodePush.InstallMode.ON_NEXT_RESTART,
  mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
};




function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
 
 

  useEffect((): void => {
    LogBox.ignoreAllLogs();

    CodePush.sync(
      {
        installMode: CodePush.InstallMode.IMMEDIATE,
        updateDialog: true, // shows default dialog
      },
      (status) => {
        console.log("CodePush status:", status);
      },
      (downloadProgress) => {
        console.log(
          `Downloaded ${downloadProgress.receivedBytes} of ${downloadProgress.totalBytes} bytes.`
        );
        setProgress(downloadProgress);
      }
    );
  }, []);

 

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },

});

const CodePushApp = CodePush(codePushOptions)(App);

export default CodePushApp;