import React, { useState, useEffect } from 'react';
import { fetchMedia, uploadMedia } from '../services/api';
import { useUser } from '../context/UserContext';
import MediaItem from './MediaItem';

const Home = () => {
  const [media, setMedia] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const { user, loading } = useUser();
  //const navigate = useNavigate();

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        const response = await fetchMedia();
        setMedia(response.data.data);
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    fetchMediaData();
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
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
        formData.append('photo', file);

        await uploadMedia(formData);
        const response = await fetchMedia();
        setMedia(response.data.data);
        setTitle('');
        setDescription('');
        setFile(null);
      } catch (error) {
        console.error('Error uploading media:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  return (
    <div className="container">
      <h2>Media Gallery</h2>
      <form onSubmit={handleUpload}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <div>
        {media.map((item) => (
          <MediaItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Home;
