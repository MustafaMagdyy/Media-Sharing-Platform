import React, { useState, useEffect } from 'react';
import { getMedia } from '../services/api';
import MediaItem from './MediaItem';

const MediaList = () => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    getMedia()
      .then(data => {
        console.log('MediaList data:', data); // Add console log
        if (Array.isArray(data)) {
          setMedia(data);
        } else {
          console.error('Expected an array but got:', data);
        }
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      {media.map(item => (
        <MediaItem key={item._id} item={item} />
      ))}
    </div>
  );
};

export default MediaList;
