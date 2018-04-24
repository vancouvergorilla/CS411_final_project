import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    FlatList,
    RefreshControl,
    TextInput,
} from "react-native";

import { Card, CardItem, Thumbnail, Container, Content, Icon, Header, Left, Body, Right, Segment, Button, Item, Input, Label, Form } from 'native-base'
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { SwitchNavigator, StackNavigator, NavigationActions } from 'react-navigation'
import { FormLabel, FormInput } from 'react-native-elements'

var { height, width } = Dimensions.get('window');
var Promise = require('bluebird');

class SearchTab extends Component {

    constructor(props) {
      super(props);
      this.state = {
        username: this.props.navigation.state.params.username,
        searchText: '',
        postlist: '',
        like_dict: {}, // number of likes
        heart_dict: {}, // heart type
        can_be_liked: {}, // is the user like it before
        ok: 0,
        follow_list: {}, // "follow" or "unfollow"
        is_followed: {}, // is the user follow another
      };
      this.likeClicked = this.likeClicked.bind(this)
      this.setSearchText = this.setSearchText.bind(this)
      this.fetchData = this.fetchData.bind(this)
      this.render_recommendation = this.render_recommendation.bind(this)
      this.handleFollow = this.handleFollow.bind(this)
    }

    static navigationOptions = {

        tabBarIcon: ({ tintColor }) => (
            <Icon name="ios-search" style={{ color: tintColor }} />
        ),
        title: 'PetMania',
        headerLeft: null,
        swipeEnabled: false,
    }

    componentWillMount(){
      this.render_recommendation()
    }

    handleFollow(follower, followee, isFollowed, which_one){
      if(isFollowed){
          // console.log("go unfollow")
          this.setState({
            follow_list: {
              [followee]: "follow",
            },
            is_followed: {
              [followee]: 0,
            },
          }, function(){
              let url = "http://localhost:3000/todos/unfollow/" + follower + "/" + followee
              fetch(url, {
                method: "DELETE",
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                }
              })
              .then((response)=>{
                  if(response.status == 200){
                    // console.log("update following success")
                  }
                  else{
                    // console.log("update following failed")
                  }
              })
              if(which_one){
                this.render_recommendation()
              }
              else{
                this.fetchData()
              }
          })
      }
      else{
          // console.log("go follow")
          this.setState({
            follow_list: {
              [followee]: "followed",
            },
            is_followed: {
              [followee]: 1,
            },
          }, function(){
              let url = "http://localhost:3000/todos/update_following/" + follower + "/" + followee
              fetch(url, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                }
              })
              .then((response)=>{
                  if(response.status == 200){
                    // console.log("update following success")
                  }
                  else{
                    // console.log("update following failed")
                  }
              })
              if(which_one){
                this.render_recommendation()
              }
              else{
                this.fetchData()
              }
          })
      }
    }

    render_recommendation(){
        let t = this
        let url = "http://localhost:3000/todos/get_recommendation/" + "orz"
        fetch(url, {
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
              var data_arr = res.data.data
              // console.log(data_arr)
              Promise.map(data_arr, function(data_arr){
                var poid = data_arr['POID']
                var date = data_arr['date'].substring(0, 10).split("-")
                var image_url = data_arr['image']
                var user = data_arr['postBy']
                var text = data_arr['text']
                var likes = data_arr['likes']
                console.log(date[0])
                var heart_dict_tmp = t.state.heart_dict
                var like_dict_tmp = t.state.like_dict
                var follow_list_tmp = t.state.follow_list
                var is_followed_tmp = t.state.is_followed

                if (!like_dict_tmp[poid]){
                  like_dict_tmp[poid] = likes
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
                    while(!t.state.ok){}
                    t.state.ok = 0

                    let url = "http://localhost:3000/todos/isFollow/" + t.state.username + "/" + user
                    return fetch(url, {
                      method: "GET",
                      headers: {
                          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                        }
                    }).then(res => {
                      if(res.status === 200){
                          follow_list_tmp[user] = "followed"
                          is_followed_tmp[user] = 1
                      }
                      else{
                          follow_list_tmp[user] = "follow"
                          is_followed_tmp[user] = 0
                      }
                      t.setState({
                        follow_list: follow_list_tmp,
                        is_followed: is_followed_tmp,
                        ok: 1,
                      })
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
                                                    t.handleFollow(t.state.username, user, t.state.is_followed[user], 1)
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
                                            <Button transparent onPress={() => {t.likeClicked(poid, t.state.can_be_liked[poid], 1)}}>
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
                })
              }).then(function(results){
                    // console.log(results)
                    t.setState({
                      postlist: results
                    })
              })
          })
        )
    }

    likeClicked(poid, can_be_liked, which_one){
      // console.log("Clicked! Poid: "+ poid + ", can_be_liked: " + can_be_liked)

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
              if(which_one){
                this.render_recommendation()
              }
              else{
                this.fetchData()
              }

              let url = "http://localhost:3000/todos/update_likes/" + poid + "/" + this.state.like_dict[poid]
              fetch(url, {
                method: "POST",
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                }
              })
              .then((response)=>{
                // console.log(response.status)
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
                        // console.log("add like")
                      }
                      else{
                        // console.log("ERROR2")
                      }
                    })
                }
                else{
                  // console.log("ERROR1")
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
          // console.log(this.state);
          if(which_one){
            this.render_recommendation()
          }
          else{
            this.fetchData()
          }

          let url = "http://localhost:3000/todos/update_likes/" + poid + "/" + this.state.like_dict[poid]
          fetch(url, {
            method: "POST",
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            }
          })
          .then((response)=>{
            // console.log(response.status)
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
                    // console.log("delete like")
                  }
                  else{
                    // console.log("ERRDELETE")
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

    setSearchText(event) {
        let currSearchText = event.nativeEvent.text.toLowerCase();
        this.setState({searchText: currSearchText});
    }

    fetchData(event){
      let t = this
      if(this.state.searchText == ''){
        this.render_recommendation();
      }
      let url = "http://localhost:3000/todos/search_keyword/" + this.state.searchText
      return fetch(url, {
        method: "GET",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        }
      })
      .then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            })
        ).then(async (res) => {
            var data_arr = res.data.data
            // console.log(data_arr)
            Promise.map(data_arr, function(data_arr){
              var poid = data_arr['POID']
              var date = data_arr['date'].substring(0, 10).split("-")
              var image_url = data_arr['image']
              var user = data_arr['postBy']
              var text = data_arr['text']
              var likes = data_arr['likes']

              var heart_dict_tmp = t.state.heart_dict
              var like_dict_tmp = t.state.like_dict
              var follow_list_tmp = t.state.follow_list
              var is_followed_tmp = t.state.is_followed

              if (!like_dict_tmp[poid]){
                like_dict_tmp[poid] = likes
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

                  while(!t.state.ok){}
                  t.state.ok = 0

                  let url = "http://localhost:3000/todos/isFollow/" + t.state.username + "/" + user
                  return fetch(url, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                      }
                  }).then(res => {
                    if(res.status === 200){
                        follow_list_tmp[user] = "followed"
                        is_followed_tmp[user] = 1
                    }
                    else{
                        follow_list_tmp[user] = "follow"
                        is_followed_tmp[user] = 0
                    }
                    t.setState({
                      follow_list: follow_list_tmp,
                      is_followed: is_followed_tmp,
                      ok: 1,
                    })
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
                            console.log(thumbnail_url)

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
                                              t.handleFollow(t.state.username, user, t.state.is_followed[user], 0)
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
                                      <Button transparent onPress={() => {t.likeClicked(poid, t.state.can_be_liked[poid], 0)}}>
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

                    return (
                      <Card key={poid}>
                      <CardItem>
                          <Left>
                              <Thumbnail source={require('../assets/me.jpg')} />
                              <View style={{flex: 2, marginLeft: 10}}>
                                  <Text>{user}</Text>
                                  <Text note>{date[0] + '/' + date[1] + '/' + date[2]}</Text>
                              </View>
                              <View style={{flex: 1, marginLeft:100}}>
                                  <Button small bordered dark onPress={()=>{
                                      t.handleFollow(t.state.username, user, t.state.is_followed[user], 0)
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
                              <Button transparent onPress={() => {t.likeClicked(poid, t.state.can_be_liked[poid], 0)}}>
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
              })

            }).then(function(results){
                  this.setState({
                    postlist: results
                  })
                  return results
                }.bind(this)
            )
          })
        )
    }

    render() {
        return (
          <Container>
          <Content>
              <View style={styles.container}>
                <TextInput
                   style={styles.searchBar}
                   value={this.state.searchText}
                   onChange={this.setSearchText.bind(this)}
                   onSubmitEditing={this.fetchData.bind(this)}
                   placeholder= "Search" />
              </View>
              <View>
                  {this.state.postlist}
              </View>
          </Content>
          </Container>
        );
    }
}
export default SearchTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchContainer: {
        width: Dimensions.get('window').width,
        position: 'absolute',
        top: 0
    },
    textContainer: {
        width: Dimensions.get('window').width - 20,
        position: 'absolute',
        top: 0
    },
    searchBar: {
      paddingLeft: 30,
      fontSize: 22,
      height: 60,
      width: Dimensions.get('window').width,
      borderWidth: 9,
      borderColor: '#E4E4E4',
    },
});
