import React from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { heightToDp, widthToDp } from '../../components/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class ImagePreviewScreen extends React.Component {
    render = () => (
        <SafeAreaView style={{flex:1}}>
            <LinearGradient
                colors={['#fff', '#1b1b1b']}
            >
                <Image
                source={this.props.route.params.image}
                style={{height: heightToDp("100%"), width: widthToDp("100%"), resizeMode: "contain"}}
                />
            </LinearGradient> 
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    top: heightToDp("2%"),
                    left: widthToDp("3.5%"),
                    backgroundColor: "#1b1b1b",
                    height: 50, 
                    width: 50,
                    borderRadius: 50 / 2,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
                activeOpacity={0.7}
                onPress={() => this.props.navigation.goBack()}
            >
                <Icon
                    name="chevron-left"
                    color="#fff"
                    size={20}                    
                />  
            </TouchableOpacity>            
            <View
                style={{
                    position: 'absolute',
                    bottom: heightToDp("4%"),
                    right: widthToDp("4%"),
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <Icon
                    name="heart"
                    color="#fff"
                    size={25}
                />
                <Text
                    style={{
                        color: "#fff",
                        fontSize: widthToDp("3.5%"),
                        paddingLeft: widthToDp("2%")
                    }}
                >0</Text>
                <Icon
                    name="comment"
                    color="#fff"
                    size={25}
                    style={{paddingLeft: widthToDp("4%")}}
                />
                <Text
                    style={{
                        color: "#fff",
                        fontSize: widthToDp("3.5%"),
                        paddingLeft: widthToDp("2%")
                    }}
                >0</Text>
                <Icon
                    name="trash-alt"
                    color="#fff"
                    size={25}
                    style={{paddingLeft: widthToDp("4%")}}
                />
            </View> 
            <Icon
                name="pen"
                color="#fff"
                size={20}
                style={{
                    position: 'absolute',
                    bottom: heightToDp("12%"),
                    right: widthToDp("3.5%"),
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            />         
        </SafeAreaView>
    )
}