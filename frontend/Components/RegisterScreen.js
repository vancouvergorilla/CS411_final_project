import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, AppRegistry, Dimensions, TextInput,DatePickerIOS } from 'react-native';
import { Container, Content, Icon, Header, Left, Body, Right, Segment, Button, Item, Input, Label, Form } from 'native-base'
import MainScreen from './MainScreen'
import Login from './Login'
import { StackNavigator, SwitchNavigator, TabNavigator } from 'react-navigation';
import DatePicker from 'react-native-datepicker'
import PhotoUpload from 'react-native-photo-upload';

const remote = 'https://i.pinimg.com/originals/8a/d4/ba/8ad4ba24bb017a1e5a3216a9d17c8e2b.jpg';
var window_width = Dimensions.get('window').width
var window_height = Dimensions.get('window').height
var thumbnail_arr = [
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F018.png?alt=media&token=8207889a-7ec2-4ad8-a644-56c7756502d3',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F300100010.png?alt=media&token=299d6594-29e3-4751-afae-33e0b1e6f1f0',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F30010003.png?alt=media&token=a5bb0b08-f785-45dc-ac7d-8fff3f239981',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F30010004.png?alt=media&token=e816f007-c334-46f6-b8d6-e675f7b2e4db',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F30011006.png?alt=media&token=20a0da61-0b91-4085-b181-3b1370701307',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F30011007.png?alt=media&token=0ddc4a38-8c79-444f-9c89-53b0c71d5292',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F30011009.png?alt=media&token=fdde285c-9b9a-45cb-8517-bf0751b2d0a7',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F30012001.png?alt=media&token=5825d7aa-60fc-47da-978a-0ae7b0b7fd67',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F300120012.png?alt=media&token=d9abac43-b4e3-42be-b077-b77427985559',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F300120013.png?alt=media&token=bf6f3226-99d3-4a96-ab2e-7621cd40798f',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F300120015.png?alt=media&token=b5b326bb-e4d3-45de-b7bc-d9ec27fed737',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F30012003.png?alt=media&token=5b7e57a6-abf0-466a-8f6b-04cb0c80436f',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F30012006.png?alt=media&token=7923ef72-9e55-4f3e-b15c-3ef70c29a5b9',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F30012007.png?alt=media&token=57c9532d-4da4-43e1-9749-86b182cf37aa',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F30012008.png?alt=media&token=eef72925-6434-46c5-b192-4e1b4ff6aca3',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F300170011.png?alt=media&token=bdd281bb-dc05-4eba-9e21-95b2e78d7905',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F3006003.png?alt=media&token=a49ea94d-df35-4c2f-83d9-d8fe842efde8',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2Ftest.png?alt=media&token=cc55d463-93f2-497f-9ff5-df3e8770d114',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F30090010.png?alt=media&token=9f925852-6e0e-480c-8af7-6fd02a2c9b19',
  'https://firebasestorage.googleapis.com/v0/b/petmania-525f0.appspot.com/o/thumbnail%2F30022009.png?alt=media&token=d3ab0532-4129-45d3-97b8-0da90388b57c'
]

export default class RegisterScreen extends Component {
  static navigationOptions = {
        swipeEnabled: false,
  }

  constructor(props){
    super(props)

    this.state = {
      username: '',
      password: '',
      dob: '',
      gender: '',
      name: '',
      region: '',
      petName: '',
      kind: '',
      breed: '',
      petGender: '',
    }
    this.registerAccount = this.registerAccount.bind(this);
    this.props.navigation.navigate = this.props.navigation.navigate.bind(this);
  }

  registerAccount(navigate){
    console.log(this.state.username.toLowerCase())
    var head_url = thumbnail_arr[Math.floor(Math.random()*thumbnail_arr.length)];
    head_url = escape(head_url)

    let t = this
    let url = "http://localhost:3000/todos/add_user/"
    console.log(url)
    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: "username="+this.state.username.toLowerCase() + "&password="+this.state.password + "&DOB="+this.state.dob + "&gender="+this.state.gender.toLowerCase()
      + "&name="+this.state.name + "&region="+this.state.region + "&petName="+this.state.petName + "&petKind="+this.state.kind + "&petBreed="+this.state.breed
      + "&petGender="+this.state.petGender.toLowerCase() + "&head=" + head_url,
    })
    .then(function(response){
      console.log(response.status)
      if(response.status == '200'){
        navigate("Main", {username: t.state.username.toLowerCase()});
      }
      else{
        alert("Duplicate username! Please use another username.");
      }
    });
  }

  render() {
    const { navigate } = this.props.navigation;
        return (
          <Container>
          <Content>
            <View style={{marginTop: 10, alignItems:'center', }}>
              <Text style={{fontSize: 20}}> Please enter your information </Text>
            </View>
            <Form>
              <Item fixedLabel>
                <Label>Username</Label>
                <Input onChangeText={(text) => this.setState({ username :text,}) }/>
              </Item>
              <Item fixedLabel>
                <Label>Password</Label>
                <Input onChangeText={(text) => this.setState({ password :text,}) }/>
              </Item>
              <Item fixedLabel>
                <Label>DOB</Label>
                <DatePicker
                  style={{width: 300}}
                  date={this.state.date}
                  mode="date"
                  placeholder="select date"
                  format="YYYY-MM-DD"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0
                    },
                    dateInput: {
                      marginLeft: 36
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => {this.setState({date: date, dob: date})}}
                />
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
                  <Input placeholder={"e.g. Dog"} placeholderTextColor={'#D3D3D3'} onChangeText={(text) => this.setState({ kind :text,}) }/>
                </Item>

                <Item fixedLabel>
                  <Label>Breed</Label>
                  <Input placeholder={"e.g. Golden Retriever"} placeholderTextColor={'#D3D3D3'} onChangeText={(text) => this.setState({ breed :text,}) }/>
                </Item>

                <Item fixedLabel>
                  <Label>Pet Gender</Label>
                  <Input placeholder={"male or female"} placeholderTextColor={'#D3D3D3'} onChangeText={(text) => this.setState({ petGender :text,}) }/>
                </Item>
                <Button block info style={{top: 10}}
                  onPress = {() => {
                      this.registerAccount(navigate)
                  }}>
                  <Text style={{color: 'white'}}>Register</Text>
                </Button>
            </Form>
          </Content>
        </Container>
        );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
