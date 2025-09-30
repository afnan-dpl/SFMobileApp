// AppNavigator.tsx
import React from "react";
import { Dimensions } from "react-native";
import {
  createAppContainer,
  NavigationContainerComponent,
} from "react-navigation";
import {
  createStackNavigator,
  StackNavigationOptions,
} from "react-navigation-stack";
import {
  createDrawerNavigator,
  DrawerNavigatorConfig,
} from "react-navigation-drawer";
import SplashScreen from "./Screens/SplashScreen";
import HomeScreen from "./Screens/HomeScreen";
import LoginScreen from "./Screens/LoginScreen";
import WorkerListScreen from "./Screens/WorkerListScreen";
import ActivityDetailsScreen from "./Screens/ActivityDetailsScreen";
import DailyActivityTabbarScreen from "./Screens/DailyActivityTabbarScreen";
import DailyTimeLineScreen from "./Screens/DailyTimeLineScreen";
import WeeklyOverViewScreen from "./Screens/WeeklyOverViewScreen";



// import RGDrawerContainer from "./Screens/RGDrawerContainer"; // <-- ensure this exists

const { width, height } = Dimensions.get("window");

// Define types for stack param list (if you want strong typing later) 

const MainStack = createStackNavigator(
  {
    SplashScreen: {
      screen: SplashScreen,
      navigationOptions: { gestureEnabled: false } as StackNavigationOptions,
    },
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: { gestureEnabled: false } as StackNavigationOptions,
    },
    LoginScreen: {
      screen: LoginScreen,
      navigationOptions: { gestureEnabled: false } as StackNavigationOptions,
    },
    WorkerListScreen: {
      screen: WorkerListScreen,
      navigationOptions: { gestureEnabled: false } as StackNavigationOptions,
    },
    ActivityDetailsScreen: {
      screen: ActivityDetailsScreen,
      navigationOptions: { gestureEnabled: false } as StackNavigationOptions,
    },
    DailyActivityTabbarScreen: {
      screen: DailyActivityTabbarScreen,
      navigationOptions: { gestureEnabled: false } as StackNavigationOptions,
    },
    DailyTimeLineScreen: {
      screen: DailyTimeLineScreen,
      navigationOptions: { gestureEnabled: false } as StackNavigationOptions,
    },
    WeeklyOverViewScreen: {
      screen: WeeklyOverViewScreen,
      navigationOptions: { gestureEnabled: false } as StackNavigationOptions,
    },
  },
  {
    initialRouteName: "LoginScreen",
    headerMode: "none",
    defaultNavigationOptions: {
      headerTitleAlign: "center",
    },
  }
);

const RootNavigator = createDrawerNavigator(
  {
    Main: {
      screen: MainStack,
    },
  },
 
);

const AppNavigator: NavigationContainerComponent = createAppContainer(RootNavigator);

export default AppNavigator;