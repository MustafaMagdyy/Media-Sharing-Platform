import React, { useState, useEffect } from 'react';
import { likeMedia, unlikeMedia } from '../services/api';

const MediaItem = ({ item }) => {
  const [liked, setLiked] = useState(item.liked);
  const [likesCount, setLikesCount] = useState(item.likes);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setLiked(item.liked);
  }, [item.liked]);

  const handleLike = async () => {
    try {
      await likeMedia(item._id);
      setLiked(true);
      setLikesCount(likesCount + 1);
      setMessage('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error liking media.');
    }
  };

  const handleUnlike = async () => {
    try {
      await unlikeMedia(item._id);
      setLiked(false);
      setLikesCount(likesCount - 1);
      setMessage('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error unliking media.');
    }
  };

  return (
    <div className="media-item">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      {item.fileUrl.endsWith('.mp4') ? (
        <video src={item.fileUrl} controls />
      ) : (
        <img src={item.fileUrl} alt={item.title} />
      )}
      <div>
        <p>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</p>
        <button onClick={handleLike}>Like</button>
        <button onClick={handleUnlike}>Unlike</button>
        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
};

export default MediaItem;
