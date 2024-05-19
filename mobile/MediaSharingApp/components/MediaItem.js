import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { likeMedia, unlikeMedia } from '../services/api';

const MediaItem = ({ item }) => {
  const [liked, setLiked] = useState(item.liked);

  const handleLike = async () => {
    try {
      await likeMedia(item._id);
      setLiked(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnlike = async () => {
    try {
      await unlikeMedia(item._id);
      setLiked(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.mediaItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
      {item.fileUrl.endsWith('.mp4') ? (
        <Video source={{ uri: item.fileUrl }} useNativeControls style={styles.media} />
      ) : (
        <Image source={{ uri: item.fileUrl }} style={styles.media} />
      )}
      <View style={styles.buttonContainer}>
        {liked ? (
          <Button title="Unlike" onPress={handleUnlike} />
        ) : (
          <Button title="Like" onPress={handleLike} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mediaItem: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  media: {
    width: '100%',
    height: 200,
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default MediaItem;
