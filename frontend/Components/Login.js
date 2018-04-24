import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, AppRegistry, Dimensions, TextInput } from 'react-native';
import { Container, Header, Content, Button, Item, Input, Label} from 'native-base';
import MainScreen from './MainScreen'
import RegisterScreen from './RegisterScreen'
import { StackNavigator, TabNavigator, SwitchNavigator } from 'react-navigation';

const remote = 'https://i.pinimg.com/originals/8a/d4/ba/8ad4ba24bb017a1e5a3216a9d17c8e2b.jpg';
var window_width = Dimensions.get('window').width
var window_height = Dimensions.get('window').height

export default class Login extends Component {
  static navigationOptions = {
        header: null,
  }

  constructor(props){
    super(props)

    this.state = {
      username: '',
      password: '',
    }
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

  handleSignup(navigate){
    navigate("Register");
  }

  handleClick(navigate){
    let url = "http://localhost:3000/todos/login_process/" + this.state.username.toLowerCase() + "/" + this.state.password
    console.log(url)
    fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      }
    })
    .then((response)=>{
      console.log(response.status)
      if(response.status == '200'){
        // alert("TODO");
        console.log("success");
        this.props.navigation.navigate("Main", {username: this.state.username.toLowerCase()});
      }
      else{
        alert("Please check username or password");
      }
    });
  }

  changeUsername(text){
    this.setState({
        username :text,
    })
  }

  changePassword(text){
    this.setState({
        password :text,
    })
  }





  render() {
    const { navigate } = this.props.navigation;
    const resizeMode = 'cover';
    const text = 'PetMania';

    return (

      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <Image
            style={{
              flex: 1,
              resizeMode,
            }}
            source={{ uri: remote }}
          />
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.8)',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              position: 'absolute',
              top: 250,
              left: 100,
              fontSize: 40,
              fontFamily: "FontAwesome"
            }}
          >
            {text}
          </Text>
          <Item stackedLabel style={{marginTop: 100, width: window_width*0.8, marginLeft: window_width*0.1}}>
              <Label>Username</Label>
              <Input onChangeText={(text) => {
                  this.changeUsername(text)
                }} />
            </Item>
            <Item stackedLabel last style={{width: window_width*0.8, marginLeft: window_width*0.1}}>
              <Label>Password</Label>
              <Input onChangeText={(text) => this.changePassword(text)} />
          </Item>
            <Button block dark style={{marginTop: 50, width: 300, borderRadius: 20, marginLeft: window_width/2 - 150}} onPress= {() => this.handleClick(navigate)}>
              <Text style={{color:'white'}}>Submit</Text>
            </Button>
            <Button block dark style={{marginTop: 10, width: 300, borderRadius: 20, marginLeft: window_width/2 - 150}} onPress= {() => this.handleSignup(navigate)}>
              <Text style={{color:'white'}}>Sign up</Text>
            </Button>
        </View>
      </View>
    );
  }
}

AppRegistry.registerComponent('Login', () => Login);
