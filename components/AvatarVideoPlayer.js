import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Video } from 'expo-av';

const SCREEN_WIDTH = Dimensions.get('window').width;

const AvatarVideoPlayer = ({ videoUri, isIdle = false, onPlaybackStatusUpdate }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isIdle) {
        videoRef.current.setIsLoopingAsync(true);
      } else {
        videoRef.current.setIsLoopingAsync(false);
      }
    }
  }, [isIdle]);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={videoUri}
        style={styles.video}
        useNativeControls={false}
        resizeMode="cover"
        shouldPlay
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH, // Square aspect ratio
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 20,
    marginVertical: 20,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});

export default AvatarVideoPlayer;