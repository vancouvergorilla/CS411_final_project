import React, { Component } from "react";
import PhotoUpload from 'react-native-photo-upload';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TextInput,
} from "react-native";
import { Icon, Button } from 'native-base'
import RNFetchBlob from 'react-native-fetch-blob'
import * as firebase from 'firebase';

var Buffer = require('buffer/').Buffer
const uuidv1 = require('uuid/v1');

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
const tempWindowXMLHttpRequest = window.XMLHttpRequest;
const tempBlob = window.Blob;

var config = {
    apiKey: "AIzaSyDeWlKL6cvj_OYFQT2DD6dWjY_uPDDkWxQ",
    authDomain: "petmania-525f0.firebaseapp.com",
    databaseURL: "https://petmania-525f0.firebaseio.com",
    projectId: "petmania-525f0",
    storageBucket: "petmania-525f0.appspot.com",
    messagingSenderId: "1055437321479"
};
firebase.initializeApp(config);
var storage = firebase.storage();

class AddMediaTab extends Component {
  constructor(props){
    super(props);
    this.state = {
      imageUrl: '',
      text: '',
      username: this.props.navigation.state.params.username
    };
    this.submitPost = this.submitPost.bind(this)
    this.getDate = this.getDate.bind(this)
    this.rerender = this.rerender.bind(this)
  }

    static navigationOptions = {

        tabBarIcon: ({ tintColor }) => (
            <Icon name="ios-add-circle" style={{ color: tintColor }} />
        ),
        title: 'PetMania',
        headerLeft: null,
        swipeEnabled: false,
    }

    getDate(){
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      if(dd < 10) {
          dd = '0' + dd
      }

      if(mm < 10) {
          mm = '0' + mm
      }

      today = yyyy + mm + dd  ;
      return today
    }

    rerender(){
      this.forceUpdate();
    }

    submitPost(){
      window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
      window.Blob = Blob;
      if (this.state.imageUrl.length == 0) {alert("Image empty")}
      else{
        console.log("post ready to send")

        let date = this.getDate()
        let url = "http://localhost:3000/todos/create_post/" + date + "/" + this.state.username

        let image_uri = this.state.imageUrl['path'];
        console.log(this.state.imageUrl)
        var storageRef = firebase.storage().ref('/images/');
        let uuid = uuidv1();

        // *** send file ***

        let imageFile = RNFetchBlob.wrap(image_uri);
        let uploadBlob = null

        Blob.build(imageFile, { type: 'image/jpg' })
            .then((imageBlob) => {
                console.log("hey")
                uploadBlob = imageBlob;
                return storageRef.child(`${uuid}`).put(imageBlob, { contentType: 'image/jpg' });
            })
            .then(() => {
                console.log("here")
                uploadBlob.close();
                return storageRef.child(`${uuid}`).getDownloadURL()
            })
            .then((image_url) => {
                console.log(image_url)
                window.XMLHttpRequest = tempWindowXMLHttpRequest;
                window.Blob = tempBlob;
                fetch(url, {
                  method: "POST",
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                  },
                  body: "text=" + this.state.text + "&image=" + escape(image_url)
                })
                .then(function(response){
                  console.log(response.status)
                  if(response.status == '200'){
                    console.log("success");
                    alert("Post success")
                  }
                  else{
                    alert("Post failed");
                  }
                });
                this.setState({
                  imgURL: '',
                  text: ''
                })
                this.rerender();
            })
            .catch((error) => {console.log(error)})
      }
    }

    render() {
      const { navigate } = this.props.navigation;
        return (
          <View>
              <View style={styles.container}>
                      <PhotoUpload
                        onResizedImageUri={avatar => {
                          if (avatar) {
                              this.setState({
                                imageUrl: avatar
                              });
                          }
                      }
                    }
                  >
                  <Image
                      style={styles.upload}
                      resizeMode='contain'
                      source={{
                          uri: 'https://www.faberin.com/storage/images/icons/iconplus.png'
                      }}
                     />
                  </PhotoUpload>
              </View>
                <TextInput
                   style={styles.text}
                   editable = {true}
                   multiline = {true}
                   numberOfLines = {4}
                   onChangeText={(inputtext) => {
                       this.setState({text: inputtext});
                   }}
                   placeholder="Say something..."
                />
              <Button style={styles.but} onPress={this.submitPost}>
                <Text>Post</Text>
              </Button>
          </View>
        );
    }
}
export default AddMediaTab;

const styles = StyleSheet.create({
    container: {
      flex: 0,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'yellow',
      marginTop: 10,
    },
    upload: {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 10,
      width: Dimensions.get('window').width*0.95,
      height: Dimensions.get('window').width*0.95
    },
    inputField: {
      borderBottomColor: '#000000',
      borderBottomWidth: 1
    },
    text:{
      marginTop: Dimensions.get('window').width-10,
      marginLeft: Dimensions.get('window').width*0.025,
      width: Dimensions.get('window').width*0.95,
      zIndex: 2,
      height: Dimensions.get('window').width * 0.3,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 10,
      padding: 15
    },
    but:{
      marginTop: 10,
      width: Dimensions.get('window').width * 0.6,
      marginLeft: Dimensions.get('window').width * 0.2,
      backgroundColor: '#b2bec3',
      justifyContent: 'center',
    }
});
