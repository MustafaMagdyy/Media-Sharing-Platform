import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { fetchMedia, uploadMedia } from '../services/api';
import { useUser } from '../context/UserContext';
import MediaItem from '../components/MediaItem';

const HomeScreen = ({ navigation }) => {
  const [media, setMedia] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const { user, loading } = useUser();

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        const response = await fetchMedia();
        setMedia(response.data.media);  // Ensure this matches the structure of your response
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    fetchMediaData();
  }, []);

  const handleUpload = async () => {
    setError('');
  
    if (!user) {
      setError('You must be logged in to upload media.');
      return;
    }
  
    if (file) {
      const validMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mpeg'];
      if (!validMimeTypes.includes(file.type)) {
        setError('Invalid file type. Only images and videos are allowed.');
        return;
      }
  
      try {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('photo', {
          uri: file.uri,
          type: file.type,
          name: file.fileName || file.name,
        });
  
        const response = await uploadMedia(formData);
        console.log('Upload response:', response.data);
        const mediaResponse = await fetchMedia();
        setMedia(mediaResponse.data.data);
        setTitle('');
        setDescription('');
        setFile(null);
      } catch (error) {
        console.error('Error uploading media:', error);
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError('An error occurred while uploading media.');
        }
      }
    }
  };
  

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile({
      uri: URL.createObjectURL(selectedFile),
      type: selectedFile.type,
      name: selectedFile.name,
    });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Media Gallery</Text>
      {user && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          {Platform.OS === 'web' ? (
            <>
              <input type="file" onChange={handleFileChange} style={styles.fileInput} />
              <Button title="Upload" onPress={handleUpload} />
            </>
          ) : (
            <TouchableOpacity onPress={handleUpload}>
              <Text style={styles.button}>Choose File</Text>
              <Text style={styles.button}>Upload</Text>
            </TouchableOpacity>
          )}
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      )}
      <FlatList
        data={media}
        renderItem={({ item }) => <MediaItem item={item} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  form: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  button: {
    backgroundColor: '#4caf50',
    color: 'white',
    padding: 10,
    margin: 5,
    textAlign: 'center',
    borderRadius: 4,
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
  fileInput: {
    marginBottom: 8,
  },
});

export default HomeScreen;
