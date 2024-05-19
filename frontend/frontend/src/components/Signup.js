import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../services/api';
import { useUser } from '../context/UserContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await signupUser({ name, email, password, passwordConfirm });
      setUser(response.data.data.user);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <div className="container">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button type="submit">Signup</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Signup;
