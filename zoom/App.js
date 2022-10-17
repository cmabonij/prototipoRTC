import React from 'react';
import { View, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { mediaDevices, RTCView } from 'react-native-webrtc';
import { connect } from 'react-redux';
import { jointRoom } from './src/store/actions/videoActions';

class App extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    let isFront = true;
    mediaDevices.enumerateDevices().then((sourceInfos) => {
      console.log(sourceInfos);
      let videoSourceId;
      for (let i = 0; i < sourceInfos.leght; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }

      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: 500,
              minHeight: 300,
              minFrameRate: 30,
            },
            facingMode: isFront ? 'user' : 'environment',
            optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
          },
        })
        .then((stream) => {
          this.props.jointRoom(stream);
        })
        .catch((error) => {
          //error
        });
    });
  }

  render() {
    const { width, height } = Dimensions.get('window');
    return (
      <View style={{ flex: 1, justifyContent: 'flex-start', padding: 10 }}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          height: height * 0.5,
          borderColor: 'yellow',
          borderWidth: 4,
        }}>
          {this.props.video.myStream ? (
            <RTCView streamURL={this.props.video.myStream.toURL()}
              style={{ width, height: height * 0.4 }} />
          ) : null}
        </View>
        <View style={{ flex: 1, backgroundColor: 'black' }}>
          <ScrollView horizontal style={{ padding: 10 }}>
            <>
              <>
                {[1].map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: 280,
                      backgroundColor: 'red',
                      borderWidth: 1,
                      borderColor: '#fff',
                      marginRight: 10,
                      padding: 5,
                    }}></View>
                ))}
              </>
            </>
            <>
              <View style={{
                width: 280,
                backgroundColor: 'blue',
                borderWidth: 1,
                borderColor: '#fff',
                marginRight: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}></View>
            </>
          </ScrollView>
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({ video }) => ({
  video,
});

export default connect(mapStateToProps, { jointRoom })(App);