import React, { useState } from 'react';
import { uploadMedia } from '../services/api';

const UploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setUploadStatus('No file selected.');
      return;
    }

    const mediaData = {
      title,
      description,
      file,
    };

    try {
      const response = await uploadMedia(mediaData);
      console.log('Upload successful:', response);
      setUploadStatus('Upload successful!');
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Upload failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      {uploadStatus && <p>{uploadStatus}</p>}
    </form>
  );
};

export default UploadForm;
