import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";

import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base'

class CardComponent extends Component {
    constructor(){
      super();
      this.state={
        follow_status: "follow"
      }
      this.onPressLearnMore = this.onPressLearnMore.bind(this);
    }


    onPressLearnMore() {
      if (this.state.follow_status == "follow"){
        this.setState({
          follow_status: "followed"
        })
      }
      else{
        this.setState({
          follow_status: "follow"
        })
      }
    }

    render() {

        const images = {

            "1": require('../assets/feed_images/1.jpg'),
            "2": require('../assets/feed_images/2.jpg'),
            "3": require('../assets/feed_images/3.png')
        }

        return (
            <Card>
                <CardItem>
                    <Left>
                            <View style={{flex: 2}}>
                                <Text>Varun </Text>
                                <Text note>Jan 15, 2018</Text>
                            </View>
                            <View style={{flex: 1, marginLeft:150}}>
                                <Button small bordered dark
                                  onPress={this.onPressLearnMore}
                                  >
                                  <Text>{this.state.follow_status}</Text>
                                </Button>
                            </View>
                    </Left>
                </CardItem>
                <CardItem cardBody>
                    <Image source={images[this.props.imageSource]} style={{ height: 200, width: null, flex: 1 }} />
                </CardItem>
                <CardItem style={{ height: 45 }}>
                    <Left>
                        <Button transparent>
                            <Icon name="ios-heart-outline" style={{ color: 'black' }} />
                        </Button>
                        <Text>{this.props.likes} </Text>
                    </Left>
                </CardItem>

                <CardItem>
                    <Body>
                        <Text>
                            <Text style={{ fontWeight: "900" }}>varun
                            </Text>
                            Ea do Lorem occaecat laborum do. Minim ullamco ipsum minim eiusmod dolore cupidatat magna exercitation amet proident qui. Est do irure magna dolor adipisicing do quis labore excepteur. Commodo veniam dolore cupidatat nulla consectetur do nostrud ea cupidatat ullamco labore. Consequat ullamco nulla ullamco minim.
                        </Text>
                    </Body>
                </CardItem>
            </Card>
        );
    }
}
export default CardComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
