import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Platform
} from "react-native";

import HomeTab from './AppTabNavigator/HomeTab'
import SearchTab from './AppTabNavigator/SearchTab'
import AddMediaTab from './AppTabNavigator/AddMediaTab'
import LikesTab from './AppTabNavigator/LikesTab'
import ProfileTab from './AppTabNavigator/ProfileTab'
import EditProfile from './AppTabNavigator/EditProfile'
import Login from './Login'
import RegisterScreen from './RegisterScreen'

import { TabNavigator, StackNavigator } from 'react-navigation'
import { Icon } from 'native-base'

class MainScreen extends Component {

    static navigationOptions = {

        header:'null',
        swipeEnabled: false,
    }

    render() {
        return (
            <AppStackNavigator />
        );
    }
}
export default MainScreen;




const AppStackNavigator = StackNavigator({
  Login: { screen: Login },
  Register: { screen: RegisterScreen},
  Main: { screen: TabNavigator({

                  HomeTab: {
                      screen: HomeTab
                  },
                  SearchTab: {
                      screen: SearchTab
                  },
                  AddMediaTab: {
                      screen: AddMediaTab
                  },
                  LikesTab: {
                      screen: LikesTab
                  },
                  ProfileTab: {
                      screen: ProfileTab
                  },

              }, {
                      animationEnabled: true,
                      swipeEnabled: true,
                      tabBarPosition: "bottom",
                      tabBarOptions: {
                          style: {
                              ...Platform.select({
                                  android: {
                                      backgroundColor: 'white'
                                  }
                              })
                          },
                          activeTintColor: '#000',
                          inactiveTintColor: '#d1cece',
                          showLabel: false,
                          showIcon: true
                      }
                  })
      },
      EditProfile: { screen: EditProfile},
    },
    {
        navigationOptions: {
          gesturesEnabled: false
        }
    }
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
