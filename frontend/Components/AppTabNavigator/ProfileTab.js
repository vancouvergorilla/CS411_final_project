import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    FlatList,
    RefreshControl
} from "react-native";

import { Card, CardItem, Thumbnail, Container, Content, Icon, Header, Left, Body, Right, Segment, Button, Item, Input, Label, Form } from 'native-base'
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { SwitchNavigator, StackNavigator, NavigationActions } from 'react-navigation'
import { FormLabel, FormInput } from 'react-native-elements'
import Login from '../Login'
import EditProfile from './EditProfile'

var { height, width } = Dimensions.get('window');
var Promise = require('bluebird');

// window.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

class ProfileTab extends Component {


    static navigationOptions = {

        tabBarIcon: ({ tintColor }) => (
            <Icon name="ios-person" style={{ color: tintColor }} />
        ),
        title: 'PetMania',
        headerLeft: null,
        swipeEnabled: false,
    }

    constructor(props) {
        super(props)
        this.state = {
            activeIndex: 0,
            username: this.props.navigation.state.params.username,
            postlist : null,
            refreshing: false,
            name: '',
            region:  '',
            petName: '',
            num_post: '',
            num_follower: '',
            num_followee: '',
            thumbnail: '',
        }
        this.renderSection = this.renderSection.bind(this)
        this.loadContent = this.loadContent.bind(this)

    }

    componentWillMount(){
      let t = this
      let url = "http://localhost:3000/todos/get_user_info/" + t.state.username;
      fetch(url, {
        method: "GET",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        }
      })
      .then(resp =>
        resp.json().then(data => ({
            data: data,
            status: resp.status
        })).then(res => {
              console.log(res)
              var data_post = res.data.data[0]
              t.state.name = data_post['name']
              t.state.region = data_post['region']
              t.state.petName = data_post['petName']
              t.state.num_post = data_post['num_post']
              t.state.num_follower = data_post['num_follower']
              t.state.num_followee = data_post['num_followee']

              let url = "http://localhost:3000/todos/search_exact_is/User/username/" + t.state.username
              return fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                  }
              }).then(resp =>
                resp.json().then(data => ({
                    data: data,
                    status: resp.status
                })).then(res => {
                      var data_post = res.data.data[0]
                      var thumbnail_url = data_post['head']
                      console.log(thumbnail_url)
                      t.setState({
                        thumbnail: thumbnail_url
                      })
                    })
                  )
            })
          )
    }

    loadContent(){
      // console.log("CWM")
      let url = "http://localhost:3000/todos/fetch_profile_post/" + this.state.username.toLowerCase()
      // console.log(url)
      var t = this
      var post_res = null

      return fetch(url, {
        method: "GET",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        }
      }).then(response =>
          response.json().then(data => ({
              data: data,
              status: response.status
          })
      ).then(async (res) => {
          var data_arr = (res.data.data).reverse()
          // console.log(data_arr)
          if(res.status == '200'){
            // alert("TODO");
            // console.log("success 1");
            Promise.map(data_arr, function(data_arr){
                var poid = data_arr['POID']
                // console.log('current poid: ' + poid)
                let url = "http://localhost:3000/todos/search_exact_is/Post/POID/" + poid

                var card_template = "Not changed yet..........."

                return fetch(url, {
                  method: "GET",
                  headers: {
                      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    }
                  }).then(resp =>
                    resp.json().then(data => ({
                        data: data,
                        status: resp.status
                    })).then(res => {
                          var data_post = res.data.data[0]
                          if(res.status == '200'){
                            // alert("TODO");
                            // console.log("success 2");
                            // console.log(data_post)
                            var image_url = data_post['image']
                            var date = data_post['date'].substring(0, 10).split("-")
                            var text = data_post['text']
                            var user = data_post['postBy']
                            // =======================
                            // console.log(image_url)
                            // console.log("Begin render card")
                            // =======================

                            let url = "http://localhost:3000/todos/get_user_info/" + t.state.username;
                            return fetch(url, {
                              method: "GET",
                              headers: {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                              }
                            })
                            .then(resp =>
                              resp.json().then(data => ({
                                  data: data,
                                  status: resp.status
                              })).then(res => {
                                    console.log(res)
                                    var data_post = res.data.data[0]
                                    t.state.name = data_post['name']
                                    t.state.region = data_post['region']
                                    t.state.petName = data_post['petName']
                                    t.state.num_post = data_post['num_post']
                                    t.state.num_follower = data_post['num_follower']
                                    t.state.num_followee = data_post['num_followee']

                                    return (
                                        <Card key={poid}>
                                            <CardItem>
                                                <Left>
                                                    <Thumbnail source={{uri: t.state.thumbnail}} />
                                                    <View style={{flex: 2, marginLeft: 10}}>
                                                        <Text>{user}</Text>
                                                        <Text note>{date[0] + '/' + date[1] + '/' + date[2]}</Text>
                                                    </View>
                                                </Left>
                                            </CardItem>
                                            <CardItem cardBody>
                                              <Image source={{uri: image_url}} style={{ height: 200, width: null, flex: 1 }} />
                                            </CardItem>
                                            <CardItem style={{ height: 35 }}>
                                                <Left>
                                                    <Button transparent>
                                                        <Icon name="ios-trash-outline" key={poid} style={{ color: 'black' }} onPress={() => {
                                                            // console.log(poid);

                                                            let url = "http://localhost:3000/todos/delete_post/" + poid
                                                            // console.log(url)
                                                            fetch(url, {
                                                              method: "DELETE",
                                                              headers: {
                                                                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                                                              },
                                                            })
                                                            .then(function(response){
                                                              // console.log(response.status)
                                                              if(response.status == '200'){
                                                                // console.log("success");
                                                                alert("Delete success")
                                                              }
                                                              else{
                                                                // console.log("ERROR");
                                                              }
                                                            });
                                                          }} />
                                                    </Button>
                                                </Left>
                                            </CardItem>
                                            <CardItem>
                                                <Body>
                                                    <Text>
                                                        <Text style={{ fontWeight: "900" }}>{text}</Text>
                                                    </Text>
                                                </Body>
                                            </CardItem>
                                        </Card>
                                      )
                                  })
                              )

                          // console.log(card_template)
                          // console.log("End render card")
                          // console.log("===============")
                          }
                          else{
                            alert("fetch error");
                            return (null)
                          }}
                    )
                  )

              }, {concurrency: 1}).then(function(results){
                    // console.log("result is out")
                    // console.log(results)
                    this.setState({
                      postlist: results
                    })
                    return results
                  }.bind(this)
              );
          }
          else{
            alert("fetch error");
          }
      }));
    }


    _onRefresh() {
        this.setState({refreshing: true});
        this.loadContent().then(() => {
          this.setState({
            refreshing: false
          });
        });
    }

    renderSection(){
      if (this.state.postlist){
        return this.state.postlist
      }else{
        this.loadContent()
        return (<Text>Loading...</Text>)
      }
    }


    render() {
        const { navigate } = this.props.navigation;
        console.log("Wo yao rende le !")
        return (
            <Container style={styles.container}>

                <Content refreshControl={
                          <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                          />
                        }>

                    <View style={{ paddingTop: 10 }}>

                        {/** User Photo Stats**/}
                        <View style={{ flexDirection: 'row' }}>

                            {/**User photo takes 1/3rd of view horizontally **/}
                            <View
                                style={{ flex: 2, alignItems: 'flex-start', marginLeft: 20, justifyContent: 'flex-start' }}>
                                <Icon name="ios-person" style={{ color: 'black' }}><Text style={{fontSize: 20}}> {this.state.name} </Text></Icon>
                                <Icon name="ios-pin" style={{ color: 'black' }}><Text style={{fontSize: 20}}> {this.state.region} </Text></Icon>
                                <Icon name="ios-paw" style={{ color: 'black' }}><Text style={{fontSize: 20}}> {this.state.petName} </Text></Icon>
                            </View>

                            {/**User Stats take 2/3rd of view horizontally **/}
                            <View style={{ flex: 3 }}>

                                {/** Stats **/}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                        alignItems: 'flex-end'
                                    }}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text>{this.state.num_post}</Text>
                                        <Text style={{ fontSize: 10, color: 'grey' }}>Posts</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text>{this.state.num_follower}</Text>
                                        <Text style={{ fontSize: 10, color: 'grey' }}>Followers</Text>
                                    </View>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text>{this.state.num_followee}</Text>
                                        <Text style={{ fontSize: 10, color: 'grey' }}>Following</Text>
                                    </View>
                                </View>

                                {/**Edit profile and Settings Buttons **/}
                                <View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingTop: 10 }}>

                                    <View
                                        style={{ flexDirection: 'column' }}>

                                        {/** Edit profile takes up 3/4th **/}
                                        <Button bordered dark
                                          onPress={() => this.props.navigation.navigate("EditProfile", {username: this.props.navigation.state.params.username})}
                                          style={{ flex:3, marginLeft: 20, marginRight: 20, justifyContent: 'center', marginBottom: 5, height: 30, width: 180}}><Text>Edit Profile</Text>
                                        </Button>
                                        <Button bordered dark
                                          onPress={() => this.props.navigation.dispatch(
                                                            NavigationActions.reset({
                                                              index: 0,
                                                              actions: [
                                                                NavigationActions.navigate({
                                                                  routeName: "Login",
                                                                })
                                                              ]
                                                            })
                                                          )
                                                        }
                                          style={{ flex:3, marginLeft: 20, marginRight: 20, justifyContent: 'center', height: 30, width: 180}}><Text>Logout</Text>
                                        </Button>

                                    </View>
                                </View>{/**End edit profile**/}
                            </View>
                        </View>


                    </View>


                    <View >

                        {this.renderSection()}

                    </View>
                </Content>
            </Container >
        );
    }
}


export default ProfileTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});
