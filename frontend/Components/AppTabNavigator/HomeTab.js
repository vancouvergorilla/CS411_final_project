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
import CardComponent from '../CardComponent'
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { SwitchNavigator, StackNavigator, NavigationActions } from 'react-navigation'
import { FormLabel, FormInput } from 'react-native-elements'

var { height, width } = Dimensions.get('window');
var Promise = require('bluebird');
var update = 0;

class HomeTab extends Component {
    constructor(props) {
      super(props);
      this.state = {
        username: this.props.navigation.state.params.username,
        refreshing: false,
        follow_list: {},
        is_followed: {},
        like_dict: {},
        heart_dict: {},
        can_be_liked: {},
        thumbnail: {},
        ok: 0,
      };
      this.renderSection = this.renderSection.bind(this)
      this.loadContent = this.loadContent.bind(this)
      this._onRefresh = this._onRefresh.bind(this)
      this.likeClicked = this.likeClicked.bind(this)
    }

    _onRefresh() {
        this.setState({refreshing: true});
        let keys = Object.keys(this.state.follow_list)
        let t = this
        let follower = this.state.username
        Promise.map(keys, function(keys){
          // console.log(keys)
          if(t.state.follow_list[keys] === "follow"){
            let url = "http://localhost:3000/todos/unfollow/" + follower + "/" + keys
            // console.log(url)
            fetch(url, {
              method: "DELETE",
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              }
            })
            .then((response)=>{
                if(response.status == 200){
                  console.log("update following success")
                }
                else{
                  console.log("update following failed")
                }
            })
          }
          else{
            let url = "http://localhost:3000/todos/update_following/" + follower + "/" + keys
            fetch(url, {
              method: "POST",
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
              }
            })
            .then((response)=>{
                if(response.status == 200){
                  console.log("update following success")
                }
                else{
                  console.log("update following failed")
                }
            })
          }
        }).then(function(){
          t.loadContent().then(() => {
            t.setState({
              refreshing: false
            });
          });
        })
    }

    static navigationOptions = {

        tabBarIcon: ({ tintColor }) => (
            <Icon name="ios-home" style={{ color: tintColor }} />
        ),
        title: 'PetMania',
        headerLeft: null,
        swipeEnabled: false,
    }

    renderSection(){
      if (this.state.postlist){
        return this.state.postlist
      }else{
        this.loadContent()
        return (<Text>Loading...</Text>)
      }
    }

    handleUnfollow(follower, followee, isFollowed){
      if(isFollowed){
          console.log("go unfollow")
          this.setState({
            follow_list: {
              [followee]: "follow",
            },
            is_followed: {
              [followee]: 0,
            },
          }, function(){
            if(update === 1){
                let url = "http://localhost:3000/todos/unfollow/" + follower + "/" + followee
                // console.log(url)
                fetch(url, {
                  method: "DELETE",
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                  }
                })
                .then((response)=>{
                    if(response.status == 200){
                      console.log("update following success")
                    }
                    else{
                      console.log("update following failed")
                    }
                })
            }
            console.log(this.state.follow_list[followee])
            this.loadContent(0)
          })
      }
      else{
          console.log("go follow")
          this.setState({
            follow_list: {
              [followee]: "followed",
            },
            is_followed: {
              [followee]: 1,
            },
          }, function(){
            if(update === 1){
              let url = "http://localhost:3000/todos/update_following/" + follower + "/" + followee
              fetch(url, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                }
              })
              .then((response)=>{
                  if(response.status == 200){
                    console.log("update following success")
                  }
                  else{
                    console.log("update following failed")
                  }
              })
            }
            console.log(this.state.follow_list[followee])
            this.loadContent(0)
          })
      }
    }

    likeClicked(poid, can_be_liked){
      console.log("Clicked! Poid: "+ poid + ", can_be_liked: " + can_be_liked)

      var like_dict_poid = 0;
      if(poid in this.state.like_dict){
          like_dict_poid = this.state.like_dict[poid]
      }
      if(can_be_liked === 1){
        this.setState({
          can_be_liked: {
            [poid]: 0,
          },
          heart_dict: {
            [poid]: 'ios-heart',
          },
          like_dict: {
            [poid]: like_dict_poid + 1,
          },
        }, function(){
              // console.log(this.state);
              this.loadContent(0)

              let url = "http://localhost:3000/todos/update_likes/" + poid + "/" + this.state.like_dict[poid]
              fetch(url, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                }
              })
              .then((response)=>{
                console.log(response.status)
                if(response.status == '200'){
                    let url = "http://localhost:3000/todos/update_likedPOID/" + this.state.username + "/" + poid
                    // console.log(url)
                    fetch(url, {
                      method: "POST",
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                      }
                    })
                    .then((resp)=>{
                      if(resp.status == '200'){
                        console.log("add like")
                      }
                      else{
                        console.log("ERROR2")
                      }
                    })
                }
                else{
                  console.log("ERROR1")
                }
              });
            });
      }else{
        this.setState({
          can_be_liked: {
            [poid]: 1,
          },
          heart_dict: {
            [poid]: 'ios-heart-outline',
          },
          like_dict: {
            [poid]: like_dict_poid - 1,
          },
        }, function(){
          console.log(this.state);
          this.loadContent(0)

          let url = "http://localhost:3000/todos/update_likes/" + poid + "/" + this.state.like_dict[poid]
          fetch(url, {
            method: "POST",
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            }
          })
          .then((response)=>{
            console.log(response.status)
            if(response.status == '200'){
                let url = "http://localhost:3000/todos/delete_likedPOID/" + this.state.username + "/" + poid
                // console.log(url)
                fetch(url, {
                  method: "DELETE",
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                  }
                })
                .then((resp)=>{
                  if(resp.status == '200'){
                    console.log("delete like")
                  }
                  else{
                    console.log("ERRDELETE")
                  }
                })
            }
            else{
              console.log("ERRORUPDATE")
            }
          });

        });
      }
    }

    loadContent(){
      // console.log(this.state.username)
      let url = "http://localhost:3000/todos/fetch_following_post/" + this.state.username.toLowerCase()
      // console.log(url)
      var post_res = null
      var t = this

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
          console.log(res)
          var data_arr = (res.data.data).reverse()
          // console.log(data_arr)
          if(res.status == '200'){
            // alert("TODO");
            console.log("success 1");
            Promise.map(data_arr, function(data_arr){
                var poid = data_arr['POID']
                // console.log('current poid: ' + poid)
                let url = "http://localhost:3000/todos/search_exact_is/Post/POID/" + poid

                var card_template = "Not changed yet..........."
                var idx = 0

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
                            console.log("success 2");
                            // console.log(data_post)
                            var image_url = data_post['image']
                            var date = data_post['date'].substring(0, 10).split("-")
                            var text = data_post['text']
                            var user = data_post['postBy']
                            var likes = data_post['likes']
                            let like_dict_tmp = t.state.like_dict
                            let heart_dict_tmp = t.state.heart_dict
                            if (!like_dict_tmp[poid]){
                              like_dict_tmp[poid] = likes
                            }
                            if (!t.state.follow_list[user]){
                              t.state.follow_list[user] = "followed"
                              t.state.is_followed[user] = 1
                            }

                            let url = "http://localhost:3000/todos/isLike/" + t.state.username + "/" + poid

                            return fetch(url, {
                              method: "GET",
                              headers: {
                                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                                }
                            }).then(res => {
                                if(res.status == 200){
                                    t.state.can_be_liked[poid] = 0
                                    heart_dict_tmp[poid] = 'ios-heart'
                                }
                                else{
                                    t.state.can_be_liked[poid] = 1
                                    heart_dict_tmp[poid] = 'ios-heart-outline'
                                }
                                t.setState({
                                  like_dict: like_dict_tmp,
                                  heart_dict: heart_dict_tmp,
                                  ok: 1,
                                })
                                console.log("Begin render card")
                                while(!t.state.ok){}
                                t.state.ok = 0

                                let url = "http://localhost:3000/todos/search_exact_is/User/username/" + user

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
                                        // console.log(thumbnail_url)
                                        return (
                                      <Card key={poid}>
                                          <CardItem>
                                              <Left>
                                                  <Thumbnail source={{uri: thumbnail_url}} />
                                                  <View style={{flex: 2, marginLeft: 10}}>
                                                      <Text>{user}</Text>
                                                      <Text note>{date[0] + '/' + date[1] + '/' + date[2]}</Text>
                                                  </View>
                                                  <View style={{flex: 1, marginLeft:100}}>
                                                      <Button small bordered dark onPress={()=>{
                                                          t.handleUnfollow(t.state.username, user, t.state.is_followed[user])
                                                        }}>
                                                        <Text id={user}>{t.state.follow_list[user]}</Text>
                                                      </Button>
                                                  </View>
                                              </Left>
                                          </CardItem>
                                          <CardItem cardBody>
                                            <Image source={{uri: image_url}} style={{ height: 200, width: null, flex: 1 }} />
                                          </CardItem>
                                          <CardItem style={{ height: 45 }}>
                                              <Left>
                                                  <Button transparent onPress={() => {t.likeClicked(poid, t.state.can_be_liked[poid])}}>
                                                      <Icon name= {t.state.heart_dict[poid]} style={{ color: 'black' }} />
                                                  </Button>
                                                  <Text>{t.state.like_dict[poid]}</Text>
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
                                })
                          // console.log(card_template)
                          // console.log("End render card")
                          // console.log("===============")
                          }
                          else{
                            alert("fetch error");
                            return (null)
                          }
                      })
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

    render() {
        return (
            <Container style={styles.container}>
              <Content refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh.bind(this)}
                        />
                      }>
                        <View >

                            {this.renderSection(0)}

                        </View>
                </Content>
            </Container>
        );
    }
}
export default HomeTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});
