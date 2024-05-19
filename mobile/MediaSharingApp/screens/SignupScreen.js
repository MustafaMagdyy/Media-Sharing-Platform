import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signupUser } from '../services/api';
import { useUser } from '../context/UserContext';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useUser();
  const navigation = useNavigation();

  const handleSubmit = async () => {
    setError('');

    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await signupUser({ name, email, password, passwordConfirm });
      setUser(response.data.user);
      navigation.navigate('Home');
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
      />
      <Button title="Signup" onPress={handleSubmit} />
      {error && <Text style={styles.error}>{error}</Text>}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
    borderRadius: 4,
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
});

export default SignupScreen;
