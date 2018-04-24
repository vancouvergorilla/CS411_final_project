import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    FlatList
} from "react-native";

import { Container, Content, Icon, Header, Left, Body, Right, Segment, Button, Item, Input, Label, Form } from 'native-base'
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { SwitchNavigator, StackNavigator, TabNavigator } from 'react-navigation'
import { FormLabel, FormInput } from 'react-native-elements'
import DatePicker from 'react-native-datepicker'

var { height, width } = Dimensions.get('window');

class EditProfile extends Component {

  static navigationOptions = {

      tabBarIcon: ({ tintColor }) => (
          <Icon name="person" style={{ color: tintColor }} />
      ),
      title: 'PetMania',

  }

    constructor(props){
        super(props)
        this.state = {
          username: this.props.navigation.state.params.username,
          password: '',
          gender: '',
          name: '',
          region: '',
          petName: '',
          petKind: '',
          petBreed: '',
          petGender: '',
        }
        this.saveChange = this.saveChange.bind(this);
        this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
    }

    saveChange() {
        let t = this
        let url = "http://localhost:3000/todos/search_exact_is/User/username/" + this.state.username
        fetch(url, {
          method: "GET",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
        }).then(resp =>
          resp.json().then(data => ({
              data: data,
              status: resp.status
          })).then(res => {
              var user_info = res.data.data[0]
              console.log(user_info)
              console.log(t.state)
              var password = user_info['password']
              if(t.state.password != ''){
                password = t.state.password
              }
              var gender = user_info['gender']
              if(t.state.gender != ''){
                gender = t.state.gender
              }
              var name = user_info['name']
              if(t.state.name != ''){
                name = t.state.name
              }
              var region = user_info['region']
              if(t.state.region != ''){
                region = t.state.region
              }
              var petName = user_info['petName']
              if(t.state.petName != ''){
                petName = t.state.petName
              }
              var petBreed = user_info['petBreed']
              if(t.state.petBreed != ''){
                petBreed = t.state.petBreed
              }
              var petKind = user_info['petKind']
              if(t.state.petKind != ''){
                petKind = t.state.petKind
              }
              var petGender = user_info['petGender']
              if(t.state.petGender != ''){
                petGender = t.state.petGender
              }

              let url = "http://localhost:3000/todos/update_all_user_info/"

              fetch(url, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                },
                body: "username=" + t.state.username + "&password="+ password + "&gender="+ gender.toLowerCase()
                + "&name="+ name + "&region="+ region + "&petName="+ petName + "&petKind="+ petKind + "&petBreed=" + petBreed + "&petGender="+ petGender.toLowerCase(),
              }).then(res => {
                  if(res.status == 200){
                    alert("Change saved")
                  }
                  else{
                    console.log(res)
                    alert("Change failed")
                  }
              })
          })
        )
    }


    render() {
      const { navigate } = this.props.navigation;
          return (
            <Container>
            <Content>
              <View style={{marginTop: 20, alignItems:'center', }}>
                <Text style={{fontSize: 20}}> Please enter your changes </Text>
              </View>
              <Form>
                <Item fixedLabel>
                  <Label>Password</Label>
                  <Input onChangeText={(text) => this.setState({ password :text,}) }/>
                </Item>
                <Item fixedLabel>
                  <Label>Gender</Label>
                  <Input placeholder={"male or female"} placeholderTextColor={'#D3D3D3'} onChangeText={(text) => this.setState({ gender :text,}) }/>
                </Item>
                <Item fixedLabel>
                  <Label>Name</Label>
                  <Input onChangeText={(text) => this.setState({ name :text,}) } />
                  </Item>

                  <Item fixedLabel>
                    <Label>Region</Label>
                    <Input placeholder={"e.g. Illinois"} placeholderTextColor={'#D3D3D3'} onChangeText={(text) => this.setState({ region :text,}) }/>
                  </Item>

                  <Item fixedLabel>
                    <Label>Pet Name</Label>
                    <Input onChangeText={(text) => this.setState({ petName :text,}) }/>
                  </Item>

                  <Item fixedLabel>
                    <Label>Kind</Label>
                    <Input placeholder={"e.g. Dog"} placeholderTextColor={'#D3D3D3'} onChangeText={(text) => this.setState({ petKind :text,}) }/>
                  </Item>

                  <Item fixedLabel>
                    <Label>Breed</Label>
                    <Input placeholder={"e.g. Golden Retriever"} placeholderTextColor={'#D3D3D3'} onChangeText={(text) => this.setState({ petBreed :text,}) }/>
                  </Item>

                  <Item fixedLabel>
                    <Label>Pet Gender</Label>
                    <Input placeholder={"male or female"} placeholderTextColor={'#D3D3D3'} onChangeText={(text) => this.setState({ petGender :text,}) }/>
                  </Item>
                  <Button block info style={{top: 10}}
                    onPress = {() => {
                        this.saveChange()
                    }}>
                    <Text style={{color: 'white'}}>Save</Text>
                  </Button>
              </Form>
            </Content>
          </Container>
          );
    }
}

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});
