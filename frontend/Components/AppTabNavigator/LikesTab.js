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

var storage = firebase.storage();

const catCategory = {
                      0: "Abyssinian",
                      1: "Bengal",
                      2: "Bombay",
                      3: "British",
                      4: "Egyptian",
                      5: "Persian",
                      6: "Ragdoll",
                    }



class LikesTab extends Component {

    constructor(props) {
      super(props);
      this.state = {
        username: this.props.navigation.state.params.username,
        imageUrl: 'aaa',
      };
      this.submitImage = this.submitImage.bind(this)
    }

    static navigationOptions = {

        tabBarIcon: ({ tintColor }) => (
            <Icon name="ios-bulb" style={{ color: tintColor }} />
        ),
        title: 'PetMania',
        headerLeft: null,
        swipeEnabled: false,
    }

    submitImage(){
      console.log("begin submit")
      if (this.state.imageUrl.length == 0) {alert("Image empty")}
      else{
        let image_uri = this.state.imageUrl['path'];
        var storageRef = firebase.storage().ref('/detection/');
        let uuid = uuidv1();

        // *** send file ***
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;
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
                let url = "http://localhost:3000/todos/get_image_firebase_url/"
                fetch(url, {
                  method: "GET",
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'firebase_url': image_url,
                  },
                }).then(res => {
                  let url = "http://localhost:3000/todos/face_detection/" + "temp_miao.jpeg"
                  fetch(url, {
                    method: "GET",
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    },
                  }).then(res => {
                      if(res.status === 200){
                        console.log("face detect success")
                        let url = "http://localhost:3000/todos/face_classifier/" + "face_temp_miao.jpeg"
                        fetch(url, {
                          method: "GET",
                          headers: {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                            'firebase_url': image_url,
                          },
                        }).then(response =>
                            response.json().then(data => ({
                                data: data,
                                status: response.status
                            })
                        ).then(async (res) => {
                            if(res.status === 200){
                              alert(catCategory[res.data.data])
                            }
                            else{
                              alert("Classification fail")
                            }
                        }))
                      }
                      else{
                        alert("Please upload a clearer photo")
                      }
                  })
                })
            })
            .catch((error) => {console.log(error)})
      }
    }

    render() {
      const { navigate } = this.props.navigation;
        return (
          <View>
            <View style={{marginTop: 10, alignItems:'center', }}>
              <Text style={{fontSize: 20}}> Please enter a photo to identify breed </Text>
            </View>
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
              <Button style={styles.but} onPress={this.submitImage}>
                <Text>Submit</Text>
              </Button>
          </View>
        );
    }
}
export default LikesTab;

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
    but:{
      marginTop: Dimensions.get('window').width-10,
      marginLeft: Dimensions.get('window').width*0.2,
      width: Dimensions.get('window').width * 0.6,
      backgroundColor: '#b2bec3',
      justifyContent: 'center',
    },
});
