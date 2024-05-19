import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Header from './components/Header';
import { UserProvider } from './context/UserContext';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
