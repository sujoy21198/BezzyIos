import React, { Component } from 'react'
import { View } from 'react-native'
import { heightToDp, widthToDp } from '../../components/Responsive';
import LinearGradient from 'react-native-linear-gradient';
import Video from 'react-native-video'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DataAccess from '../../components/DataAccess';

export default class VideoPlayerScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            postID: '',
            ID: '',
            type: '',
            videoUrl: ''
        }
        this.state.postID = this.props.route.params.postID
        this.state.ID = this.props.route.params.ID
        this.state.type = this.props.route.params.type

        // alert(this.state.postID)
        // alert(this.state.ID)
        // alert(this.state.type)
    }

    componentDidMount() {
        this.getVideoData()
    }

    getVideoData = async () => {
        let value = await AsyncStorage.getItem('userId')
        var videoUrl
        await axios.get(DataAccess.BaseUrl + DataAccess.GetVideoDetails + "/" + this.state.ID + "/" + this.state.postID + "/" + this.state.type + "/" + value)
            .then(function (response) {
                console.log(response.data)
                videoUrl = response.data.post_details.url
            })
        this.setState({ videoUrl: videoUrl })
        alert(videoUrl)
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#1b1b1b' }}>
                <LinearGradient
                    style={{ paddingTop: heightToDp("10%") }}
                    colors={['#fff', '#1b1b1b']}
                >
                    <Video
                        source={{ uri: this.state.videoUrl }}
                        ref={(ref) => {
                            this.player = ref
                        }}
                        onBuffer={this.onBuffer}
                        onError={this.videoError}
                        controls={true}
                        style={{
                            height: heightToDp("30%"),
                            width: widthToDp("70%"),
                            alignSelf: 'center'
                        }}

                    />
                </LinearGradient>
            </View>
        )
    }
}